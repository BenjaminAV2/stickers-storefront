'use client'

import { useState } from 'react'
import { Tag, X, Loader2, ChevronDown, ChevronUp, Check } from 'lucide-react'
import type { AppliedPromotion } from '@/lib/types/checkout'

interface PromoCodeInputProps {
  appliedPromotions: AppliedPromotion[]
  onPromoApplied: (promotion: AppliedPromotion) => void
  onPromoRemoved: (promoId: string) => void
}

export function PromoCodeInput({
  appliedPromotions,
  onPromoApplied,
  onPromoRemoved,
}: PromoCodeInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate promo code via API
      const response = await fetch('/api/medusa/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode.trim().toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Code promo invalide')
        return
      }

      // Check if already applied
      const alreadyApplied = appliedPromotions.some(
        (p) => p.id === data.promotion.id
      )
      if (alreadyApplied) {
        setError('Ce code promo est déjà appliqué')
        return
      }

      // Apply the promotion locally
      const promotion: AppliedPromotion = {
        id: data.promotion.id,
        code: data.promotion.code,
        type: data.promotion.type,
        is_automatic: data.promotion.is_automatic,
        application_method: data.promotion.application_method,
      }

      setSuccess(true)
      setPromoCode('')
      onPromoApplied(promotion)

      // Reset success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError('Erreur lors de l\'application du code promo')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePromo = (promoId: string) => {
    onPromoRemoved(promoId)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApplyPromo()
    }
  }

  // Show applied promotions even when collapsed
  const hasAppliedPromotions = appliedPromotions && appliedPromotions.length > 0

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#5b40d7]" />
          <span className="text-sm font-medium text-gray-700">
            {hasAppliedPromotions
              ? `Code promo appliqué (${appliedPromotions.length})`
              : 'Ajouter un code promo'
            }
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Applied Promotions (always visible if any) */}
      {hasAppliedPromotions && !isOpen && (
        <div className="px-4 py-2 bg-green-50 border-t border-gray-200">
          {appliedPromotions.map((promo) => (
            <div key={promo.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{promo.code}</span>
                {promo.application_method && (
                  <span className="text-xs text-green-600">
                    ({promo.application_method.type === 'percentage'
                      ? `-${promo.application_method.value}%`
                      : `-${promo.application_method.value}€`
                    })
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemovePromo(promo.id)
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Content */}
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200">
          {/* Applied Promotions */}
          {hasAppliedPromotions && (
            <div className="mb-4 space-y-2">
              <p className="text-xs text-gray-500 uppercase font-medium">Codes appliqués</p>
              {appliedPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">{promo.code}</span>
                    {promo.application_method && (
                      <span className="text-xs text-green-600">
                        ({promo.application_method.type === 'percentage'
                          ? `-${promo.application_method.value}%`
                          : `-${promo.application_method.value}€`
                        })
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePromo(promo.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase())
                setError(null)
              }}
              onKeyPress={handleKeyPress}
              placeholder="Entrez votre code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7]"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={loading || !promoCode.trim()}
              className="px-4 py-2 bg-[#5b40d7] text-white text-sm font-medium rounded-lg hover:bg-[#4a35b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Appliquer'
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          {/* Success Message */}
          {success && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Code promo appliqué avec succès!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
