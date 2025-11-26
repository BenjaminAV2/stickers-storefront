import jsPDF from 'jspdf'

interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  date: string
  customer: {
    name: string
    company?: string
    email: string
    address: {
      address1: string
      address2?: string
      city: string
      postalCode: string
      countryCode: string
    }
  }
  items: Array<{
    productReference: string
    productName: string
    size: string
    quantity: number
    unitPriceCents: number
    totalPriceCents: number
  }>
  subtotalHT: number
  taxCents: number
  shippingCents: number
  totalCents: number
  companyInfo: {
    name: string
    address: string
    siret: string
    tva: string
    email: string
    phone: string
  }
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPos = 20

  // Header - Company Info
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(data.companyInfo.name, 20, yPos)
  yPos += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.companyInfo.address, 20, yPos)
  yPos += 5
  doc.text(`SIRET: ${data.companyInfo.siret}`, 20, yPos)
  yPos += 5
  doc.text(`TVA: ${data.companyInfo.tva}`, 20, yPos)
  yPos += 5
  doc.text(`${data.companyInfo.email} | ${data.companyInfo.phone}`, 20, yPos)

  // Invoice Title
  yPos = 20
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(91, 64, 215) // Purple
  doc.text('FACTURE', pageWidth - 20, yPos, { align: 'right' })
  yPos += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text(`N° ${data.invoiceNumber}`, pageWidth - 20, yPos, { align: 'right' })
  yPos += 6
  doc.text(`Date: ${new Date(data.date).toLocaleDateString('fr-FR')}`, pageWidth - 20, yPos, {
    align: 'right',
  })
  yPos += 6
  doc.text(`Commande: ${data.orderNumber}`, pageWidth - 20, yPos, { align: 'right' })

  // Customer Info
  yPos = 70
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Facturé à:', 20, yPos)
  yPos += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customer.name, 20, yPos)
  yPos += 5
  if (data.customer.company) {
    doc.text(data.customer.company, 20, yPos)
    yPos += 5
  }
  doc.text(data.customer.address.address1, 20, yPos)
  yPos += 5
  if (data.customer.address.address2) {
    doc.text(data.customer.address.address2, 20, yPos)
    yPos += 5
  }
  doc.text(
    `${data.customer.address.postalCode} ${data.customer.address.city}`,
    20,
    yPos,
  )
  yPos += 5
  doc.text(data.customer.address.countryCode, 20, yPos)
  yPos += 5
  doc.text(data.customer.email, 20, yPos)

  // Items Table
  yPos = 120
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(91, 64, 215)
  doc.setTextColor(255, 255, 255)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')

  doc.text('Réf', 25, yPos + 5)
  doc.text('Produit', 45, yPos + 5)
  doc.text('Taille', 110, yPos + 5)
  doc.text('Qté', 135, yPos + 5)
  doc.text('Prix Unit. HT', 150, yPos + 5)
  doc.text('Total HT', pageWidth - 25, yPos + 5, { align: 'right' })

  yPos += 10
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')

  data.items.forEach((item) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }

    doc.text(item.productReference.substring(0, 8), 25, yPos)
    doc.text(item.productName.substring(0, 30), 45, yPos)
    doc.text(item.size, 110, yPos)
    doc.text(item.quantity.toString(), 135, yPos)
    doc.text(`${(item.unitPriceCents / 100).toFixed(2)} €`, 150, yPos)
    doc.text(`${(item.totalPriceCents / 100).toFixed(2)} €`, pageWidth - 25, yPos, {
      align: 'right',
    })

    yPos += 7
  })

  // Totals
  yPos += 10
  doc.setFont('helvetica', 'normal')

  doc.text('Sous-total HT:', pageWidth - 70, yPos)
  doc.text(`${(data.subtotalHT / 100).toFixed(2)} €`, pageWidth - 25, yPos, {
    align: 'right',
  })
  yPos += 7

  if (data.shippingCents > 0) {
    doc.text('Frais de port:', pageWidth - 70, yPos)
    doc.text(`${(data.shippingCents / 100).toFixed(2)} €`, pageWidth - 25, yPos, {
      align: 'right',
    })
    yPos += 7
  }

  doc.text('TVA (20%):', pageWidth - 70, yPos)
  doc.text(`${(data.taxCents / 100).toFixed(2)} €`, pageWidth - 25, yPos, {
    align: 'right',
  })
  yPos += 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Total TTC:', pageWidth - 70, yPos)
  doc.text(`${(data.totalCents / 100).toFixed(2)} €`, pageWidth - 25, yPos, {
    align: 'right',
  })

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 30
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  doc.text(
    'TVA non applicable - article 293B du CGI',
    pageWidth / 2,
    yPos,
    { align: 'center' },
  )
  yPos += 4
  doc.text(
    `En cas de retard de paiement, une pénalité égale à 3 fois le taux d'intérêt légal sera appliquée`,
    pageWidth / 2,
    yPos,
    { align: 'center' },
  )

  return doc
}

export function downloadInvoicePDF(data: InvoiceData) {
  const doc = generateInvoicePDF(data)
  doc.save(`facture-${data.invoiceNumber}.pdf`)
}

export function getInvoicePDFBlob(data: InvoiceData): Blob {
  const doc = generateInvoicePDF(data)
  return doc.output('blob')
}
