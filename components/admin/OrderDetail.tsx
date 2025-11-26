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
  subtotalHT: number
  taxCents: number
  shippingCents: number
  customer: any
  shippingAddress: any
  billingAddress: any
  deliveryType: string
  relayPoint: any
  paymentMethod: string
  items: any[]
  statusHistory: any[]
  refund: any
  invoiceUrl?: string
  deliveryNoteUrl?: string
  trackingNumber?: string
  internalNotes?: string
}

interface OrderDetailProps {
  orderId: string
}

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  // État pour les modales
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showRefundModal, setShowRefundModal] = useState(false)

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      const result = await response.json()
      setOrder(result.order)
      setCustomerOrders(result.customerOrders || [])
      setSelectedStatus(result.order.status)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async () => {
    if (!order || selectedStatus === order.status) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      await fetchOrderDetail()
      setShowStatusModal(false)
    } catch (err: any) {
      alert(`Erreur: ${err.message}`)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_payment: '⏳ En attente de paiement',
      paid_awaiting_bat: '✅ Payée - Attente BAT',
      in_production: '🏭 En fabrication',
      production_complete: '✓ Fabrication terminée',
      preparing_shipment: '📦 Préparation expédition',
      in_delivery: '🚚 En livraison',
      delivered: '✓ Livrée',
      cancelled: '❌ Annulée',
      refund_full: '💰 Remboursement complet',
      refund_partial: '💸 Remboursement partiel',
    }
    return statusMap[status] || status
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Chargement de la commande...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Erreur: {error || 'Commande non trouvée'}</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Commande {order.orderNumber}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Modifier le statut
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Statut actuel: {getStatusLabel(order.status)}</span>
          <span>•</span>
          <span>
            Date:{' '}
            {order.createdAt
              ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })
              : 'N/A'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Produits */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Produits</h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-gray-600">Réf: {item.productReference}</div>
                      <div className="text-sm text-gray-600">
                        Taille: {item.size} • Support: {item.supportShape}
                      </div>
                      <div className="text-sm text-gray-600">Quantité: {item.quantity}</div>
                      {item.batVisual && (
                        <div className="text-sm text-green-600 mt-1">
                          ✓ BAT fourni{' '}
                          {item.batApproved ? '(Approuvé le ' + item.batApprovedAt + ')' : ''}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {(item.totalPriceCents / 100).toFixed(2)} €
                      </div>
                      <div className="text-sm text-gray-600">
                        {(item.unitPriceCents / 100).toFixed(2)} € / unité
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total HT:</span>
                <span>{(order.subtotalHT / 100).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA (20%):</span>
                <span>{(order.taxCents / 100).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frais de port:</span>
                <span>{(order.shippingCents / 100).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total TTC:</span>
                <span>{(order.totalCents / 100).toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Adresses */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Adresses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Livraison */}
              <div>
                <h3 className="font-semibold mb-2">Livraison</h3>
                {order.deliveryType === 'relay_point' && order.relayPoint ? (
                  <div className="text-sm">
                    <div className="font-medium">Point relais:</div>
                    <div>{order.relayPoint.name}</div>
                    <div>{order.relayPoint.address}</div>
                    <div>
                      {order.relayPoint.postalCode} {order.relayPoint.city}
                    </div>
                    <a
                      href="https://www.chronopost.fr/expeditionAvanceeSec/ounoustrouver.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                      Voir carte des points relais
                    </a>
                  </div>
                ) : (
                  <div className="text-sm">
                    <div>{order.shippingAddress?.address1}</div>
                    {order.shippingAddress?.address2 && (
                      <div>{order.shippingAddress.address2}</div>
                    )}
                    <div>
                      {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                    </div>
                    <div>{order.shippingAddress?.countryCode}</div>
                  </div>
                )}
              </div>

              {/* Facturation */}
              <div>
                <h3 className="font-semibold mb-2">Facturation</h3>
                <div className="text-sm">
                  <div>{order.billingAddress?.address1}</div>
                  {order.billingAddress?.address2 && <div>{order.billingAddress.address2}</div>}
                  <div>
                    {order.billingAddress?.postalCode} {order.billingAddress?.city}
                  </div>
                  <div>{order.billingAddress?.countryCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des statuts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Historique des statuts</h2>
            <div className="space-y-3">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((history: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="text-gray-500 whitespace-nowrap">
                      {format(new Date(history.changedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{getStatusLabel(history.status)}</div>
                      {history.note && <div className="text-gray-600">{history.note}</div>}
                      {history.changedBy && (
                        <div className="text-gray-500 text-xs">Par: {history.changedBy}</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Aucun historique disponible</div>
              )}
            </div>
          </div>

          {/* Remboursement */}
          {order.refund?.isRefunded && (
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Remboursement</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Type:</span>{' '}
                  {order.refund.refundType === 'full' ? 'Complet' : 'Partiel'}
                </div>
                {order.refund.refundAmountCents && (
                  <div>
                    <span className="font-medium">Montant:</span>{' '}
                    {(order.refund.refundAmountCents / 100).toFixed(2)} €
                  </div>
                )}
                {order.refund.refundReason && (
                  <div>
                    <span className="font-medium">Raison:</span> {order.refund.refundReason}
                  </div>
                )}
                {order.refund.refundedAt && (
                  <div>
                    <span className="font-medium">Date:</span>{' '}
                    {format(new Date(order.refund.refundedAt), 'dd/MM/yyyy', { locale: fr })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Client */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Client</h2>
            {order.customer && typeof order.customer === 'object' ? (
              <div className="space-y-2 text-sm">
                <div className="font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                {order.customer.company && <div>{order.customer.company}</div>}
                <div>{order.customer.email}</div>
                {order.customer.phone && <div>{order.customer.phone}</div>}

                <div className="pt-4 space-y-2">
                  <a
                    href={`/admin/collections/customers/${order.customer.id}`}
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                  >
                    Voir fiche client
                  </a>
                  <button className="block w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-center">
                    Toutes les commandes ({customerOrders.length})
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Client non trouvé</div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Documents</h2>
            <div className="space-y-2">
              {order.invoiceUrl ? (
                <a
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                >
                  📄 Télécharger facture
                </a>
              ) : (
                <button className="block w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed">
                  Facture non disponible
                </button>
              )}

              {order.deliveryNoteUrl ? (
                <a
                  href={order.deliveryNoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                >
                  📦 Télécharger BL
                </a>
              ) : (
                <button className="block w-full px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed">
                  BL non disponible
                </button>
              )}
            </div>
          </div>

          {/* Livraison */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Livraison</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Méthode:</span> {order.paymentMethod}
              </div>
              {order.trackingNumber && (
                <div>
                  <span className="font-medium">Suivi:</span> {order.trackingNumber}
                </div>
              )}
            </div>
          </div>

          {/* Notes internes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Notes internes</h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              defaultValue={order.internalNotes || ''}
              placeholder="Notes internes (visibles uniquement par l'équipe)..."
            />
            <button className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Enregistrer les notes
            </button>
          </div>
        </div>
      </div>

      {/* Modal changement de statut */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Modifier le statut</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="pending_payment">⏳ En attente de paiement</option>
              <option value="paid_awaiting_bat">✅ Payée - Attente BAT</option>
              <option value="in_production">🏭 En fabrication</option>
              <option value="production_complete">✓ Fabrication terminée</option>
              <option value="preparing_shipment">📦 Préparation expédition</option>
              <option value="in_delivery">🚚 En livraison</option>
              <option value="delivered">✓ Livrée</option>
              <option value="cancelled">❌ Annulée</option>
              <option value="refund_full">💰 Remboursement complet</option>
              <option value="refund_partial">💸 Remboursement partiel</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={updateOrderStatus}
                disabled={updating || selectedStatus === order.status}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {updating ? 'Mise à jour...' : 'Confirmer'}
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedStatus(order.status)
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
