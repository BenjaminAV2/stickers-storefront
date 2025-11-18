import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/api'
import { Product } from '@/lib/types'
import Footer from '@/components/Footer'
import HeroStickerSection from '@/components/HeroStickerSection'

export default async function Home() {
  // Fetch products from API
  let products: Product[] = []
  let error: string | null = null

  try {
    const data = await getProducts({ limit: 12 })
    products = data.products
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products'
    console.error('Error fetching products:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Sticker Section - New immersive design */}
      <HeroStickerSection />

      {/* Reassurance Section */}
      <section id="reassurances" className="pt-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {/* Livraison Express */}
            <div className="text-center p-4 rounded-xl transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-primary-blue to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md">
                ⚡
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Livraison</h3>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Express</h3>
            </div>

            {/* Qualité certifiée */}
            <div className="text-center p-4 rounded-xl transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md">
                ✓
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Qualité</h3>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">certifiée</h3>
            </div>

            {/* Large choix d'options */}
            <div className="text-center p-4 rounded-xl transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md">
                🎨
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Large choix</h3>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">d&apos;options</h3>
            </div>

            {/* Made in France */}
            <div className="text-center p-4 rounded-xl transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-red-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md">
                🇫🇷
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Made in</h3>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">France</h3>
            </div>

            {/* Made to Measure */}
            <div className="text-center p-4 rounded-xl transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md">
                📏
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Made to</h3>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Measure</h3>
            </div>

            {/* Customer Service */}
            <div className="text-center p-4 rounded-xl transition-transform hover:scale-110 hover:-translate-y-1 duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md">
                💬
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Customer</h3>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Service</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Nos Stickers Personnalisés
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos stickers disponibles en plusieurs supports et formes
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-center">
              <p className="text-red-600">Erreur de chargement: {error}</p>
              <p className="text-sm text-red-500 mt-2">Vérifiez que l'API est bien accessible</p>
            </div>
          )}

          {!error && products.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <p className="text-blue-600 text-lg font-semibold mb-2">Aucun produit disponible pour le moment</p>
              <p className="text-blue-500 text-sm">Les produits seront bientôt disponibles</p>
            </div>
          )}

          {!error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {products.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="bg-black rounded-2xl transition-all duration-300 group overflow-hidden border-[3px] border-white hover:shadow-[6px_6px_16px_rgba(0,0,0,0.4)] relative"
                    style={{
                      boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {/* Link wrapper - toute la carte cliquable sur mobile et desktop */}
                    <Link
                      href={`/products/${product.handle}`}
                      className="absolute inset-0 z-10"
                    />

                    {/* Contenu principal - horizontal sur mobile, vertical sur desktop */}
                    <div className="flex flex-row sm:flex-col">
                      {/* Image - à gauche sur mobile, en haut sur desktop */}
                      <div className="w-2/5 sm:w-full aspect-square bg-black flex items-center justify-center relative overflow-hidden p-4 sm:p-6">
                        <Image
                          src="/product-placeholder.png"
                          alt={product.title}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                          quality={100}
                          unoptimized
                        />
                      </div>

                      {/* Titre + texte - à droite sur mobile, en bas sur desktop */}
                      <div className="w-3/5 sm:w-full p-3 sm:p-4 bg-black flex flex-col justify-center sm:justify-start">
                        <h3 className="font-bold text-sm sm:text-base lg:text-lg text-white mb-1 sm:mb-1.5 group-hover:text-[#2B9FE0] transition-colors line-clamp-2 sm:line-clamp-1">
                          {product.title}
                        </h3>
                        {product.description && (
                          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed mb-0 sm:mb-3">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lien visuel - en dessous sur mobile et desktop */}
                    <div className="p-3 pt-0 sm:p-4 sm:pt-0 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <div className="sm:hidden">
                          <p className="text-sm text-gray-400">Créer mes stickers</p>
                        </div>
                        <div className="hidden sm:flex sm:w-full sm:justify-between">
                          {product.variants && product.variants.length > 0 ? (
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">À partir de</p>
                              <p className="text-lg sm:text-xl font-bold text-white">
                                {product.variants[0].prices?.[0]?.amount
                                  ? `${(product.variants[0].prices[0].amount / 100).toFixed(2)}€`
                                  : 'Prix sur demande'}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-400">Créer mes stickers</p>
                          )}
                        </div>
                        <div className="text-white group-hover:translate-x-1 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      {product.variants && product.variants.length > 1 && (
                        <p className="hidden sm:block text-xs text-gray-400 mt-2 pt-2 border-t border-gray-800">
                          {product.variants.length} tailles disponibles
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/products" className="btn-primary inline-block">
                  Voir tous les produits
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-[#FEA501] via-[#2BC8F2] to-[#4F39D7">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à créer vos stickers personnalisés ?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Commandez dès maintenant et recevez vos stickers de qualité professionnelle en 48-72h
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-secondary bg-white text-[#4F39D7] hover:bg-gray-50 border-0">
              Commander maintenant
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
