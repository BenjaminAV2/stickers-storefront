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
        <div className="bg-white rounded-lg p-4 border-2 border-[#FEA501]">
          {shape === 'rond' ? (
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-gray-700 mb-2 block">
                  Diamètre personnalisé (cm)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={diameterCm}
                  onChange={(e) => {
                    const val = e.target.value
                    // Allow empty string or valid numbers
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      const parsed = parseFloat(val)
                      if (val === '') {
                        setDiameterCm(0)
                      } else if (!isNaN(parsed)) {
                        setDiameterCm(parsed)
                      }
                    }
                  }}
                  className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                    error
                      ? 'border-red-500 focus:border-red-600 bg-red-50'
                      : 'border-gray-200 focus:border-[#FEA501]'
                  }`}
                  placeholder={`Min: ${MIN_SIZE} cm`}
                />
              </label>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
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
                    type="text"
                    inputMode="decimal"
                    value={widthCm}
                    onChange={(e) => {
                      const val = e.target.value
                      // Allow empty string or valid numbers
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        const parsed = parseFloat(val)
                        if (val === '') {
                          setWidthCm(0)
                        } else if (!isNaN(parsed)) {
                          setWidthCm(parsed)
                        }
                      }
                    }}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      error
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-gray-200 focus:border-[#FEA501]'
                    }`}
                    placeholder={`Min: ${MIN_SIZE}`}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-gray-700 mb-2 block">
                    Hauteur (cm)
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={heightCm}
                    onChange={(e) => {
                      const val = e.target.value
                      // Allow empty string or valid numbers
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        const parsed = parseFloat(val)
                        if (val === '') {
                          setHeightCm(0)
                        } else if (!isNaN(parsed)) {
                          setHeightCm(parsed)
                        }
                      }
                    }}
                    className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                      error
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-gray-200 focus:border-[#FEA501]'
                    }`}
                    placeholder={`Min: ${MIN_SIZE}`}
                  />
                </label>
              </div>
              {shape === 'cut_contour' && (
                <p className="text-xs text-blue-900 bg-blue-100 rounded px-3 py-2 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>La taille sera prise en compte pour le plus grand côté du visuel</span>
                </p>
              )}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2 flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
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
