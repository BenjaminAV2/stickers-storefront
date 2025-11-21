'use client'

import Image from 'next/image'
import { SupportType, ShapeType } from '@/lib/pricing'

interface SupportShapePickerProps {
  support: SupportType
  shape: ShapeType
  onChange: (config: { support: SupportType; shape: ShapeType }) => void
}

const SUPPORT_OPTIONS = [
  {
    value: 'vinyle_blanc' as const,
    label: 'Vinyle Blanc',
    bgGradient: 'from-white to-gray-50',
    borderColor: 'border-gray-300',
    image: '/Support_Blanc.svg',
  },
  {
    value: 'vinyle_transparent' as const,
    label: 'Vinyle Transparent',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-cyan-300',
    image: '/Support_Trans.svg',
  },
  {
    value: 'vinyle_holographique' as const,
    label: 'Vinyle Holographique',
    bgGradient: 'from-purple-100 via-pink-100 to-blue-100',
    borderColor: 'border-purple-400',
    image: '/Support_Holographique.svg',
  },
  {
    value: 'vinyle_miroir' as const,
    label: 'Vinyle Miroir',
    bgGradient: 'from-gray-200 via-gray-100 to-gray-200',
    borderColor: 'border-gray-400',
    image: '/Support_Miroir.svg',
  },
]

const SHAPE_OPTIONS = [
  {
    value: 'carre_rectangle' as const,
    label: 'Carré / Rectangle',
    image: '/Forme_rectangle.svg',
    bgGradient: 'from-blue-50 to-indigo-50',
  },
  {
    value: 'carre_rectangle_bords_arrondis' as const,
    label: 'Bords arrondis',
    image: '/Forme_Bord_Rond.svg',
    bgGradient: 'from-cyan-50 to-blue-50',
  },
  {
    value: 'rond' as const,
    label: 'Rond',
    image: '/Forme_Rond.svg',
    bgGradient: 'from-purple-50 to-pink-50',
  },
  {
    value: 'cut_contour' as const,
    label: 'Découpe Contour',
    image: '/Forme_Die_cut.svg',
    bgGradient: 'from-orange-50 to-yellow-50',
  },
]

export default function SupportShapePicker({
  support,
  shape,
  onChange,
}: SupportShapePickerProps) {
  return (
    <div className="space-y-6">
      {/* Support Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Support
        </label>
        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {SUPPORT_OPTIONS.map((option) => {
            const isSelected = support === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ support: option.value, shape })}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 flex-shrink-0
                  w-[100px] md:w-auto
                  bg-gradient-to-br ${option.bgGradient}
                  ${
                    isSelected
                      ? `${option.borderColor} ring-2 ring-offset-2 ring-[#4F39D7] shadow-lg scale-105`
                      : 'border-gray-200 hover:border-[#4F39D7] hover:shadow-md'
                  }
                `}
              >
                {/* Image */}
                <div className="w-12 h-12 mx-auto mb-1 relative">
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Label */}
                <div className="text-xs font-semibold text-gray-900 text-center leading-tight">
                  {option.label}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-[#4F39D7] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Shape Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Forme
        </label>
        {/* Mobile: horizontal scroll, Desktop: grid */}
        <div className="flex md:grid md:grid-cols-4 gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {SHAPE_OPTIONS.map((option) => {
            const isSelected = shape === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ support, shape: option.value })}
                className={`
                  relative p-3 rounded-lg border-2 transition-all duration-200 flex-shrink-0
                  w-[100px] md:w-auto
                  bg-gradient-to-br ${option.bgGradient}
                  ${
                    isSelected
                      ? 'border-[#4F39D7] ring-2 ring-offset-2 ring-[#4F39D7] shadow-lg scale-105'
                      : 'border-gray-200 hover:border-[#4F39D7] hover:shadow-md'
                  }
                `}
              >
                {/* Image */}
                <div className="w-12 h-12 mx-auto mb-1 relative">
                  <Image
                    src={option.image}
                    alt={option.label}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Label */}
                <div className="text-xs font-semibold text-gray-900 text-center leading-tight">
                  {option.label}
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-[#4F39D7] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
