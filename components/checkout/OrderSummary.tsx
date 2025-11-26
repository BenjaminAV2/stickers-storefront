'use client'

import { useCart } from '@/contexts/CartContext'
import { formatEur } from '@/lib/pricing'
import type { ShippingProvider } from '@/lib/types/checkout'

interface OrderSummaryProps {
  selectedShipping?: ShippingProvider
}

export function OrderSummary({ selectedShipping }: OrderSummaryProps) {
  const { items, totalCents } = useCart()

  // Calculate TVA (20%)
  const tvaRate = 0.20
  const subtotalHT = totalCents / (1 + tvaRate)
  const tvaAmount = totalCents - subtotalHT

  // Shipping cost (convert from euros to cents)
  const shippingCost = selectedShipping?.price ? Math.round(selectedShipping.price * 100) : 0

  // Total with shipping
  const totalWithShipping = totalCents + shippingCost

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-[140px] md:top-[160px]">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

      {/* Product list */}
      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-gray-500">Quantité: {item.quantity}</p>
            </div>
            <p className="font-medium text-gray-900">{formatEur(item.totalCents)}</p>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Sous-total HT</span>
          <span>{formatEur(Math.round(subtotalHT))}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>TVA (20%)</span>
          <span>{formatEur(Math.round(tvaAmount))}</span>
        </div>

        {selectedShipping && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Livraison ({selectedShipping.title})</span>
            <span>{formatEur(shippingCost)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold text-gray-900">Total TTC</span>
          <span className="text-2xl font-bold text-[#5b40d7]">
            {formatEur(totalWithShipping)}
          </span>
        </div>
      </div>
    </div>
  )
}
