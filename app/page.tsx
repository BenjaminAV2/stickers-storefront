import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/api'
import { Product } from '@/lib/types'
import Footer from '@/components/Footer'

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FEA501] via-[#2BC8F2] to-[#4F39D7] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Exclusives Stickers
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Créez vos stickers personnalisés de qualité professionnelle
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Vinyle blanc, transparent, holographique ou miroir - Résistant eau & UV - Livraison rapide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products" className="btn-primary w-full sm:w-auto">
                Découvrir nos stickers
              </Link>
              <Link href="#reassurances" className="btn-secondary w-full sm:w-auto">
                Pourquoi nous choisir ?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reassurance Section */}
      <section id="reassurances" className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#FEA501] to-[#2BC8F2] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                ✓
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Qualité Premium</h3>
              <p className="text-xs sm:text-sm text-gray-600">Garantie professionnelle</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#2BC8F2] to-[#4F39D7] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                ⚡
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Livraison Rapide</h3>
              <p className="text-xs sm:text-sm text-gray-600">48-72h en France</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#4F39D7] to-[#FEA501] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                💧
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Résistant</h3>
              <p className="text-xs sm:text-sm text-gray-600">Eau & UV protection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#FEA501] to-[#4F39D7] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                🔒
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Paiement Sécurisé</h3>
              <p className="text-xs sm:text-sm text-gray-600">Transactions protégées</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#2BC8F2] to-[#FEA501] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                💬
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">Support Réactif</h3>
              <p className="text-xs sm:text-sm text-gray-600">Assistance rapide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-4">
              Nos Stickers Personnalisés
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="card-glossy group cursor-pointer"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FEA501] via-[#2BC8F2] to-[#4F39D7] rounded-full flex items-center justify-center shadow-[0_8px_32px_0_rgba(79,57,215,0.37)]">
                            <span className="text-3xl text-white">🎨</span>
                          </div>
                          <p className="text-sm text-gray-500 font-medium">Image à venir</p>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-[#4F39D7] transition-colors">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {product.variants && product.variants.length > 0 ? (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">À partir de</p>
                            <p className="text-xl font-bold text-gradient">
                              {product.variants[0].prices?.[0]?.amount
                                ? `${(product.variants[0].prices[0].amount / 100).toFixed(2)}€`
                                : 'Prix sur demande'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Contactez-nous</p>
                        )}
                        <div className="text-[#4F39D7] group-hover:translate-x-1 transition-transform">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      {product.variants && product.variants.length > 1 && (
                        <p className="text-xs text-gray-500 mt-3">
                          {product.variants.length} tailles disponibles
                        </p>
                      )}
                    </div>
                  </Link>
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
