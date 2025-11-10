import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ProductConfigurator from '@/components/ProductConfigurator'
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

  // Get primary image
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : product.thumbnail || '/placeholder.jpg'

  const variantCount = product.variants?.length || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4F39D7] to-[#2BC8F2] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="text-white/80 hover:text-white mb-4 inline-block text-sm"
          >
            ← Retour aux produits
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{product.title}</h1>
          {product.subtitle && (
            <p className="text-lg text-white/90">{product.subtitle}</p>
          )}
          {variantCount > 0 && (
            <p className="text-sm text-white/70 mt-2">
              {variantCount} variante{variantCount > 1 ? 's' : ''} disponible
              {variantCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product image */}
          <div className="bg-white rounded-lg shadow-[var(--shadow-card)] p-6">
            <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              {imageUrl !== '/placeholder.jpg' ? (
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FEA501] via-[#2BC8F2] to-[#4F39D7] rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                      <span className="text-3xl text-white">🎨</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      Image à venir
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Product description */}
            {product.description && (
              <div className="mt-6 prose prose-sm max-w-none">
                <p className="text-gray-600 text-sm whitespace-pre-wrap">
                  {product.description.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            )}
          </div>

          {/* Product configurator */}
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  )
}
