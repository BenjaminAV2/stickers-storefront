import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Routes publiques
  const publicRoutes = [
    '/',
    '/products',
    '/auth/signin',
    '/auth/signup',
    '/auth/error',
    '/api/auth',
  ]

  // Routes admin qui nécessitent une authentification admin
  const adminRoutes = ['/admin', '/dashboard', '/statistics', '/orders-list']

  // Routes client qui nécessitent une authentification client
  const protectedClientRoutes = ['/account', '/orders']

  // Vérifier si la route actuelle correspond à un chemin public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route) || pathname === route
  )

  // Permettre l'accès aux routes publiques, assets et API
  if (
    isPublicRoute ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Vérifier si c'est une route admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Vérifier si c'est une route protégée client
  const isProtectedClientRoute = protectedClientRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Récupérer le token JWT pour vérifier la session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Si pas de token (session), rediriger vers la page de connexion
  if (!token) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Si route admin, vérifier que l'utilisateur est admin
  if (isAdminRoute && !token.isAdmin) {
    return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
