'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerCompany?: string
  countryCode: string
  status: string
  items: any[]
  subtotalHT: number
  shippingCents: number
  taxCents: number
  totalCents: number
  shippingMethod: string
  shippingAddress: any
  billingAddress?: any
  paymentMethod: string
  paymentStatus: string
  paidAt?: string
  statusHistory?: any[]
  trackingNumber?: string
  refund?: {
    isRefunded: boolean
    refundType?: 'full' | 'partial'
    refundAmountCents?: number
    refundReason?: string
    refundedAt?: string
    refundedBy?: string
  }
  createdAt: string
  updatedAt: string
}

export default function CustomOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set())
  const [editData, setEditData] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [resolvedParams.id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${resolvedParams.id}`)
      const data = await res.json()
      setOrder(data)
      setEditData(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleEdit = (section: string) => {
    const newSet = new Set(editingSections)
    if (newSet.has(section)) {
      newSet.delete(section)
    } else {
      newSet.add(section)
    }
    setEditingSections(newSet)
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (res.ok) {
        const updated = await res.json()
        setOrder(updated)
        setEditData(updated)
        toggleEdit(section)
      } else {
        const error = await res.json()
        alert(`Erreur lors de la sauvegarde: ${error.error || 'Erreur inconnue'}`)
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (cents: number) => `${(cents / 100).toFixed(2)}€`
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Commande introuvable</div>
      </div>
    )
  }

  const statusLabels: Record<string, string> = {
    pending_payment: '⏳ En attente paiement',
    paid_awaiting_bat: '✅ Payée - Attente BAT',
    in_production: '🏭 En fabrication',
    production_complete: '✓ Fabrication terminée',
    preparing_shipment: '📦 Préparation expédition',
    in_delivery: '🚚 En livraison',
    delivered: '✓ Livrée',
    cancelled: '❌ Annulée',
  }

  const shapeLabels: Record<string, string> = {
    square: 'Carré',
    round: 'Rond',
    rectangle: 'Rectangle',
    oval: 'Ovale',
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-blue-600 hover:text-blue-700">
            Admin
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/admin-custom/orders" className="text-blue-600 hover:text-blue-700">
            Commandes
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{order.orderNumber}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin-custom/orders"
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                ← Retour
              </Link>
              <Link
                href={`/admin/collections/orders/${order.id}`}
                className="text-xs px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
              >
                Payload Admin
              </Link>
            </div>
          </div>

          {editingSections.has('customer') ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <label className="block text-gray-600 mb-1">Nom du client</label>
                  <input
                    type="text"
                    value={editData.customerName || ''}
                    onChange={(e) => setEditData({ ...editData, customerName: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={editData.customerEmail || ''}
                    onChange={(e) => setEditData({ ...editData, customerEmail: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Société (optionnel)</label>
                  <input
                    type="text"
                    value={editData.customerCompany || ''}
                    onChange={(e) => setEditData({ ...editData, customerCompany: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Pays</label>
                  <input
                    type="text"
                    value={editData.countryCode || ''}
                    onChange={(e) => setEditData({ ...editData, countryCode: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditData(order)
                    toggleEdit('customer')
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSave('customer')}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs mb-2">
                <div className="flex gap-1">
                  <span className="text-gray-500">Client:</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex gap-1">
                  <span className="text-gray-500">Email:</span>
                  <span>{order.customerEmail}</span>
                </div>
                {order.customerCompany && (
                  <div className="flex gap-1">
                    <span className="text-gray-500">Société:</span>
                    <span>{order.customerCompany}</span>
                  </div>
                )}
                <div className="flex gap-1">
                  <span className="text-gray-500">Pays:</span>
                  <span>{order.countryCode}</span>
                </div>
              </div>
              <button
                onClick={() => toggleEdit('customer')}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Statut de la commande</label>
              <select
                value={order.status}
                onChange={(e) => {
                  const newStatus = e.target.value
                  setEditData({ ...editData, status: newStatus })
                  setOrder({ ...order, status: newStatus })
                  handleSave('status')
                }}
                className="text-sm font-medium px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={saving}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Total TTC</div>
              <div className="text-2xl font-bold text-gray-900">{formatPrice(order.totalCents)}</div>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Articles ({order.items?.length || 0})</h2>
          </div>
          <div className="space-y-2">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                <div className="flex items-start justify-between text-xs">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.productName}</div>
                    <div className="text-gray-500 mt-0.5">
                      {item.productReference} • {item.size} • {shapeLabels[item.supportShape] || item.supportShape}
                      {item.batApproved && <span className="ml-2 text-green-600">✓ BAT</span>}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-medium">{formatPrice(item.totalPriceCents)}</div>
                    <div className="text-gray-500">
                      {item.quantity} × {formatPrice(item.unitPriceCents)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <h2 className="text-sm font-semibold mb-2">Tarification</h2>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Sous-total HT</span>
              <span>{formatPrice(order.subtotalHT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span>{formatPrice(order.shippingCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">TVA (20%)</span>
              <span>{formatPrice(order.taxCents)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm pt-1 border-t">
              <span>Total TTC</span>
              <span>{formatPrice(order.totalCents)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Address */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Livraison</h2>
            {!editingSections.has('shipping') && (
              <button
                onClick={() => toggleEdit('shipping')}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Modifier
              </button>
            )}
          </div>

          {editingSections.has('shipping') ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                <div>
                  <label className="block text-gray-600 mb-1">Méthode de livraison</label>
                  <input
                    type="text"
                    value={editData.shippingMethod || ''}
                    onChange={(e) => setEditData({ ...editData, shippingMethod: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Numéro de suivi</label>
                  <input
                    type="text"
                    value={editData.trackingNumber || ''}
                    onChange={(e) => setEditData({ ...editData, trackingNumber: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-3 mb-3">
                <div className="font-medium mb-2 text-xs">Adresse de livraison</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-gray-600 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.firstName || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, firstName: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Nom</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.lastName || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, lastName: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 mb-1">Société (optionnel)</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.company || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, company: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.address1 || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, address1: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Code postal</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.postalCode || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, postalCode: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Ville</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.city || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, city: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={editData.shippingAddress?.phone || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          shippingAddress: { ...editData.shippingAddress, phone: e.target.value },
                        })
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditData(order)
                    toggleEdit('shipping')
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSave('shipping')}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="text-gray-600">Méthode:</span>
                  <span className="font-medium">{order.shippingMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex gap-2">
                    <span className="text-gray-600">Suivi:</span>
                    <span className="font-mono">{order.trackingNumber}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium mb-1">Adresse de livraison</div>
                <div className="text-gray-700 leading-relaxed">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  <br />
                  {order.shippingAddress?.company && (
                    <>
                      {order.shippingAddress.company}
                      <br />
                    </>
                  )}
                  {order.shippingAddress?.address1}
                  <br />
                  {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                  <br />
                  {order.shippingAddress?.phone}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Paiement</h2>
            {!editingSections.has('payment') && (
              <button
                onClick={() => toggleEdit('payment')}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Modifier
              </button>
            )}
          </div>

          {editingSections.has('payment') ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <label className="block text-gray-600 mb-1">Méthode de paiement</label>
                  <select
                    value={editData.paymentMethod || ''}
                    onChange={(e) => setEditData({ ...editData, paymentMethod: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="stripe">CB (Stripe)</option>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Statut du paiement</label>
                  <select
                    value={editData.paymentStatus || ''}
                    onChange={(e) => setEditData({ ...editData, paymentStatus: e.target.value })}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="paid">Payé</option>
                    <option value="failed">Échoué</option>
                    <option value="refunded">Remboursé</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditData(order)
                    toggleEdit('payment')
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSave('payment')}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs">
              <div className="flex gap-1">
                <span className="text-gray-600">Méthode:</span>
                <span>{order.paymentMethod === 'stripe' ? 'CB (Stripe)' : order.paymentMethod}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-gray-600">Statut:</span>
                <span
                  className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}
                >
                  {order.paymentStatus === 'paid' ? 'Payé' : 'En attente'}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex gap-1">
                  <span className="text-gray-600">Payé le:</span>
                  <span>{formatDate(order.paidAt)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Refund */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold">Remboursement</h2>
            {!editingSections.has('refund') && (
              <button
                onClick={() => toggleEdit('refund')}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                {order.refund?.isRefunded ? 'Modifier' : 'Rembourser'}
              </button>
            )}
          </div>

          {editingSections.has('refund') ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editData.refund?.isRefunded || false}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          refund: { ...editData.refund, isRefunded: e.target.checked },
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-gray-700">Commande remboursée</span>
                  </label>
                </div>
                {editData.refund?.isRefunded && (
                  <>
                    <div>
                      <label className="block text-gray-600 mb-1">Type de remboursement</label>
                      <select
                        value={editData.refund?.refundType || 'full'}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            refund: { ...editData.refund, refundType: e.target.value as 'full' | 'partial' },
                          })
                        }
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="full">Complet</option>
                        <option value="partial">Partiel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Montant remboursé</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={(editData.refund?.refundAmountCents || 0) / 100}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              refund: {
                                ...editData.refund,
                                refundAmountCents: Math.round(parseFloat(e.target.value) * 100),
                              },
                            })
                          }
                          step="0.01"
                          min="0"
                          className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1">Date du remboursement</label>
                      <input
                        type="datetime-local"
                        value={
                          editData.refund?.refundedAt
                            ? new Date(editData.refund.refundedAt).toISOString().slice(0, 16)
                            : new Date().toISOString().slice(0, 16)
                        }
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            refund: { ...editData.refund, refundedAt: new Date(e.target.value).toISOString() },
                          })
                        }
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-600 mb-1">Raison du remboursement</label>
                      <textarea
                        value={editData.refund?.refundReason || ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            refund: { ...editData.refund, refundReason: e.target.value },
                          })
                        }
                        rows={2}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Produit défectueux, annulation client..."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditData(order)
                    toggleEdit('refund')
                  }}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSave('refund')}
                  className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {order.refund?.isRefunded ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                      ✓ Remboursée
                    </span>
                    <span className="text-gray-600">
                      {order.refund.refundType === 'full' ? 'Complet' : 'Partiel'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
                    <div className="flex gap-1">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-medium text-red-600">{formatPrice(order.refund.refundAmountCents || 0)}</span>
                    </div>
                    {order.refund.refundedAt && (
                      <div className="flex gap-1">
                        <span className="text-gray-600">Date:</span>
                        <span>{formatDate(order.refund.refundedAt)}</span>
                      </div>
                    )}
                    {order.refund.refundedBy && (
                      <div className="flex gap-1">
                        <span className="text-gray-600">Par:</span>
                        <span>{order.refund.refundedBy}</span>
                      </div>
                    )}
                  </div>
                  {order.refund.refundReason && (
                    <div className="pt-2 border-t">
                      <div className="text-gray-600">Raison:</div>
                      <div className="text-gray-900 mt-0.5">{order.refund.refundReason}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Aucun remboursement effectué</div>
              )}
            </div>
          )}
        </div>

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-semibold mb-3">Historique</h2>
            <div className="space-y-2">
              {order.statusHistory.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="flex-shrink-0 w-20 text-gray-500">{formatDate(item.changedAt)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{statusLabels[item.status] || item.status}</div>
                    {item.note && <div className="text-gray-600 mt-0.5">{item.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sticky Save Button for Mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden shadow-lg z-50">
          {editingSections.size > 0 ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditData(order)
                  setEditingSections(new Set())
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition-colors"
                disabled={saving}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  const section = Array.from(editingSections)[0]
                  handleSave(section)
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          ) : (
            <Link
              href="/admin-custom/orders"
              className="block w-full text-center py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded transition-colors"
            >
              ← Retour aux commandes
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
