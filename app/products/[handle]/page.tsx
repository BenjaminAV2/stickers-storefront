import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductConfigurator from '@/components/ProductConfigurator'
import ProductImageSlider from '@/components/ProductImageSlider'
import ProductSlider from '@/components/ProductSlider'
import ExpandableContent from '@/components/ExpandableContent'
import Footer from '@/components/Footer'
import { Product } from '@/lib/types'
import { getProducts } from '@/lib/api'

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

  // Fetch other products for the slider
  let relatedProducts: Product[] = []
  try {
    const data = await getProducts({ limit: 8 })
    // Filter out the current product
    relatedProducts = data.products.filter((p) => p.id !== product.id)
  } catch (error) {
    console.error('Error fetching related products:', error)
  }

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
          {/* Left column - Images + Video on desktop */}
          <div className="space-y-8">
            {/* Product image slider */}
            <ProductImageSlider images={productImages} productTitle={product.title} />

            {/* Video Section - shown below images on desktop, below cart button on mobile */}
            <div className="hidden lg:block">
              <div className="bg-black rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 gap-6 p-6 lg:p-8">
                  {/* Vidéo */}
                  <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src="/video-placeholder.mp4" type="video/mp4" />
                      Votre navigateur ne supporte pas la vidéo.
                    </video>
                  </div>

                  {/* Bloc texte */}
                  <div className="text-white">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                      Titre de la section
                    </h2>
                    <p className="text-lg text-gray-300 mb-4">
                      Sous-titre accrocheur
                    </p>
                    <p className="text-base text-gray-400 leading-relaxed">
                      Contenu descriptif de la section. Expliquez ici les avantages de vos stickers personnalisés,
                      votre processus de fabrication, ou tout autre information importante pour vos clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product configurator */}
          <ProductConfigurator product={product} />
        </div>

        {/* Video Section - Mobile only (below cart button) */}
        <div className="lg:hidden mt-8">
          <div className="bg-black rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 gap-6 p-6">
              {/* Vidéo */}
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src="/video-placeholder.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              </div>

              {/* Bloc texte */}
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-3">
                  Titre de la section
                </h2>
                <p className="text-lg text-gray-300 mb-4">
                  Sous-titre accrocheur
                </p>
                <p className="text-base text-gray-400 leading-relaxed">
                  Contenu descriptif de la section. Expliquez ici les avantages de vos stickers personnalisés,
                  votre processus de fabrication, ou tout autre information importante pour vos clients.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reassurance Section */}
        <div className="mt-8 sm:mt-12 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 sm:p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Fabrication et livraison rapide */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                Fabrication & Livraison Rapides
              </h3>
            </div>

            {/* Qualité optimale */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                Qualité Optimale
              </h3>
            </div>

            {/* Encre écologique */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                Encre Écologique Haute Tenue
              </h3>
            </div>

            {/* Fabriqué en France */}
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md transform transition-transform hover:scale-110 duration-300">
                🇫🇷
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                Fabriqué en France
              </h3>
            </div>
          </div>
        </div>

        {/* Products Slider */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Découvrez aussi
              </h2>
              <p className="text-gray-600">
                D'autres stickers personnalisés qui pourraient vous intéresser
              </p>
            </div>

            <ProductSlider products={relatedProducts} />

            {/* View all link */}
            <div className="text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4F39D7] font-semibold rounded-lg border-2 border-[#4F39D7] hover:bg-[#4F39D7] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Voir tous les produits
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Content Section */}
      <ExpandableContent />

      {/* Footer */}
      <Footer />
    </div>
  )
}
