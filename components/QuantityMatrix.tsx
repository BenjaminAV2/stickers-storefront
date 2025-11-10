'use client'

import { useState } from 'react'
import { formatEur, PriceMatrixRow, MIN_CUSTOM_QUANTITY } from '@/lib/pricing'

interface QuantityMatrixProps {
  rows: PriceMatrixRow[]
  selectedQ?: number
  customQuantityRow?: PriceMatrixRow | null
  onSelect: (q: number) => void
  onCustomQuantityChange?: (q: number) => void
}

export default function QuantityMatrix({
  rows,
  selectedQ,
  customQuantityRow,
  onSelect,
  onCustomQuantityChange,
}: QuantityMatrixProps) {
  const [customQInput, setCustomQInput] = useState('')
  const [isCustomSelected, setIsCustomSelected] = useState(false)

  const handleCustomQuantityChange = (value: string) => {
    setCustomQInput(value)
    const parsedValue = parseInt(value, 10)
    if (!isNaN(parsedValue) && parsedValue >= MIN_CUSTOM_QUANTITY && onCustomQuantityChange) {
      onCustomQuantityChange(parsedValue)
    }
  }

  const handleCustomClick = () => {
    setIsCustomSelected(true)
    if (customQuantityRow) {
      onSelect(customQuantityRow.q)
    }
  }

  const handlePresetClick = (q: number) => {
    setIsCustomSelected(false)
    setCustomQInput('')
    onSelect(q)
  }

  return (
    <div className="bg-white rounded-lg shadow-[var(--shadow-card)] overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Tarifs dégressifs</h3>
        <p className="text-xs text-gray-500 mt-1">
          Cliquez sur une ligne pour sélectionner la quantité
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Quantité
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                Remise
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                Prix unitaire
              </th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = !isCustomSelected && selectedQ === row.q
              return (
                <tr
                  key={row.q}
                  onClick={() => handlePresetClick(row.q)}
                  className={`
                    cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors
                    ${isSelected ? 'bg-[#4F39D7] text-white hover:bg-[#4F39D7]' : ''}
                  `}
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {row.q} pcs
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {row.discountPct > 0 ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        -{row.discountPct}%
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium">
                    {formatEur(row.unitCents)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold">
                    {formatEur(row.totalCents)}
                  </td>
                </tr>
              )
            })}

            {/* Custom quantity row */}
            <tr
              className={`
                border-b border-gray-100 transition-colors
                ${isCustomSelected && customQuantityRow ? 'bg-[#FEA501] text-white' : 'bg-gray-50'}
              `}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={MIN_CUSTOM_QUANTITY}
                    value={customQInput}
                    onChange={(e) => handleCustomQuantityChange(e.target.value)}
                    onClick={handleCustomClick}
                    onFocus={handleCustomClick}
                    placeholder={`Min. ${MIN_CUSTOM_QUANTITY}`}
                    className={`
                      w-24 px-2 py-1 text-sm rounded border-2 transition-colors
                      ${
                        isCustomSelected && customQuantityRow
                          ? 'border-white bg-white/20 text-white placeholder-white/70'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-[#FEA501]
                    `}
                  />
                  <span className={`text-xs font-semibold ${isCustomSelected && customQuantityRow ? 'text-white' : 'text-gray-600'}`}>
                    Personnalisé
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                {customQuantityRow && customQuantityRow.discountPct > 0 ? (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      isCustomSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    -{customQuantityRow.discountPct}%
                  </span>
                ) : (
                  <span className={`text-xs ${isCustomSelected && customQuantityRow ? 'text-white' : 'text-gray-400'}`}>—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-right font-medium">
                {customQuantityRow ? formatEur(customQuantityRow.unitCents) : '—'}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold">
                {customQuantityRow ? formatEur(customQuantityRow.totalCents) : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {customQInput && parseInt(customQInput, 10) < MIN_CUSTOM_QUANTITY && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-800">
            La quantité minimale est de {MIN_CUSTOM_QUANTITY} unités
          </p>
        </div>
      )}
    </div>
  )
}
