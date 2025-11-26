import jsPDF from 'jspdf'

interface DeliveryNoteData {
  deliveryNoteNumber: string
  orderNumber: string
  date: string
  customer: {
    name: string
    company?: string
    address: {
      address1: string
      address2?: string
      city: string
      postalCode: string
      countryCode: string
    }
  }
  shippingMethod: string
  trackingNumber?: string
  relayPoint?: {
    name: string
    address: string
    city: string
    postalCode: string
  }
  items: Array<{
    productReference: string
    productName: string
    size: string
    supportShape: string
    quantity: number
  }>
  companyInfo: {
    name: string
    address: string
    siret: string
    email: string
    phone: string
  }
}

export function generateDeliveryNotePDF(data: DeliveryNoteData): jsPDF {
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
  doc.text(`${data.companyInfo.email} | ${data.companyInfo.phone}`, 20, yPos)

  // Delivery Note Title
  yPos = 20
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(91, 64, 215) // Purple
  doc.text('BON DE LIVRAISON', pageWidth - 20, yPos, { align: 'right' })
  yPos += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text(`N° ${data.deliveryNoteNumber}`, pageWidth - 20, yPos, { align: 'right' })
  yPos += 6
  doc.text(`Date: ${new Date(data.date).toLocaleDateString('fr-FR')}`, pageWidth - 20, yPos, {
    align: 'right',
  })
  yPos += 6
  doc.text(`Commande: ${data.orderNumber}`, pageWidth - 20, yPos, { align: 'right' })

  // Shipping Info
  yPos = 70
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Adresse de livraison:', 20, yPos)
  yPos += 7

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(data.customer.name, 20, yPos)
  yPos += 5
  if (data.customer.company) {
    doc.text(data.customer.company, 20, yPos)
    yPos += 5
  }

  if (data.relayPoint) {
    doc.setFont('helvetica', 'bold')
    doc.text('Point relais:', 20, yPos)
    yPos += 5
    doc.setFont('helvetica', 'normal')
    doc.text(data.relayPoint.name, 20, yPos)
    yPos += 5
    doc.text(data.relayPoint.address, 20, yPos)
    yPos += 5
    doc.text(`${data.relayPoint.postalCode} ${data.relayPoint.city}`, 20, yPos)
    yPos += 5
  } else {
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
  }

  // Shipping Method
  yPos += 5
  doc.setFont('helvetica', 'bold')
  doc.text(`Mode de livraison: `, 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(data.shippingMethod, 65, yPos)

  if (data.trackingNumber) {
    yPos += 5
    doc.setFont('helvetica', 'bold')
    doc.text(`N° de suivi: `, 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(data.trackingNumber, 50, yPos)
  }

  // Items Table
  yPos = 140
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(91, 64, 215)
  doc.setTextColor(255, 255, 255)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')

  doc.text('Réf', 25, yPos + 5)
  doc.text('Produit', 50, yPos + 5)
  doc.text('Taille', 115, yPos + 5)
  doc.text('Support', 140, yPos + 5)
  doc.text('Quantité', pageWidth - 25, yPos + 5, { align: 'right' })

  yPos += 10
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')

  data.items.forEach((item) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }

    doc.text(item.productReference.substring(0, 8), 25, yPos)
    doc.text(item.productName.substring(0, 30), 50, yPos)
    doc.text(item.size, 115, yPos)
    doc.text(item.supportShape, 140, yPos)
    doc.text(item.quantity.toString(), pageWidth - 25, yPos, { align: 'right' })

    yPos += 7
  })

  // Signature Section
  yPos += 20
  doc.setFont('helvetica', 'bold')
  doc.text('Signature du destinataire:', 20, yPos)
  yPos += 5
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.text('(précédée de "Bon pour accord")', 20, yPos)

  // Signature Box
  yPos += 10
  doc.rect(20, yPos, 80, 40)
  doc.setFontSize(8)
  doc.text('Date et signature', 25, yPos + 35)

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(128, 128, 128)
  doc.text(
    'Document non contractuel - Conservez ce bon de livraison',
    pageWidth / 2,
    yPos,
    { align: 'center' },
  )

  return doc
}

export function downloadDeliveryNotePDF(data: DeliveryNoteData) {
  const doc = generateDeliveryNotePDF(data)
  doc.save(`bon-livraison-${data.deliveryNoteNumber}.pdf`)
}

export function getDeliveryNotePDFBlob(data: DeliveryNoteData): Blob {
  const doc = generateDeliveryNotePDF(data)
  return doc.output('blob')
}
