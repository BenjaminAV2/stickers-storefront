import CartContent from '@/components/CartContent'
import ProductSlider from '@/components/ProductSlider'
import { getProducts } from '@/lib/api'
import { Product } from '@/lib/types'
import Link from 'next/link'

export default async function CartPage() {
  // Fetch products for the slider
  let products: Product[] = []
  try {
    const data = await getProducts({ limit: 8 })
    products = data.products
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Cart Content with Reassurance */}
      <CartContent />

      {/* Products Slider */}
      {products.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            Ajouter d'autres produits
          </h2>
          <ProductSlider products={products} />
        </div>
      )}

      {/* Footer Section */}
      <div className="max-w-6xl mx-auto mt-12 text-center space-y-4">
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          FAQ
        </Link>

        <p className="text-sm text-gray-600">
          © 2025 Exclusives Stickers. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
