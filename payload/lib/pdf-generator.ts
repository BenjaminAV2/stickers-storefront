import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'
import { createElement as h } from 'react'

// Styles pour les PDFs
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  col: {
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000',
    color: '#fff',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    padding: 8,
  },
  tableCol: {
    flex: 1,
  },
  total: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderTop: '2px solid #000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1px solid #ddd',
    paddingTop: 10,
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
})

interface OrderData {
  orderNumber: string
  invoiceNumber?: string
  deliveryNoteNumber?: string
  paidAt?: Date | string
  createdAt: Date | string
  customerName: string
  customerEmail: string
  customerCompany?: string
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    postalCode: string
    countryCode: string
    phone: string
  }
  billingAddress?: {
    firstName?: string
    lastName?: string
    company?: string
    address1?: string
    city?: string
    postalCode?: string
    countryCode?: string
  }
  items: Array<{
    productReference: string
    productName: string
    size: string
    supportShape: string
    quantity: number
    unitPriceCents: number
    totalPriceCents: number
  }>
  subtotalHT: number
  shippingCents: number
  taxCents: number
  discountCents?: number
  totalCents: number
  shippingMethod: string
  paymentMethod: string
}

function formatCurrency(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const COMPANY_INFO = {
  name: 'Exclusives Stickers',
  address: 'Votre adresse complète',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  phone: '+33 1 23 45 67 89',
  email: 'contact@exclusives-stickers.com',
  siret: '123 456 789 00012',
  tva: 'FR 12 345 678 901',
}

export async function generateInvoicePDF(order: OrderData): Promise<Buffer> {
  const InvoiceDocument = h(Document, {},
    h(Page, { size: 'A4', style: styles.page },
      // Header
      h(View, { style: styles.header },
        h(Text, { style: styles.title }, 'FACTURE'),
        h(Text, { style: styles.subtitle }, `N° ${order.invoiceNumber || order.orderNumber}`),
        h(Text, { style: styles.subtitle }, `Date: ${formatDate(order.paidAt || order.createdAt)}`)
      ),

      // Company Info & Customer
      h(View, { style: { ...styles.section, flexDirection: 'row', justifyContent: 'space-between' } },
        h(View, { style: { flex: 1 } },
          h(Text, { style: { fontWeight: 'bold', marginBottom: 5 } }, COMPANY_INFO.name),
          h(Text, {}, COMPANY_INFO.address),
          h(Text, {}, `${COMPANY_INFO.postalCode} ${COMPANY_INFO.city}`),
          h(Text, {}, COMPANY_INFO.country),
          h(Text, {}, `Tel: ${COMPANY_INFO.phone}`),
          h(Text, {}, `Email: ${COMPANY_INFO.email}`),
          h(Text, {}, `SIRET: ${COMPANY_INFO.siret}`),
          h(Text, {}, `TVA: ${COMPANY_INFO.tva}`)
        ),
        h(View, { style: { flex: 1 } },
          h(Text, { style: { fontWeight: 'bold', marginBottom: 5 } }, 'Client:'),
          h(Text, {}, order.customerName),
          order.customerCompany && h(Text, {}, order.customerCompany),
          h(Text, {}, order.customerEmail),
          h(Text, { style: { marginTop: 10, fontWeight: 'bold' } }, 'Adresse de facturation:'),
          h(Text, {}, order.billingAddress?.firstName && order.billingAddress?.lastName
            ? `${order.billingAddress.firstName} ${order.billingAddress.lastName}`
            : `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`),
          order.billingAddress?.company && h(Text, {}, order.billingAddress.company),
          h(Text, {}, order.billingAddress?.address1 || order.shippingAddress.address1),
          h(Text, {}, `${order.billingAddress?.postalCode || order.shippingAddress.postalCode} ${order.billingAddress?.city || order.shippingAddress.city}`),
          h(Text, {}, order.billingAddress?.countryCode || order.shippingAddress.countryCode)
        )
      ),

      // Items Table
      h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'Détails de la commande'),
        h(View, { style: styles.table },
          // Table Header
          h(View, { style: styles.tableHeader },
            h(Text, { style: { ...styles.tableCol, flex: 2 } }, 'Produit'),
            h(Text, { style: styles.tableCol }, 'Taille'),
            h(Text, { style: styles.tableCol }, 'Forme'),
            h(Text, { style: styles.tableCol }, 'Quantité'),
            h(Text, { style: styles.tableCol }, 'Prix unit. HT'),
            h(Text, { style: styles.tableCol }, 'Total HT')
          ),
          // Table Rows
          ...order.items.map((item, index) =>
            h(View, { key: index, style: styles.tableRow },
              h(Text, { style: { ...styles.tableCol, flex: 2 } }, `${item.productReference} - ${item.productName}`),
              h(Text, { style: styles.tableCol }, item.size),
              h(Text, { style: styles.tableCol }, item.supportShape),
              h(Text, { style: styles.tableCol }, item.quantity.toString()),
              h(Text, { style: styles.tableCol }, formatCurrency(item.unitPriceCents)),
              h(Text, { style: styles.tableCol }, formatCurrency(item.totalPriceCents))
            )
          )
        )
      ),

      // Totals
      h(View, { style: styles.total },
        h(View, { style: styles.totalRow },
          h(Text, { style: styles.totalLabel }, 'Sous-total HT:'),
          h(Text, { style: styles.totalValue }, formatCurrency(order.subtotalHT))
        ),
        h(View, { style: styles.totalRow },
          h(Text, { style: styles.totalLabel }, 'Frais de livraison HT:'),
          h(Text, { style: styles.totalValue }, formatCurrency(order.shippingCents))
        ),
        order.discountCents && order.discountCents > 0 && h(View, { style: styles.totalRow },
          h(Text, { style: { ...styles.totalLabel, color: 'green' } }, 'Remise:'),
          h(Text, { style: { ...styles.totalValue, color: 'green' } }, `- ${formatCurrency(order.discountCents)}`)
        ),
        h(View, { style: styles.totalRow },
          h(Text, { style: styles.totalLabel }, 'TVA (20%):'),
          h(Text, { style: styles.totalValue }, formatCurrency(order.taxCents))
        ),
        h(View, { style: { ...styles.totalRow, borderTop: '2px solid #000', paddingTop: 10, marginTop: 10 } },
          h(Text, { style: { ...styles.totalLabel, fontSize: 14 } }, 'Total TTC:'),
          h(Text, { style: { ...styles.totalValue, fontSize: 14, fontWeight: 'bold' } }, formatCurrency(order.totalCents))
        )
      ),

      // Payment Info
      h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'Informations de paiement'),
        h(View, { style: styles.row },
          h(Text, { style: styles.label }, 'Mode de paiement:'),
          h(Text, {}, order.paymentMethod === 'stripe' ? 'Carte bancaire (Stripe)' : 'PayPal')
        ),
        order.paidAt && h(View, { style: styles.row },
          h(Text, { style: styles.label }, 'Date de paiement:'),
          h(Text, {}, formatDate(order.paidAt))
        ),
        h(View, { style: { marginTop: 10 } },
          h(Text, { style: { fontSize: 8, fontStyle: 'italic' } }, 'Facture acquittée - Paiement reçu')
        )
      ),

      // Footer
      h(View, { style: styles.footer },
        h(Text, {}, `${COMPANY_INFO.name} - ${COMPANY_INFO.address}, ${COMPANY_INFO.postalCode} ${COMPANY_INFO.city}`),
        h(Text, {}, `SIRET: ${COMPANY_INFO.siret} - TVA: ${COMPANY_INFO.tva}`),
        h(Text, {}, `Tel: ${COMPANY_INFO.phone} - Email: ${COMPANY_INFO.email}`)
      )
    )
  )

  const pdfBlob = await pdf(InvoiceDocument).toBlob()
  return Buffer.from(await pdfBlob.arrayBuffer())
}

