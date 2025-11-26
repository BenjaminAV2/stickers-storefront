import Link from 'next/link'

export default function AdminCustomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link
                href="/admin"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                ← Retour Admin Payload
              </Link>
              <Link
                href="/admin-custom/dashboard"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
              >
                Dashboard
              </Link>
              <Link
                href="/admin-custom/orders"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
              >
                Commandes
              </Link>
              <Link
                href="/admin-custom/statistics"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
              >
                Statistiques
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu */}
      <main>{children}</main>
    </div>
  )
}
