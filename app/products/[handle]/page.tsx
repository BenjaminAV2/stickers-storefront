import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductConfigurator from '@/components/ProductConfigurator'
import ProductImageSlider from '@/components/ProductImageSlider'
import { Product } from '@/lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

async function getPublishableApiKey(): Promise<string> {
  const response = await fetch(`${API_URL}/publishable-key`, {
    cache: 'force-cache',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch publishable API key')
  }

  const data = await response.json()
  return data.publishable_key
}

async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    const apiKey = await getPublishableApiKey()

    const response = await fetch(
      `${API_URL}/store/products?handle=${handle}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': apiKey,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    if (!data.products || data.products.length === 0) {
      return null
    }

    return data.products[0]
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  // Use local product placeholder images (duplicated for slider testing)
  const productImages = ['/product-placeholder.png', '/product-placeholder.png']

  const variantCount = product.variants?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav className="flex items-center text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-700">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-gray-700">Produits</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-5 sm:pb-12">
        {/* Product title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-5">
          {product.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Product image slider */}
          <ProductImageSlider images={productImages} productTitle={product.title} />

          {/* Product configurator */}
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  )
}
