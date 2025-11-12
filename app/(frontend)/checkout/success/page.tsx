'use client'

import Link from 'next/link'
import { CheckCircle, Package, Mail } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Commande confirmée !
          </h1>
          <p className="text-gray-600 mb-8">
            Merci pour votre achat. Nous avons bien reçu votre commande et nous la préparons avec
            soin.
          </p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Email de confirmation</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Un récapitulatif de votre commande vous a été envoyé par email
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-purple-900">Suivi de livraison</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Vous recevrez un email avec le numéro de suivi dès l'expédition de votre colis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-6 py-4 rounded-lg bg-[#5b40d7] text-white font-medium hover:bg-[#4a33b8] transition-colors text-center"
            >
              Retour à l'accueil
            </Link>
            <Link
              href="/products"
              className="block w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>

        {/* Support */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Une question ?{' '}
          <Link href="/contact" className="text-[#5b40d7] hover:underline font-medium">
            Contactez notre service client
          </Link>
        </p>
      </div>
    </div>
  )
}
