'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Truck, MapPin, Check, Loader2 } from 'lucide-react'
import type { ShippingProvider } from '@/lib/types/checkout'
import { useFilteredShippers } from '@/hooks/useFilteredShippers'

interface ShippingMethodSelectorProps {
  countryCode: string
  postalCode: string
  onSelect: (provider: ShippingProvider) => void
  onBack: () => void
  selectedProvider?: ShippingProvider
}

export function ShippingMethodSelector({
  countryCode,
  postalCode,
  onSelect,
  onBack,
  selectedProvider,
}: ShippingMethodSelectorProps) {
  const { providers, loading, error } = useFilteredShippers(countryCode, postalCode, 'fr')
  const [selected, setSelected] = useState<string | undefined>(selectedProvider?.id)

  const handleSelect = (provider: ShippingProvider) => {
    setSelected(provider.id)
    onSelect(provider)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#5b40d7] animate-spin" />
        <p className="mt-4 text-gray-600">Chargement des modes de livraison...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800 font-medium">Erreur lors du chargement des transporteurs</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
        >
          Retour
        </button>
      </div>
    )
  }

  if (providers.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <Truck className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <p className="text-yellow-800 font-medium">
          Aucun mode de livraison disponible pour cette adresse
        </p>
        <p className="text-yellow-700 text-sm mt-2">
          Veuillez vérifier votre adresse ou contacter notre service client
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors"
        >
          Modifier l'adresse
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleSelect(provider)}
            className={`
              w-full p-4 rounded-lg border-2 transition-all text-left
              ${
                selected === provider.id
                  ? 'border-[#5b40d7] bg-[#5b40d7]/5 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                {provider.logo ? (
                  <Image
                    src={provider.logo}
                    alt={provider.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : (
                  <Truck className="w-8 h-8 text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.title}</h3>
                    {provider.subtitle && (
                      <p className="text-sm text-gray-600 mt-0.5">{provider.subtitle}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-bold text-gray-900">{provider.price.toFixed(2)} €</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-1" />
                    {provider.estimatedDelivery}
                  </span>

                  {provider.isRelayService && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#5b40d7]/10 text-[#5b40d7] text-xs font-medium">
                      <MapPin className="w-3 h-3 mr-1" />
                      Point relais
                    </span>
                  )}
                </div>

                {provider.features && provider.features.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {provider.features.slice(0, 2).map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <Check className="w-3 h-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {provider.postalCodeRestriction && (
                  <p className="mt-2 text-xs text-gray-500 italic">
                    {provider.postalCodeRestriction}
                  </p>
                )}
              </div>

              {/* Selected indicator */}
              {selected === provider.id && (
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#5b40d7] flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Retour
        </button>
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            const provider = providers.find((p) => p.id === selected)
            if (provider) {
              onSelect(provider)
            }
          }}
          className={`
            flex-1 px-6 py-4 rounded-lg font-medium transition-colors shadow-lg
            ${
              selected
                ? 'bg-[#5b40d7] text-white hover:bg-[#4a33b8]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continuer
        </button>
      </div>
    </div>
  )
}