export async function generateDeliveryNotePDF(order: OrderData): Promise<Buffer> {
  const DeliveryNoteDocument = h(Document, {},
    h(Page, { size: 'A4', style: styles.page },
      // Header
      h(View, { style: styles.header },
        h(Text, { style: styles.title }, 'BON DE LIVRAISON'),
        h(Text, { style: styles.subtitle }, `N° ${order.deliveryNoteNumber || order.orderNumber}`),
        h(Text, { style: styles.subtitle }, `Date: ${formatDate(order.createdAt)}`)
      ),

      // Company Info & Customer
      h(View, { style: { ...styles.section, flexDirection: 'row', justifyContent: 'space-between' } },
        h(View, { style: { flex: 1 } },
          h(Text, { style: { fontWeight: 'bold', marginBottom: 5 } }, COMPANY_INFO.name),
          h(Text, {}, COMPANY_INFO.address),
          h(Text, {}, `${COMPANY_INFO.postalCode} ${COMPANY_INFO.city}`),
          h(Text, {}, COMPANY_INFO.country)
        ),
        h(View, { style: { flex: 1 } },
          h(Text, { style: { fontWeight: 'bold', marginBottom: 5 } }, 'Adresse de livraison:'),
          h(Text, {}, `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`),
          order.shippingAddress.company && h(Text, {}, order.shippingAddress.company),
          h(Text, {}, order.shippingAddress.address1),
          order.shippingAddress.address2 && h(Text, {}, order.shippingAddress.address2),
          h(Text, {}, `${order.shippingAddress.postalCode} ${order.shippingAddress.city}`),
          h(Text, {}, order.shippingAddress.countryCode),
          h(Text, {}, `Tel: ${order.shippingAddress.phone}`)
        )
      ),

      // Shipping Method
      h(View, { style: styles.section },
        h(View, { style: styles.row },
          h(Text, { style: styles.label }, 'Mode de livraison:'),
          h(Text, {}, order.shippingMethod)
        ),
        h(View, { style: styles.row },
          h(Text, { style: styles.label }, 'Commande N°:'),
          h(Text, {}, order.orderNumber)
        )
      ),

      // Items Table
      h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'Produits à expédier'),
        h(View, { style: styles.table },
          // Table Header
          h(View, { style: styles.tableHeader },
            h(Text, { style: { ...styles.tableCol, flex: 3 } }, 'Produit'),
            h(Text, { style: styles.tableCol }, 'Taille'),
            h(Text, { style: styles.tableCol }, 'Forme'),
            h(Text, { style: styles.tableCol }, 'Quantité')
          ),
          // Table Rows
          ...order.items.map((item, index) =>
            h(View, { key: index, style: styles.tableRow },
              h(Text, { style: { ...styles.tableCol, flex: 3 } }, `${item.productReference} - ${item.productName}`),
              h(Text, { style: styles.tableCol }, item.size),
              h(Text, { style: styles.tableCol }, item.supportShape),
              h(Text, { style: styles.tableCol }, item.quantity.toString())
            )
          )
        )
      ),

      // Total Packages
      h(View, { style: { ...styles.section, marginTop: 20 } },
        h(Text, { style: styles.sectionTitle }, 'Récapitulatif'),
        h(View, { style: styles.row },
          h(Text, { style: styles.label }, 'Nombre total d\'articles:'),
          h(Text, {}, order.items.reduce((sum, item) => sum + item.quantity, 0).toString())
        ),
        h(View, { style: styles.row },
          h(Text, { style: styles.label }, 'Nombre de produits différents:'),
          h(Text, {}, order.items.length.toString())
        )
      ),

      // Signature
      h(View, { style: { marginTop: 40 } },
        h(Text, { style: { marginBottom: 40 } }, 'Signature du destinataire (pour réception):'),
        h(View, { style: { borderTop: '1px solid #000', width: 200, marginTop: 20 } })
      ),

      // Footer
      h(View, { style: styles.footer },
        h(Text, {}, `${COMPANY_INFO.name} - ${COMPANY_INFO.address}, ${COMPANY_INFO.postalCode} ${COMPANY_INFO.city}`),
        h(Text, {}, `Tel: ${COMPANY_INFO.phone} - Email: ${COMPANY_INFO.email}`)
      )
    )
  )

  const pdfBlob = await pdf(DeliveryNoteDocument).toBlob()
  return Buffer.from(await pdfBlob.arrayBuffer())
}

export async function savePDFToFile(buffer: Buffer, filename: string, mediaDir: string = '../media'): Promise<string> {
  const fs = await import('fs/promises')
  const path = await import('path')

  const uploadsDir = path.resolve(process.cwd(), mediaDir, 'documents')

  // Créer le dossier s'il n'existe pas
  await fs.mkdir(uploadsDir, { recursive: true })

  const filepath = path.join(uploadsDir, filename)
  await fs.writeFile(filepath, buffer)

  return `/media/documents/${filename}`
}
