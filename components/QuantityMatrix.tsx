'use client'

import { useState } from 'react'
import { formatEur, PriceMatrixRow, MIN_CUSTOM_QUANTITY } from '@/lib/pricing'

interface QuantityMatrixProps {
  rows: PriceMatrixRow[]
  selectedQ?: number
  customQuantityRow?: PriceMatrixRow | null
  onSelect: (q: number) => void
  onCustomQuantityChange?: (q: number) => void
  showError?: boolean
}

export default function QuantityMatrix({
  rows,
  selectedQ,
  customQuantityRow,
  onSelect,
  onCustomQuantityChange,
  showError = false,
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
    <div className={`bg-white rounded-lg shadow-[var(--shadow-card)] overflow-hidden ${showError ? 'ring-2 ring-red-500' : ''}`}>
      <div className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-50 border-b border-blue-100">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">Tarifs dégressifs</h3>
        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
          Cliquez sur une ligne pour sélectionner la quantité
        </p>
      </div>

      {/* Mobile: Compact grid layout */}
      <div className="block sm:hidden p-3">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {rows.map((row) => {
            const isSelected = !isCustomSelected && selectedQ === row.q
            return (
              <button
                key={row.q}
                onClick={() => handlePresetClick(row.q)}
                className={`
                  px-2.5 py-2 rounded-lg text-center transition-all border-2
                  ${isSelected
                    ? 'bg-[#4F39D7] text-white border-[#4F39D7]'
                    : 'bg-white border-gray-200 hover:border-[#4F39D7]'}
                `}
              >
                <div className="text-2xl font-bold mb-1">
                  {row.q}
                </div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {row.discountPct > 0 && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      -{row.discountPct}%
                    </span>
                  )}
                  <span className={`text-xs font-medium ${isSelected ? 'opacity-80' : 'text-gray-600'}`}>
                    {formatEur(row.totalCents)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Custom quantity compact */}
        <div
          className={`
            px-3 py-2 rounded-lg border-2 transition-all
            ${isCustomSelected && customQuantityRow
              ? 'bg-[#FEA501] text-white border-[#FEA501]'
              : 'bg-blue-50 border-blue-200'}
          `}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min={MIN_CUSTOM_QUANTITY}
                value={customQInput}
                onChange={(e) => handleCustomQuantityChange(e.target.value)}
                onClick={handleCustomClick}
                onFocus={handleCustomClick}
                placeholder={`${MIN_CUSTOM_QUANTITY}`}
                className={`
                  w-16 px-2 py-1 text-xs rounded border transition-colors
                  ${
                    isCustomSelected && customQuantityRow
                      ? 'border-white bg-white/20 text-white placeholder-white/70'
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }
                  focus:outline-none
                `}
              />
              <span className="text-xs font-semibold">Perso</span>
              {customQuantityRow && customQuantityRow.discountPct > 0 && (
                <span
                  className={`text-[10px] font-semibold px-1 py-0.5 rounded ${
                    isCustomSelected ? 'bg-white/20' : 'bg-green-100 text-green-800'
                  }`}
                >
                  -{customQuantityRow.discountPct}%
                </span>
              )}
            </div>
            {customQuantityRow && (
              <div className="text-right">
                <div className="text-sm font-bold">
                  {formatEur(customQuantityRow.totalCents)}
                </div>
                <div className={`text-[10px] ${isCustomSelected ? 'opacity-80' : 'text-gray-500'}`}>
                  {formatEur(customQuantityRow.unitCents)}/u
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden sm:block">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                Quantité
              </th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">
                Remise
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                Prix/u
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
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
                  <td className="px-3 py-2.5 font-medium">
                    {row.q} pcs
                  </td>
                  <td className="px-3 py-2.5 text-center">
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
                  <td className="px-3 py-2.5 text-right font-medium">
                    {formatEur(row.unitCents)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold">
                    {formatEur(row.totalCents)}
                  </td>
                </tr>
              )
            })}

            {/* Custom quantity row */}
            <tr
              className={`
                border-b border-gray-100 transition-colors
                ${isCustomSelected && customQuantityRow ? 'bg-[#FEA501] text-white' : 'bg-blue-50'}
              `}
            >
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={MIN_CUSTOM_QUANTITY}
                    value={customQInput}
                    onChange={(e) => handleCustomQuantityChange(e.target.value)}
                    onClick={handleCustomClick}
                    onFocus={handleCustomClick}
                    placeholder={`${MIN_CUSTOM_QUANTITY}`}
                    className={`
                      w-20 px-2 py-1 text-sm rounded border-2 transition-colors
                      ${
                        isCustomSelected && customQuantityRow
                          ? 'border-white bg-white/20 text-white placeholder-white/70'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }
                      focus:outline-none focus:border-[#FEA501]
                    `}
                  />
                  <span className="text-xs font-semibold whitespace-nowrap">✨ Perso</span>
                </div>
              </td>
              <td className="px-3 py-2.5 text-center">
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
              <td className="px-3 py-2.5 text-right font-medium">
                {customQuantityRow ? formatEur(customQuantityRow.unitCents) : '—'}
              </td>
              <td className="px-3 py-2.5 text-right font-bold">
                {customQuantityRow ? formatEur(customQuantityRow.totalCents) : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {customQInput && parseInt(customQInput, 10) < MIN_CUSTOM_QUANTITY && (
        <div className="px-3 py-2 bg-yellow-50 border-t border-yellow-200">
          <p className="text-xs text-yellow-800">
            La quantité minimale est de {MIN_CUSTOM_QUANTITY} unités
          </p>
        </div>
      )}
    </div>
  )
}
