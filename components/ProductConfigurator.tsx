'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Product } from '@/lib/types'
import { SupportType, ShapeType, computeMatrix, PriceMatrixRow, formatEur } from '@/lib/pricing'
import SupportShapePicker from './SupportShapePicker'
import SizePicker from './SizePicker'
import QuantityMatrix from './QuantityMatrix'
import { useCart } from '@/contexts/CartContext'

interface ProductConfiguratorProps {
  product: Product
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const { addItem } = useCart()

  // Configuration state
  const [support, setSupport] = useState<SupportType>('vinyle_blanc')
  const [shape, setShape] = useState<ShapeType>('carre_rectangle')
  const [size, setSize] = useState({
    widthCm: 5,
    heightCm: 5,
    diameterCm: 5,
    valid: true,
  })
  const [selectedQ, setSelectedQ] = useState(5)

  // Compute price matrix whenever config changes
  const priceMatrix: PriceMatrixRow[] = size.valid
    ? computeMatrix({
        support,
        shape,
        widthCm: size.widthCm,
        heightCm: size.heightCm,
        diameterCm: size.diameterCm,
      })
    : []

  const handleSupportShapeChange = useCallback(
    ({ support: newSupport, shape: newShape }: { support: SupportType; shape: ShapeType }) => {
      setSupport(newSupport)
      setShape(newShape)
    },
    []
  )

  const handleSizeChange = useCallback(
    (newSize: { widthCm: number; heightCm: number; diameterCm: number; valid: boolean }) => {
      setSize(newSize)
    },
    []
  )

  const handleAddToCart = () => {
    const selectedRow = priceMatrix.find((row) => row.q === selectedQ)
    if (!selectedRow) return

    addItem({
      productId: product.id,
      handle: product.handle || '',
      title: product.title,
      support,
      shape,
      widthCm: shape === 'rond' ? undefined : size.widthCm,
      heightCm: shape === 'rond' ? undefined : size.heightCm,
      diameterCm: shape === 'rond' ? size.diameterCm : undefined,
      quantity: selectedQ,
      unitCents: selectedRow.unitCents,
      totalCents: selectedRow.totalCents,
      image: product.thumbnail || undefined,
    })

    // Show success notification
    toast.success(`${selectedQ} sticker(s) ajouté(s) au panier !`, {
      duration: 3000,
      style: {
        background: '#10b981',
        color: '#fff',
      },
    })
  }

  const selectedRow = priceMatrix.find((row) => row.q === selectedQ)
  const isAddToCartDisabled = !size.valid || !selectedRow

  return (
    <div className="space-y-6">
      {/* Configuration card */}
      <div className="bg-white rounded-lg shadow-[var(--shadow-card)] p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Configurez votre sticker
        </h2>

        <div className="space-y-6">
          {/* Support & Shape */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              1. Choisissez le support et la forme
            </h3>
            <SupportShapePicker
              support={support}
              shape={shape}
              onChange={handleSupportShapeChange}
            />
          </div>

          {/* Size */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              2. Définissez les dimensions
            </h3>
            <SizePicker shape={shape} onChange={handleSizeChange} />
          </div>
        </div>
      </div>

      {/* Price matrix */}
      {size.valid && priceMatrix.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            3. Sélectionnez la quantité
          </h3>
          <QuantityMatrix
            rows={priceMatrix}
            selectedQ={selectedQ}
            onSelect={setSelectedQ}
          />
        </div>
      )}

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all
          ${
            isAddToCartDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#4F39D7] to-[#2BC8F2] text-white hover:shadow-lg'
          }
        `}
      >
        {isAddToCartDisabled
          ? 'Configurez votre sticker'
          : selectedRow
          ? `Ajouter au panier • ${formatEur(selectedRow.totalCents)}`
          : 'Ajouter au panier'}
      </button>
    </div>
  )
}
