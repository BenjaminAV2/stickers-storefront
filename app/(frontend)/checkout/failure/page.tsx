'use client'

import Link from 'next/link'
import { XCircle, HelpCircle } from 'lucide-react'

export default function CheckoutFailurePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Paiement non abouti
          </h1>
          <p className="text-gray-600 mb-8">
            Le paiement n'a pas pu être traité. Votre compte n'a pas été débité.
          </p>

          {/* Possible Reasons */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-900 mb-2">Raisons possibles :</p>
                <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                  <li>Fonds insuffisants</li>
                  <li>Carte bancaire expirée</li>
                  <li>Limite de paiement dépassée</li>
                  <li>Problème technique temporaire</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="block w-full px-6 py-4 rounded-lg bg-[#5b40d7] text-white font-medium hover:bg-[#4a33b8] transition-colors text-center"
            >
              Réessayer le paiement
            </Link>
            <Link
              href="/cart"
              className="block w-full px-6 py-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Retour au panier
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors text-center text-sm"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6 text-center">
          <p className="text-sm text-gray-700 mb-2">Besoin d'aide ?</p>
          <Link
            href="/contact"
            className="inline-flex items-center text-[#5b40d7] hover:underline font-medium text-sm"
          >
            Contacter le support
          </Link>
        </div>
      </div>
    </div>
  )
}
