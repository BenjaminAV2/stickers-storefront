'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { Product } from '@/lib/types'
import { SupportType, ShapeType, computeMatrix, computeCustomQuantityPrice, PriceMatrixRow, formatEur } from '@/lib/pricing'
import SupportShapePicker from './SupportShapePicker'
import SizePicker from './SizePicker'
import QuantityMatrix from './QuantityMatrix'
import { useCart } from '@/contexts/CartContext'
import StickyCheckoutButton from './StickyCheckoutButton'

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
  const [selectedQ, setSelectedQ] = useState(30)
  const [customQuantityRow, setCustomQuantityRow] = useState<PriceMatrixRow | null>(null)
  const [showErrors, setShowErrors] = useState(false)

  // Refs for scrolling to error sections
  const sizeRef = useRef<HTMLDivElement>(null)
  const quantityRef = useRef<HTMLDivElement>(null)

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

  const handleCustomQuantityChange = useCallback(
    (customQ: number) => {
      const customRow = computeCustomQuantityPrice(
        {
          support,
          shape,
          widthCm: size.widthCm,
          heightCm: size.heightCm,
          diameterCm: size.diameterCm,
        },
        customQ
      )
      setCustomQuantityRow(customRow)
      setSelectedQ(customQ)
    },
    [support, shape, size]
  )

  // Recalculate custom quantity price when configuration changes
  useEffect(() => {
    if (customQuantityRow && size.valid) {
      const updatedRow = computeCustomQuantityPrice(
        {
          support,
          shape,
          widthCm: size.widthCm,
          heightCm: size.heightCm,
          diameterCm: size.diameterCm,
        },
        customQuantityRow.q
      )
      setCustomQuantityRow(updatedRow)
    }
  }, [support, shape, size.widthCm, size.heightCm, size.diameterCm, size.valid])

  const handleAddToCart = () => {
    // Validate configuration
    const selectedRow = customQuantityRow || priceMatrix.find((row) => row.q === selectedQ)
    const hasErrors = !size.valid || !selectedRow

    if (hasErrors) {
      setShowErrors(true)
      toast.error('Veuillez vérifier votre configuration', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      })

      // Scroll to the first error
      if (!size.valid && sizeRef.current) {
        sizeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (!selectedRow && quantityRef.current) {
        quantityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      return
    }

    // Configuration valid - add to cart
    setShowErrors(false)
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

  const selectedRow = customQuantityRow && customQuantityRow.q === selectedQ
    ? customQuantityRow
    : priceMatrix.find((row) => row.q === selectedQ)

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
          <div ref={sizeRef}>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              2. Définissez les dimensions
            </h3>
            <SizePicker shape={shape} onChange={handleSizeChange} showError={showErrors && !size.valid} />
          </div>
        </div>
      </div>

      {/* Price matrix */}
      {size.valid && priceMatrix.length > 0 && (
        <div ref={quantityRef}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            3. Sélectionnez la quantité
          </h3>
          <QuantityMatrix
            rows={priceMatrix}
            selectedQ={selectedQ}
            customQuantityRow={customQuantityRow}
            onSelect={setSelectedQ}
            onCustomQuantityChange={handleCustomQuantityChange}
            showError={showErrors && !selectedRow}
          />
        </div>
      )}

      {/* Add to cart button - Always enabled, orange */}
      <button
        data-checkout-button
        onClick={handleAddToCart}
        className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all bg-[#FEA501] text-white hover:bg-[#e89401] hover:shadow-lg"
      >
        {selectedRow ? `Commander • ${formatEur(selectedRow.totalCents)}` : 'Commander'}
      </button>

      {/* Sticky Checkout Button */}
      <StickyCheckoutButton
        totalCents={selectedRow?.totalCents || 0}
        buttonText="Commander"
        onClick={handleAddToCart}
        showPrice={!!selectedRow}
      />
    </div>
  )
}
