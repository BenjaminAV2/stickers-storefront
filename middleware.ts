import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

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

  // Si pas de session, rediriger vers la page de connexion
  if (!session) {
    const signInUrl = new URL('/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Si route admin, vérifier que l'utilisateur est admin
  if (isAdminRoute && !session.user.isAdmin) {
    return NextResponse.redirect(new URL('/auth/error?error=AccessDenied', req.url))
  }

  // Si route client protégée, vérifier que l'utilisateur est connecté (déjà fait ci-dessus)
  // Mais on peut aussi vérifier que ce n'est pas un admin qui essaie d'accéder à l'espace client
  // (optionnel, selon vos besoins)

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
