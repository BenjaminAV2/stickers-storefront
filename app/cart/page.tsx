'use client'

import { useCart } from '@/contexts/CartContext'
import CartItem from '@/components/CartItem'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, clearCart, totalItems, totalCents } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2) + ' €'
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Votre Panier
          </h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Découvrez notre collection de stickers personnalisés de qualité premium
              et ajoutez vos favoris au panier.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5" />
              Découvrir nos stickers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Votre Panier
            </h1>
            <p className="text-gray-600">
              {totalItems} {totalItems > 1 ? 'stickers' : 'sticker'} dans votre panier
            </p>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Vider le panier
          </button>
        </div>

        {/* Clear confirmation modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Vider le panier ?
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ?
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    clearCart()
                    setShowClearConfirm(false)
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Vider
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => removeItem(index)}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{formatPrice(totalCents)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="text-sm">Calculée à l'étape suivante</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(totalCents)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">TVA incluse</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
                  onClick={() => alert('Fonctionnalité checkout à venir')}
                >
                  Procéder au paiement
                  <ArrowRight className="w-5 h-5" />
                </button>

                <Link
                  href="/products"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Continuer mes achats
                </Link>
              </div>

              {/* Reassurance */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Livraison rapide 48-72h</span>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Support client réactif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
