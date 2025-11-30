export interface EmailData {
  to: string
  orderNumber: string
  customerName: string
  totalCents: number
  items: Array<{
    productName: string
    quantity: number
    size: string
  }>
  shippingAddress?: any
  trackingNumber?: string
  trackingUrl?: string
}

const COMPANY_INFO = {
  name: 'Exclusives Stickers',
  email: 'contact@exclusives-stickers.com',
  phone: '+33 1 23 45 67 89',
  website: 'https://exclusives-stickers.com',
}

function formatCurrency(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`
}

export function generateOrderConfirmationEmail(data: EmailData): { subject: string; html: string } {
  const subject = `Confirmation de commande ${data.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .order-items { margin: 20px 0; }
    .item { padding: 10px; background: white; margin: 10px 0; border-left: 3px solid #3b82f6; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Commande confirmée !</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Merci pour votre commande ! Nous avons bien reçu votre paiement.</p>

      <p><strong>Numéro de commande :</strong> ${data.orderNumber}</p>
      <p><strong>Montant total :</strong> ${formatCurrency(data.totalCents)}</p>

      <div class="order-items">
        <h3>Vos produits :</h3>
        ${data.items.map(item => `
          <div class="item">
            <strong>${item.productName}</strong><br>
            Taille : ${item.size} - Quantité : ${item.quantity}
          </div>
        `).join('')}
      </div>

      <p>Nous allons préparer votre Bon À Tirer (BAT) et vous l'enverrons dans les plus brefs délais pour validation.</p>

      <a href="${COMPANY_INFO.website}/commandes/${data.orderNumber}" class="button">
        Suivre ma commande
      </a>
    </div>

    <div class="footer">
      <p>${COMPANY_INFO.name}<br>
      Email : ${COMPANY_INFO.email} | Tél : ${COMPANY_INFO.phone}</p>
    </div>
  </div>
</body>
</html>
`

  return { subject, html }
}

export function generateBATReadyEmail(data: EmailData): { subject: string; html: string } {
  const subject = `Votre BAT est prêt - Commande ${data.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Votre BAT est prêt !</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Votre Bon À Tirer (BAT) est prêt pour validation !</p>

      <p><strong>Commande :</strong> ${data.orderNumber}</p>

      <div class="warning">
        <strong>⚠️ Action requise</strong><br>
        Merci de valider votre BAT dans les 48h pour que nous puissions lancer la production de vos stickers.
      </div>

      <p>Vérifiez attentivement tous les détails (couleurs, textes, dimensions) avant de valider.</p>

      <a href="${COMPANY_INFO.website}/commandes/${data.orderNumber}/bat" class="button">
        Voir et valider mon BAT
      </a>
    </div>

    <div class="footer">
      <p>${COMPANY_INFO.name}<br>
      Email : ${COMPANY_INFO.email} | Tél : ${COMPANY_INFO.phone}</p>
    </div>
  </div>
</body>
</html>
`

  return { subject, html }
}

export function generateInProductionEmail(data: EmailData): { subject: string; html: string } {
  const subject = `Votre commande est en fabrication - ${data.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #8b5cf6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; padding: 12px 24px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏭 Fabrication en cours !</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Bonne nouvelle ! Votre commande est maintenant en cours de fabrication.</p>

      <p><strong>Commande :</strong> ${data.orderNumber}</p>

      <p>Nos équipes travaillent sur vos stickers personnalisés. Vous recevrez un nouvel email dès que la fabrication sera terminée et que votre colis sera prêt à être expédié.</p>

      <a href="${COMPANY_INFO.website}/commandes/${data.orderNumber}" class="button">
        Suivre ma commande
      </a>
    </div>

    <div class="footer">
      <p>${COMPANY_INFO.name}<br>
      Email : ${COMPANY_INFO.email} | Tél : ${COMPANY_INFO.phone}</p>
    </div>
  </div>
</body>
</html>
`

  return { subject, html }
}

export function generateShippedEmail(data: EmailData): { subject: string; html: string } {
  const subject = `Votre commande a été expédiée - ${data.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #ec4899; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; padding: 12px 24px; background-color: #ec4899; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .tracking { background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Votre colis est en route !</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Votre commande a été expédiée et est en chemin vers vous !</p>

      <p><strong>Commande :</strong> ${data.orderNumber}</p>

      ${data.trackingNumber ? `
        <div class="tracking">
          <strong>📍 Suivi de colis</strong><br>
          Numéro de suivi : <strong>${data.trackingNumber}</strong><br>
          ${data.trackingUrl ? `<a href="${data.trackingUrl}" target="_blank">Suivre mon colis</a>` : ''}
        </div>
      ` : ''}

      <p>Vous devriez recevoir votre colis dans les prochains jours.</p>

      <a href="${COMPANY_INFO.website}/commandes/${data.orderNumber}" class="button">
        Voir ma commande
      </a>
    </div>

    <div class="footer">
      <p>${COMPANY_INFO.name}<br>
      Email : ${COMPANY_INFO.email} | Tél : ${COMPANY_INFO.phone}</p>
    </div>
  </div>
</body>
</html>
`

  return { subject, html }
}

export function generateDeliveredEmail(data: EmailData): { subject: string; html: string } {
  const subject = `Votre commande a été livrée - ${data.orderNumber}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
    .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Commande livrée !</h1>
    </div>

    <div class="content">
      <h2>Bonjour ${data.customerName},</h2>
      <p>Votre commande a été livrée avec succès !</p>

      <p><strong>Commande :</strong> ${data.orderNumber}</p>

      <p>Nous espérons que vos stickers vous plaisent ! N'hésitez pas à partager vos créations avec nous sur les réseaux sociaux.</p>

      <p>Si vous avez la moindre question ou si vous n'êtes pas entièrement satisfait, contactez-nous dans les plus brefs délais.</p>

      <a href="${COMPANY_INFO.website}/avis" class="button">
        Laisser un avis
      </a>
    </div>

    <div class="footer">
      <p>Merci de votre confiance !<br>
      ${COMPANY_INFO.name}<br>
      Email : ${COMPANY_INFO.email} | Tél : ${COMPANY_INFO.phone}</p>
    </div>
  </div>
</body>
</html>
`

  return { subject, html }
}
