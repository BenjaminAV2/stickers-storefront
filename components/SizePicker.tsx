'use client'

import { useState, useEffect } from 'react'
import { ShapeType } from '@/lib/pricing'

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
  const [widthCm, setWidthCm] = useState(5)
  const [heightCm, setHeightCm] = useState(5)
  const [diameterCm, setDiameterCm] = useState(5)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Validate and notify parent
    let valid = true
    let errorMsg: string | null = null

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

    setError(errorMsg)
    onChange({ widthCm, heightCm, diameterCm, valid })
  }, [shape, widthCm, heightCm, diameterCm])

  if (shape === 'rond') {
    return (
      <div className="space-y-3">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700 mb-2 block">
            Diamètre (cm)
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4F39D7] focus:outline-none transition-colors"
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
    )
  }

  return (
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4F39D7] focus:outline-none transition-colors"
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
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4F39D7] focus:outline-none transition-colors"
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
  )
}
