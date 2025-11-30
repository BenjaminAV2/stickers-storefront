import React from 'react'
import Link from 'next/link'
import '@/app/globals.css'

export default function CustomAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-xl font-bold">Exclusives Stickers</h1>
              <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
            </div>
            <nav className="p-4">
              <div className="space-y-2">
                <Link
                  href="/dashboard-v2"
                  className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/statistics-v2"
                  className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  📈 Statistiques
                </Link>
                <Link
                  href="/orders-list-v2"
                  className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  📋 Liste Commandes
                </Link>
                <Link
                  href="/admin-custom/orders"
                  className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                >
                  🚀 Commandes (Détails)
                </Link>
                <div className="border-t border-gray-700 my-4"></div>
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors text-purple-300"
                >
                  ⚙️ Payload Admin
                </Link>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
