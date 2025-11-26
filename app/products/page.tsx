import Link from 'next/link'
import { getProducts } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductsClient from '@/components/ProductsClient'
import Footer from '@/components/Footer'

export default async function ProductsPage() {
  // Fetch products from API (Server-side - no CORS issue)
  let products: Product[] = []
  let error: string | null = null

  try {
    const data = await getProducts({ limit: 100 })
    products = data.products
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products'
    console.error('Error fetching products:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Breadcrumb and Reassurance */}
      <div className="bg-gradient-to-r from-[#4F39D7] to-[#2BC8F2] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-xs sm:text-sm text-white/80 mb-2">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Produits</span>
          </nav>

          {/* Title and Reassurance Icons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Nos Stickers</h1>

            {/* Reassurance Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Livraison Express */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium">Livraison Express</span>
              </div>

              {/* Qualité */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Qualité Premium</span>
              </div>

              {/* Made in France */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm text-base sm:text-lg">
                  🇫🇷
                </div>
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">Made in France</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">Erreur : {error}</p>
          </div>
        </div>
      )}

      {/* Products Grid with Filters (Client Component) */}
      {!error && <ProductsClient initialProducts={products} />}

      {/* Reassurance Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Fabrication et livraison rapide */}
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-primary-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">
                Fabrication & Livraison Rapides
              </h3>
            </div>

            {/* Qualité optimale */}
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">
                Qualité Optimale
              </h3>
            </div>

            {/* Encre écologique */}
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">
                Encre Écologique Haute Tenue
              </h3>
            </div>

            {/* Fabriqué en France */}
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-md transform transition-transform hover:scale-110 duration-300">
                🇫🇷
              </div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900">
                Fabriqué en France
              </h3>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
