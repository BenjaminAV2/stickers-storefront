'use client'

import { SupportType, ShapeType } from '@/lib/pricing'

interface SupportShapePickerProps {
  support: SupportType
  shape: ShapeType
  onChange: (config: { support: SupportType; shape: ShapeType }) => void
}

const SUPPORT_OPTIONS = [
  { value: 'vinyle_blanc', label: 'Vinyle Blanc' },
  { value: 'vinyle_transparent', label: 'Vinyle Transparent' },
  { value: 'vinyle_holographique', label: 'Vinyle Holographique' },
  { value: 'vinyle_miroir', label: 'Vinyle Miroir' },
] as const

const SHAPE_OPTIONS = [
  { value: 'carre_rectangle', label: 'Carré / Rectangle' },
  { value: 'rond', label: 'Rond' },
  { value: 'cut_contour', label: 'Découpe Contour' },
] as const

export default function SupportShapePicker({
  support,
  shape,
  onChange,
}: SupportShapePickerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Support
        </label>
        <select
          value={support}
          onChange={(e) =>
            onChange({ support: e.target.value as SupportType, shape })
          }
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4F39D7] focus:outline-none transition-colors bg-white"
        >
          {SUPPORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Forme
        </label>
        <select
          value={shape}
          onChange={(e) =>
            onChange({ support, shape: e.target.value as ShapeType })
          }
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#4F39D7] focus:outline-none transition-colors bg-white"
        >
          {SHAPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
