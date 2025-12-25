'use client'

import { useCart } from '@/contexts/CartContext'
import CartItem from '@/components/CartItem'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import StickyCheckoutButton from './StickyCheckoutButton'

export default function CartContent() {
  const { items, removeItem, clearCart, totalItems, totalCents } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const router = useRouter()

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2) + ' €'
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  // Empty cart state
  if (items.length === 0) {
    return (
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
    )
  }

  // Cart with items
  return (
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

          {/* Reassurance Section - Under products */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 sm:p-6 mt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Fabrication et livraison rapide */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-primary-blue to-blue-600 rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                  Fabrication & Livraison Rapides
                </h3>
              </div>

              {/* Qualité optimale */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                  Qualité Optimale
                </h3>
              </div>

              {/* Encre écologique */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:scale-110 duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                  Encre Écologique Haute Tenue
                </h3>
              </div>

              {/* Fabriqué en France */}
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md transform transition-transform hover:scale-110 duration-300">
                  🇫🇷
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                  Fabriqué en France
                </h3>
              </div>
            </div>
          </div>
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
                data-checkout-button
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FEA501] text-white font-bold rounded-lg hover:bg-[#e89401] hover:shadow-lg transition-all"
                onClick={handleCheckout}
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

              <p className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 text-center pt-3">
                <Upload className="w-4 h-4" />
                Le transfert de l'image se fera à l'étape suivante
              </p>
            </div>

            {/* Sticky Checkout Button */}
            <StickyCheckoutButton
              totalCents={totalCents}
              buttonText="Procéder au paiement"
              onClick={handleCheckout}
            />

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
  )
}
