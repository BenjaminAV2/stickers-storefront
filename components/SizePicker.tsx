'use client'

import { useState, useEffect, useRef } from 'react'
import { ShapeType, PREDEFINED_SIZES } from '@/lib/pricing'

interface SizePickerProps {
  shape: ShapeType
  onChange: (size: {
    widthCm: number
    heightCm: number
    diameterCm: number
    valid: boolean
  }) => void
}

const MIN_SIZE = 2
const MAX_SIZE = 100
const STEP = 0.5

// Helper function to validate step increments
const isValidStep = (value: number, step: number = STEP): boolean => {
  const remainder = Math.abs((value * 10) % (step * 10)) / 10
  return remainder < 0.01 // Account for floating point precision
}

export default function SizePicker({ shape, onChange }: SizePickerProps) {
  const [isCustomSize, setIsCustomSize] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number>(1) // Index of preset size
  const [widthCm, setWidthCm] = useState(5)
  const [heightCm, setHeightCm] = useState(5)
  const [diameterCm, setDiameterCm] = useState(5)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get predefined sizes for current shape
  const presets = PREDEFINED_SIZES[shape]

  // Initialize with first preset when shape changes
  useEffect(() => {
    if (presets && presets.length > 0 && !isCustomSize) {
      const preset = presets[selectedPreset] || presets[1]
      if ('diameterCm' in preset) {
        setDiameterCm(preset.diameterCm)
      } else {
        setWidthCm(preset.widthCm!)
        setHeightCm(preset.heightCm!)
      }
    }
  }, [shape])

  useEffect(() => {
    // Validate and notify parent
    let valid = true
    let errorMsg: string | null = null

    if (isCustomSize) {
      if (shape === 'rond') {
        if (diameterCm < MIN_SIZE) {
          valid = false
          errorMsg = `Le diamètre doit être au minimum ${MIN_SIZE} cm`
        } else if (diameterCm > MAX_SIZE) {
          valid = false
          errorMsg = `Le diamètre ne peut pas dépasser ${MAX_SIZE} cm`
        } else if (!isValidStep(diameterCm)) {
          valid = false
          errorMsg = `Le diamètre doit être un multiple de ${STEP} cm`
        }
      } else {
        if (widthCm < MIN_SIZE || heightCm < MIN_SIZE) {
          valid = false
          errorMsg = `Les dimensions doivent être au minimum ${MIN_SIZE} cm`
        } else if (widthCm > MAX_SIZE || heightCm > MAX_SIZE) {
          valid = false
          errorMsg = `Les dimensions ne peuvent pas dépasser ${MAX_SIZE} cm`
        } else if (!isValidStep(widthCm) || !isValidStep(heightCm)) {
          valid = false
          errorMsg = `Les dimensions doivent être des multiples de ${STEP} cm`
        }
      }
    }

    setError(errorMsg)
    onChange({ widthCm, heightCm, diameterCm, valid })
  }, [shape, widthCm, heightCm, diameterCm, isCustomSize])

  const handlePresetClick = (index: number) => {
    setSelectedPreset(index)
    setIsCustomSize(false)
    const preset = presets[index]
    if ('diameterCm' in preset) {
      setDiameterCm(preset.diameterCm)
    } else {
      setWidthCm(preset.widthCm!)
      setHeightCm(preset.heightCm!)
    }
  }

  const handleCustomClick = () => {
    setIsCustomSize(true)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSelectedLabel = () => {
    if (isCustomSize) return '✨ Personnalisé'
    return presets[selectedPreset]?.label || ''
  }

  return (
    <div className="space-y-4">
      {/* Custom dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-200 focus:border-[#4F39D7] focus:outline-none text-base font-medium bg-white shadow-sm hover:border-gray-300 transition-colors text-left"
        >
          {getSelectedLabel()}
          <svg
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 20"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 8l4 4 4-4" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-blue-50 border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  handlePresetClick(index)
                  setIsDropdownOpen(false)
                }}
                className={`w-full px-4 py-3 text-left text-base font-medium transition-colors ${
                  !isCustomSize && selectedPreset === index
                    ? 'bg-[#4F39D7] text-white'
                    : 'text-gray-900 hover:bg-blue-100'
                }`}
              >
                {!isCustomSize && selectedPreset === index && (
                  <span className="mr-2">✓</span>
                )}
                {preset.label}
              </button>
            ))}

            {/* Custom option */}
            <button
              type="button"
              onClick={handleCustomClick}
              className={`w-full px-4 py-3 text-left text-base font-medium transition-colors ${
                isCustomSize
                  ? 'bg-[#FEA501] text-white'
                  : 'text-gray-900 hover:bg-blue-100'
              }`}
            >
              {isCustomSize && <span className="mr-2">✓</span>}
              ✨ Personnalisé
            </button>
          </div>
        )}
      </div>

      {/* Custom size inputs */}
      {isCustomSize && (
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-[#FEA501]">
          {shape === 'rond' ? (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Diamètre personnalisé (cm)
                </span>
                <input
                  type="number"
                  min={MIN_SIZE}
                  max={MAX_SIZE}
                  step={STEP}
                  value={diameterCm}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value)
                    if (!isNaN(val)) {
                      setDiameterCm(val)
                    }
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FEA501] focus:outline-none transition-colors"
                />
              </label>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">
                  {error}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Min: {MIN_SIZE} cm • Max: {MAX_SIZE} cm • Pas: {STEP} cm
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 mb-2 block">
                    Largeur (cm)
                  </span>
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    step={STEP}
                    value={widthCm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) {
                        setWidthCm(val)
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FEA501] focus:outline-none transition-colors"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 mb-2 block">
                    Hauteur (cm)
                  </span>
                  <input
                    type="number"
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    step={STEP}
                    value={heightCm}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val)) {
                        setHeightCm(val)
                      }
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FEA501] focus:outline-none transition-colors"
                  />
                </label>
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">
                  {error}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Min: {MIN_SIZE} cm • Max: {MAX_SIZE} cm • Pas: {STEP} cm
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
