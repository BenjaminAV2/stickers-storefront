import Link from 'next/link'
import { getProducts } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductsClient from '@/components/ProductsClient'

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
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F39D7] to-[#2BC8F2] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Nos Stickers</h1>
          <p className="text-xl text-white/90">
            Découvrez notre collection complète de stickers personnalisés
          </p>
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
    </div>
  )
}
