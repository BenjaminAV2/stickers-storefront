'use client'

import { formatEur, PriceMatrixRow } from '@/lib/pricing'

interface QuantityMatrixProps {
  rows: PriceMatrixRow[]
  selectedQ?: number
  onSelect: (q: number) => void
}

export default function QuantityMatrix({
  rows,
  selectedQ,
  onSelect,
}: QuantityMatrixProps) {
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
            {rows.map((row) => (
              <tr
                key={row.q}
                onClick={() => onSelect(row.q)}
                className={`
                  cursor-pointer border-b border-gray-100 hover:bg-blue-50 transition-colors
                  ${selectedQ === row.q ? 'bg-[#4F39D7] text-white hover:bg-[#4F39D7]' : ''}
                `}
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {row.q} pcs
                </td>
                <td className="px-4 py-3 text-sm">
                  {row.discountPct > 0 ? (
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        selectedQ === row.q
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
