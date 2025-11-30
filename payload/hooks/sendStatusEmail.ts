import type { CollectionAfterChangeHook } from 'payload'
import {
  generateOrderConfirmationEmail,
  generateBATReadyEmail,
  generateInProductionEmail,
  generateShippedEmail,
  generateDeliveredEmail,
} from '../lib/email-templates'

// Configuration email (à adapter selon votre provider)
// Pour un vrai système, utiliser un service comme SendGrid, Resend, etc.
async function sendEmail(to: string, subject: string, html: string) {
  // Pour le développement, on log juste l'email
  console.log('📧 Email à envoyer:')
  console.log(`  À: ${to}`)
  console.log(`  Sujet: ${subject}`)
  console.log(`  HTML length: ${html.length} caractères`)

  // TODO: Implémenter l'envoi réel d'email
  // Exemple avec Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'contact@exclusives-stickers.com',
    to,
    subject,
    html,
  })
  */

  // Pour simulation, on retourne true
  return true
}

export const sendStatusEmailHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // N'envoyer un email que si le statut a changé
  if (operation !== 'update' || !previousDoc || doc.status === previousDoc.status) {
    return doc
  }

  const emailData = {
    to: doc.customerEmail,
    orderNumber: doc.orderNumber,
    customerName: doc.customerName,
    totalCents: doc.totalCents,
    items: doc.items.map((item: any) => ({
      productName: item.productName,
      quantity: item.quantity,
      size: item.size,
    })),
    shippingAddress: doc.shippingAddress,
    trackingNumber: doc.trackingNumber,
    trackingUrl: doc.trackingUrl,
  }

  try {
    let emailTemplate

    switch (doc.status) {
      case 'paid_awaiting_bat':
        // Email de confirmation de paiement
        if (previousDoc.status === 'pending_payment') {
          emailTemplate = generateOrderConfirmationEmail(emailData)
        }
        break

      // Note: L'email BAT ready sera envoyé depuis un autre système
      // quand l'admin upload le BAT

      case 'in_production':
        // Email de mise en fabrication
        emailTemplate = generateInProductionEmail(emailData)
        break

      case 'in_delivery':
        // Email d'expédition
        emailTemplate = generateShippedEmail(emailData)
        break

      case 'delivered':
        // Email de livraison
        emailTemplate = generateDeliveredEmail(emailData)
        break

      default:
        // Pas d'email pour les autres statuts
        return doc
    }

    if (emailTemplate) {
      await sendEmail(emailData.to, emailTemplate.subject, emailTemplate.html)
      console.log(`✅ Email envoyé à ${emailData.to} pour statut ${doc.status}`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error)
    // On ne bloque pas la sauvegarde si l'email échoue
  }

  return doc
}
