import type { CollectionAfterChangeHook } from 'payload'
import { generateDeliveryNotePDF, savePDFToFile } from '../lib/pdf-generator'

export const generateDeliveryNoteHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Générer le bon de livraison quand le statut passe à in_production
  const shouldGenerateDeliveryNote =
    operation === 'update' &&
    previousDoc?.status !== 'in_production' &&
    doc.status === 'in_production'

  if (!shouldGenerateDeliveryNote || doc.deliveryNoteUrl) {
    return doc
  }

  try {
    console.log(`📦 Génération du bon de livraison pour la commande ${doc.orderNumber}...`)

    // Générer le numéro de bon de livraison si non existant
    if (!doc.deliveryNoteNumber) {
      const year = new Date().getFullYear()
      const orderCount = await req.payload.count({
        collection: 'orders',
        where: {
          deliveryNoteNumber: {
            contains: `BL-${year}`,
          },
        },
      })

      doc.deliveryNoteNumber = `BL-${year}-${String(orderCount + 1).padStart(5, '0')}`
    }

    // Générer le PDF
    const pdfBuffer = await generateDeliveryNotePDF({
      orderNumber: doc.orderNumber,
      deliveryNoteNumber: doc.deliveryNoteNumber,
      createdAt: doc.createdAt,
      paidAt: doc.paidAt,
      customerName: doc.customerName,
      customerEmail: doc.customerEmail,
      customerCompany: doc.customerCompany,
      shippingAddress: doc.shippingAddress,
      billingAddress: doc.billingAddress,
      items: doc.items,
      subtotalHT: doc.subtotalHT,
      shippingCents: doc.shippingCents,
      taxCents: doc.taxCents,
      discountCents: doc.discountCents,
      totalCents: doc.totalCents,
      shippingMethod: doc.shippingMethod,
      paymentMethod: doc.paymentMethod,
    })

    // Sauvegarder le PDF
    const filename = `delivery-note-${doc.deliveryNoteNumber}.pdf`
    const filepath = await savePDFToFile(pdfBuffer, filename)

    // Mettre à jour la commande avec l'URL du bon de livraison
    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: {
        deliveryNoteUrl: filepath,
        deliveryNoteNumber: doc.deliveryNoteNumber,
      },
    })

    console.log(`✅ Bon de livraison généré: ${filepath}`)

    return {
      ...doc,
      deliveryNoteUrl: filepath,
      deliveryNoteNumber: doc.deliveryNoteNumber,
    }
  } catch (error) {
    console.error('❌ Erreur lors de la génération du bon de livraison:', error)
    return doc
  }
}
