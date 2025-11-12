'use client'

import { useState } from 'react'
import type { ShippingAddress } from '@/lib/types/checkout'

interface ShippingAddressFormProps {
  initialData?: ShippingAddress
  onSubmit: (address: ShippingAddress) => void
  onBack?: () => void
}

const COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'ES', name: 'Espagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GB', name: 'Royaume-Uni' },
]

export function ShippingAddressForm({
  initialData,
  onSubmit,
  onBack,
}: ShippingAddressFormProps) {
  const [formData, setFormData] = useState<ShippingAddress>(
    initialData || {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      postalCode: '',
      countryCode: 'FR',
      phone: '',
      email: '',
    }
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis'
    if (!formData.address1.trim()) newErrors.address1 = 'Adresse requise'
    if (!formData.city.trim()) newErrors.city = 'Ville requise'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Code postal requis'
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis'
    if (!formData.email.trim()) newErrors.email = 'Email requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email invalide'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${
                errors.firstName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
              }
              focus:outline-none focus:ring-2
            `}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${
                errors.lastName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
              }
              focus:outline-none focus:ring-2
            `}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Société (optionnel)
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
        />
      </div>

      <div>
        <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address1"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all
            ${
              errors.address1
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
            }
            focus:outline-none focus:ring-2
          `}
        />
        {errors.address1 && <p className="mt-1 text-sm text-red-500">{errors.address1}</p>}
      </div>

      <div>
        <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
          Complément d'adresse (optionnel)
        </label>
        <input
          type="text"
          id="address2"
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
            Code postal <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${
                errors.postalCode
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
              }
              focus:outline-none focus:ring-2
            `}
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${
                errors.city
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
              }
              focus:outline-none focus:ring-2
            `}
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
            Région / État (optionnel)
          </label>
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700 mb-1">
            Pays <span className="text-red-500">*</span>
          </label>
          <select
            id="countryCode"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5b40d7] focus:border-[#5b40d7] focus:outline-none transition-all"
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
              }
              focus:outline-none focus:ring-2
            `}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5b40d7] focus:border-[#5b40d7]'
              }
              focus:outline-none focus:ring-2
            `}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-6 py-4 rounded-lg bg-[#5b40d7] text-white font-medium hover:bg-[#4a33b8] transition-colors shadow-lg"
        >
          Continuer
        </button>
      </div>
    </form>
  )
}
