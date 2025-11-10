'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/contexts/CartContext'

interface CartItemProps {
  item: CartItemType
  onRemove: () => void
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2) + ' €'
  }

  const getDimensions = () => {
    if (item.diameterCm) {
      return `Ø ${item.diameterCm} cm`
    }
    if (item.widthCm && item.heightCm) {
      return `${item.widthCm} × ${item.heightCm} cm`
    }
    return ''
  }

  const getSupportLabel = (support: string) => {
    const labels: Record<string, string> = {
      'vinyle-blanc': 'Vinyle Blanc',
      'vinyle-transparent': 'Vinyle Transparent',
      'vinyle-holographique': 'Vinyle Holographique',
      'vinyle-miroir': 'Vinyle Miroir',
    }
    return labels[support] || support
  }

  const getShapeLabel = (shape: string) => {
    const labels: Record<string, string> = {
      'cut-contour': 'Cut Contour',
      'carre': 'Carré',
      'rectangle': 'Rectangle',
      'rond': 'Rond',
    }
    return labels[shape] || shape
  }

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {item.title}
        </h3>

        <div className="space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Support:</span> {getSupportLabel(item.support)}
          </p>
          <p>
            <span className="font-medium">Forme:</span> {getShapeLabel(item.shape)}
          </p>
          {getDimensions() && (
            <p>
              <span className="font-medium">Dimensions:</span> {getDimensions()}
            </p>
          )}
          <p>
            <span className="font-medium">Quantité:</span> {item.quantity} stickers
          </p>
          <p className="text-xs text-gray-500">
            Prix unitaire: {formatPrice(item.unitCents)}
          </p>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Supprimer du panier"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(item.totalCents)}
          </p>
        </div>
      </div>
    </div>
  )
}
