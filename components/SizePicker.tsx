'use client'

import { useState, useEffect } from 'react'
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
  }

  return (
    <div className="space-y-4">
      {/* Unified dropdown select for both mobile and desktop */}
      <div className="relative">
        <select
          value={isCustomSize ? 'custom' : selectedPreset}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'custom') {
              handleCustomClick()
            } else {
              handlePresetClick(parseInt(value))
            }
          }}
          className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-200 focus:border-[#4F39D7] focus:outline-none text-base font-medium bg-white shadow-sm hover:border-gray-300 transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em'
          }}
        >
          {presets.map((preset, index) => (
            <option key={index} value={index}>
              {preset.label}
            </option>
          ))}
          <option value="custom">✨ Personnalisé</option>
        </select>
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
