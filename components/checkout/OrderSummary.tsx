'use client'

import { useCart } from '@/contexts/CartContext'
import { formatEur } from '@/lib/pricing'
import { Tag } from 'lucide-react'
import type { ShippingProvider, AppliedPromotion } from '@/lib/types/checkout'
import { calculatePromoDiscount } from '@/lib/types/checkout'

interface OrderSummaryProps {
  selectedShipping?: ShippingProvider
  appliedPromotions?: AppliedPromotion[]
}

export function OrderSummary({ selectedShipping, appliedPromotions = [] }: OrderSummaryProps) {
  const { items, totalCents } = useCart()

  // Calculate TVA (20%)
  const tvaRate = 0.20
  const subtotalHT = totalCents / (1 + tvaRate)
  const tvaAmount = totalCents - subtotalHT

  // Shipping cost (convert from euros to cents)
  const shippingCost = selectedShipping?.price ? Math.round(selectedShipping.price * 100) : 0

  // Calculate total discount from all applied promotions
  const discountTotal = appliedPromotions.reduce((total, promo) => {
    return total + calculatePromoDiscount(promo, totalCents, shippingCost)
  }, 0)

  // Total with shipping and discount
  const totalWithShipping = Math.max(0, totalCents + shippingCost - discountTotal)

  const hasDiscount = discountTotal > 0 || appliedPromotions.length > 0

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

        {/* Discount Section */}
        {hasDiscount && (
          <div className="pt-2 border-t border-dashed border-gray-200">
            {appliedPromotions.map((promo) => {
              const promoDiscount = calculatePromoDiscount(promo, totalCents, shippingCost)
              return (
                <div key={promo.id} className="flex justify-between text-sm text-green-600 py-1">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {promo.code || 'Promotion'}
                    {promo.application_method && (
                      <span className="text-xs">
                        ({promo.application_method.type === 'percentage'
                          ? `${promo.application_method.value}%`
                          : `${promo.application_method.value}€`
                        })
                      </span>
                    )}
                  </span>
                  <span>-{formatEur(promoDiscount)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-baseline">
          <span className="text-lg font-bold text-gray-900">Total TTC</span>
          <div className="text-right">
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through mr-2">
                {formatEur(totalCents + shippingCost)}
              </span>
            )}
            <span className="text-2xl font-bold text-[#5b40d7]">
              {formatEur(totalWithShipping)}
            </span>
          </div>
        </div>
        {hasDiscount && (
          <p className="text-xs text-green-600 text-right mt-1">
            Vous économisez {formatEur(discountTotal)}
          </p>
        )}
      </div>
    </div>
  )
}
