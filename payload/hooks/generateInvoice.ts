import type { CollectionAfterChangeHook } from 'payload'
import { generateInvoicePDF, savePDFToFile } from '../lib/pdf-generator'

export const generateInvoiceHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Générer la facture uniquement quand le statut passe à paid ou quand une commande payée est créée
  const shouldGenerateInvoice =
    (operation === 'create' && doc.paymentStatus === 'paid') ||
    (operation === 'update' &&
      previousDoc?.paymentStatus !== 'paid' &&
      doc.paymentStatus === 'paid')

  if (!shouldGenerateInvoice || doc.invoiceUrl) {
    return doc
  }

  try {
    console.log(`📄 Génération de la facture pour la commande ${doc.orderNumber}...`)

    // Générer le numéro de facture si non existant
    if (!doc.invoiceNumber) {
      const year = new Date().getFullYear()
      const orderCount = await req.payload.count({
        collection: 'orders',
        where: {
          invoiceNumber: {
            contains: `INV-${year}`,
          },
        },
      })

      doc.invoiceNumber = `INV-${year}-${String(orderCount + 1).padStart(5, '0')}`
    }

    // Générer le PDF
    const pdfBuffer = await generateInvoicePDF({
      orderNumber: doc.orderNumber,
      invoiceNumber: doc.invoiceNumber,
      paidAt: doc.paidAt,
      createdAt: doc.createdAt,
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
    const filename = `invoice-${doc.invoiceNumber}.pdf`
    const filepath = await savePDFToFile(pdfBuffer, filename)

    // Mettre à jour la commande avec l'URL de la facture
    await req.payload.update({
      collection: 'orders',
      id: doc.id,
      data: {
        invoiceUrl: filepath,
        invoiceNumber: doc.invoiceNumber,
      },
    })

    console.log(`✅ Facture générée: ${filepath}`)

    return {
      ...doc,
      invoiceUrl: filepath,
      invoiceNumber: doc.invoiceNumber,
    }
  } catch (error) {
    console.error('❌ Erreur lors de la génération de la facture:', error)
    return doc
  }
}
