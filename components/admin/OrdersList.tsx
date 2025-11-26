'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Order {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  totalCents: number
  customer: any
  shippingAddress: any
  billingAddress: any
  paymentMethod: string
  items: any[]
}

interface Pagination {
  page: number
  limit: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface OrdersListData {
  orders: Order[]
  pagination: Pagination
}

export default function OrdersList() {
  const [data, setData] = useState<OrdersListData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtres
  const [status, setStatus] = useState('all')
  const [country, setCountry] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [status, country, search, dateFrom, dateTo, page])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '30',
      })

      if (status !== 'all') params.append('status', status)
      if (country) params.append('country', country)
      if (search) params.append('search', search)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_payment: '⏳ En attente',
      paid_awaiting_bat: '✅ Attente BAT',
      in_production: '🏭 Fabrication',
      production_complete: '✓ Terminée',
      preparing_shipment: '📦 Préparation',
      in_delivery: '🚚 En livraison',
      delivered: '✓ Livrée',
      cancelled: '❌ Annulée',
      refund_full: '💰 Remboursée',
      refund_partial: '💸 Remb. partiel',
    }
    return statusMap[status] || status
  }

  const handleResetFilters = () => {
    setStatus('all')
    setCountry('')
    setSearch('')
    setDateFrom(format(new Date(), 'yyyy-MM-dd'))
    setDateTo(format(new Date(), 'yyyy-MM-dd'))
    setPage(1)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Commandes</h1>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending_payment">⏳ En attente de paiement</option>
              <option value="paid_awaiting_bat">✅ Attente BAT</option>
              <option value="in_production">🏭 En fabrication</option>
              <option value="production_complete">✓ Fabrication terminée</option>
              <option value="preparing_shipment">📦 Préparation expédition</option>
              <option value="in_delivery">🚚 En livraison</option>
              <option value="delivered">✓ Livrée</option>
              <option value="cancelled">❌ Annulée</option>
              <option value="refund_full">💰 Remboursement complet</option>
              <option value="refund_partial">💸 Remboursement partiel</option>
            </select>
          </div>

          {/* Recherche */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher (N° commande, client)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Rechercher..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bouton reset */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg">Chargement...</div>
          </div>
        ) : !data || data.orders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Aucune commande trouvée</div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Heure
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Commande
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pays
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nb Produits
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paiement
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.createdAt
                          ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', {
                              locale: fr,
                            })
                          : '-'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {getStatusLabel(order.status)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        <a
                          href={`/admin/collections/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {order.orderNumber}
                        </a>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {order.shippingAddress?.countryCode || '-'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {order.customer && typeof order.customer === 'object' ? (
                          <a
                            href={`/admin/collections/customers/${order.customer.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {order.customer.company ||
                              `${order.customer.firstName || ''} ${order.customer.lastName || ''}`}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(order.totalCents / 100).toFixed(2)} €
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                        {order.items?.length || 0}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm">
                        {order.paymentMethod === 'stripe' ? 'CB' : 'PayPal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.pagination && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Page {data.pagination.page} sur {data.pagination.totalPages} (
                  {data.pagination.totalDocs} commandes)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!data.pagination.hasPrevPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.pagination.hasNextPage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
