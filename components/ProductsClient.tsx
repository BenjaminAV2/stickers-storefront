'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/lib/types'

interface ProductsClientProps {
  initialProducts: Product[]
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)

  // Filter states
  const [selectedSupport, setSelectedSupport] = useState<string>('all')
  const [selectedForme, setSelectedForme] = useState<string>('all')
  const [selectedTaille, setSelectedTaille] = useState<string>('all')

  // Apply filters when filter states change
  useEffect(() => {
    let filtered = [...initialProducts]

    // Filter by support (vinyle blanc, transparent, holographique, miroir)
    if (selectedSupport !== 'all') {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(selectedSupport.toLowerCase())
      )
    }

    // Filter by forme (cut contour, carré, rectangle, rond)
    if (selectedForme !== 'all') {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(selectedForme.toLowerCase())
      )
    }

    // Filter by taille (via variants)
    // Only filter if variants exist and taille is not 'all'
    if (selectedTaille !== 'all') {
      filtered = filtered.filter((product) => {
        if (!product.variants || product.variants.length === 0) {
          // If no variants, show the product anyway
          return true
        }
        return product.variants.some((variant) =>
          variant.title?.toLowerCase().includes(selectedTaille.toLowerCase())
        )
      })
    }

    setFilteredProducts(filtered)
  }, [initialProducts, selectedSupport, selectedForme, selectedTaille])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Filtrer par :</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Support Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Support
            </label>
            <select
              value={selectedSupport}
              onChange={(e) => setSelectedSupport(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
            >
              <option value="all">Tous les supports</option>
              <option value="blanc">Vinyle Blanc</option>
              <option value="transparent">Vinyle Transparent</option>
              <option value="holographique">Vinyle Holographique</option>
              <option value="miroir">Vinyle Miroir</option>
            </select>
          </div>

          {/* Forme Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Forme
            </label>
            <select
              value={selectedForme}
              onChange={(e) => setSelectedForme(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
            >
              <option value="all">Toutes les formes</option>
              <option value="cut contour">Cut Contour</option>
              <option value="carré">Carré</option>
              <option value="rectangle">Rectangle</option>
              <option value="rond">Rond</option>
            </select>
          </div>

          {/* Taille Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Taille
            </label>
            <select
              value={selectedTaille}
              onChange={(e) => setSelectedTaille(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
            >
              <option value="all">Toutes les tailles</option>
              <option value="5x5">5×5 cm</option>
              <option value="8x8">8×8 cm</option>
              <option value="10x10">10×10 cm</option>
              <option value="15x15">15×15 cm</option>
            </select>
          </div>
        </div>

        {/* Reset Filters Button */}
        {(selectedSupport !== 'all' || selectedForme !== 'all' || selectedTaille !== 'all') && (
          <button
            onClick={() => {
              setSelectedSupport('all')
              setSelectedForme('all')
              setSelectedTaille('all')
            }}
            className="mt-4 px-4 py-2 text-sm text-primary hover:text-primary-accent font-semibold transition-colors"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-12 text-center">
          <p className="text-blue-600 text-lg font-semibold mb-2">
            Aucun produit trouvé
          </p>
          <p className="text-blue-500">
            Essayez de modifier vos filtres pour voir plus de résultats
          </p>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
