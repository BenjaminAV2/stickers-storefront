'use client'

import { useState } from 'react'
import { CreditCard, Check } from 'lucide-react'
import type { PaymentProvider } from '@/lib/types/checkout'

interface PaymentSelectorProps {
  onSelect: (method: PaymentProvider) => void
  selectedMethod?: PaymentProvider
}

const PAYMENT_METHODS = [
  {
    id: 'stripe' as PaymentProvider,
    title: 'Carte bancaire',
    subtitle: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    logo: null,
  },
  {
    id: 'paypal' as PaymentProvider,
    title: 'PayPal',
    subtitle: 'Payez avec votre compte PayPal',
    icon: CreditCard,
    logo: '/paypal-logo.svg', // You'll need to add this
  },
]

export function PaymentSelector({ onSelect, selectedMethod }: PaymentSelectorProps) {
  const [selected, setSelected] = useState<PaymentProvider | undefined>(selectedMethod)

  const handleSelect = (method: PaymentProvider) => {
    setSelected(method)
  }

  const handleContinue = () => {
    if (selected) {
      onSelect(selected)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon
          return (
            <button
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`
                w-full p-6 rounded-lg border-2 transition-all text-left
                ${
                  selected === method.id
                    ? 'border-[#5b40d7] bg-[#5b40d7]/5 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow'
                }
              `}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-600" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{method.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{method.subtitle}</p>
                </div>

                {/* Selected indicator */}
                {selected === method.id && (
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#5b40d7] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-800">
          🔒 <strong>Paiement 100% sécurisé</strong>
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Vos informations de paiement sont cryptées et sécurisées. Nous n'avons pas accès à vos
          données bancaires.
        </p>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="w-full px-6 py-4 rounded-lg font-medium transition-colors shadow-lg mt-4 bg-[#5b40d7] text-white hover:bg-[#4a33b8]"
      >
        Valider le paiement
      </button>
    </div>
  )
}
