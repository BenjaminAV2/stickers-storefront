import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

dotenv.config()

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/exclusives_stickers'

// Données de test réalistes
const firstNames = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Julie', 'Antoine', 'Emma', 'Nicolas', 'Laura', 'Thomas', 'Claire', 'Alexandre', 'Charlotte', 'Maxime', 'Camille', 'Julien', 'Léa', 'Mathieu', 'Sarah']
const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier']
const companies = ['', '', '', 'SARL Print Pro', 'SAS Sticker Plus', 'EURL Design Co', 'Auto-entrepreneur GraphiK', '', '', 'SCI CreaDeco', '', '', '']
const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne']
const streets = ['Avenue de la République', 'Rue Victor Hugo', 'Boulevard Saint-Michel', 'Place de la Mairie', 'Rue Jean Jaurès', 'Avenue des Champs-Élysées', 'Rue de la Paix', 'Boulevard Haussmann', 'Rue Lafayette', 'Avenue Foch']

const productSizes = ['5x5cm', '7x7cm', '10x10cm', '15x15cm', '20x20cm', '10x15cm', '15x20cm']
const shapes = ['square', 'round', 'oval', 'rectangle']
const shippingMethods = ['Colissimo Domicile', 'Chronopost Express', 'Mondial Relay', 'Colissimo Point Relais']
const paymentMethods = ['stripe', 'paypal']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePhone(): string {
  return `06${randomInt(10, 99)}${randomInt(10, 99)}${randomInt(10, 99)}${randomInt(10, 99)}`
}

function generatePostalCode(): string {
  return `${randomInt(10, 99)}${randomInt(100, 999)}`
}

function generateAddress() {
  return {
    firstName: randomItem(firstNames),
    lastName: randomItem(lastNames),
    company: randomItem(companies),
    address1: `${randomInt(1, 150)} ${randomItem(streets)}`,
    address2: Math.random() > 0.7 ? `Appartement ${randomInt(1, 50)}` : '',
    city: randomItem(cities),
    postalCode: generatePostalCode(),
    province: '',
    countryCode: 'FR',
    phone: generatePhone(),
  }
}

function generateOrderItems(count: number) {
  const items = []
  for (let i = 0; i < count; i++) {
    const size = randomItem(productSizes)
    const quantity = randomInt(50, 500)
    const unitPrice = randomInt(50, 500) // Prix en centimes
    items.push({
      productReference: `STK-${randomInt(100, 999)}`,
      productName: `Sticker personnalisé ${size}`,
      size,
      supportShape: randomItem(shapes),
      quantity,
      unitPriceCents: unitPrice,
      totalPriceCents: unitPrice * quantity,
      batApproved: Math.random() > 0.3,
      batApprovedAt: Math.random() > 0.3 ? new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000) : null,
    })
  }
  return items
}

function calculateOrderTotals(items: any[]) {
  const subtotalHT = items.reduce((sum, item) => sum + item.totalPriceCents, 0)
  const shippingCents = randomInt(500, 2000)
  const taxCents = Math.round((subtotalHT + shippingCents) * 0.2)
  const discountCents = Math.random() > 0.8 ? randomInt(500, 2000) : 0
  const totalCents = subtotalHT + shippingCents + taxCents - discountCents

  return { subtotalHT, shippingCents, taxCents, discountCents, totalCents }
}

async function seedTestData() {
  console.log('🌱 Début du seed des données de test...')

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB')

    const db = client.db()

    // Nettoyer les collections de test (optionnel)
    console.log('🧹 Nettoyage des anciennes données de test...')
    await db.collection('customers').deleteMany({ email: { $regex: /^test/ } })
    await db.collection('orders').deleteMany({ customerEmail: { $regex: /^test/ } })

    // Créer 20 customers avec commandes
    console.log('👥 Création de 20 clients de test...')

    for (let i = 1; i <= 20; i++) {
      const firstName = randomItem(firstNames)
      const lastName = randomItem(lastNames)
      const email = `test${i}@example.com`
      const company = randomItem(companies)

      // Créer le customer
      const customer = {
        email,
        firstName,
        lastName,
        company,
        phone: generatePhone(),
        addresses: [
          {
            ...generateAddress(),
            label: 'Domicile',
            isDefault: true,
            isBillingDefault: true,
          }
        ],
        orderCount: 0,
        totalSpent: 0,
        createdAt: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      }

      const customerResult = await db.collection('customers').insertOne(customer)
      const customerId = customerResult.insertedId

      console.log(`  ✓ Client créé: ${email}`)

      // Créer 1 à 5 commandes par customer
      const orderCount = randomInt(1, 5)
      let totalSpent = 0
      let lastOrderDate = new Date(0)

      for (let j = 0; j < orderCount; j++) {
        const orderDate = new Date(Date.now() - randomInt(1, 180) * 24 * 60 * 60 * 1000)
        const paidAt = new Date(orderDate.getTime() + randomInt(1, 60) * 60 * 1000)

        const items = generateOrderItems(randomInt(1, 3))
        const totals = calculateOrderTotals(items)

        const shippingAddress = generateAddress()
        const billingAddress = Math.random() > 0.7 ? generateAddress() : null

        const orderStatuses = [
          'paid_awaiting_bat',
          'in_production',
          'production_complete',
          'preparing_shipment',
          'in_delivery',
          'delivered',
        ]

        const status = randomItem(orderStatuses)
        const paymentMethod = randomItem(paymentMethods)

        const order = {
          orderNumber: `ORD-${Date.now()}-${randomInt(1000, 9999)}`,
          customer: customerId,
          customerEmail: email,
          customerName: `${firstName} ${lastName}`,
          customerCompany: company,
          countryCode: 'FR',
          status,
          statusHistory: [
            {
              status: 'pending_payment',
              changedAt: orderDate,
              changedBy: 'system',
              note: 'Commande créée',
            },
            {
              status: 'paid_awaiting_bat',
              changedAt: paidAt,
              changedBy: 'system',
              note: 'Paiement confirmé',
            },
          ],
          items,
          subtotalHT: totals.subtotalHT,
          shippingCents: totals.shippingCents,
          taxCents: totals.taxCents,
          discountCents: totals.discountCents,
          totalCents: totals.totalCents,
          shippingMethod: randomItem(shippingMethods),
          shippingAddress,
          billingAddress,
          relayPoint: shippingAddress.city.includes('Paris') && Math.random() > 0.5 ? {
            id: `RP-${randomInt(1000, 9999)}`,
            name: 'Relay Point Paris',
            address: shippingAddress.address1,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
          } : null,
          trackingNumber: Math.random() > 0.5 ? `FR${randomInt(1000000000, 9999999999)}` : null,
          trackingUrl: Math.random() > 0.5 ? `https://www.laposte.fr/outils/suivre-vos-envois?code=FR${randomInt(1000000000, 9999999999)}` : null,
          paymentMethod,
          paymentStatus: 'paid',
          paidAt,
          paymentIntentId: `pi_${randomInt(100000000000000, 999999999999999)}`,
          refund: {
            isRefunded: false,
          },
          invoiceNumber: `INV-${new Date().getFullYear()}-${String(i * orderCount + j).padStart(5, '0')}`,
          invoiceUrl: null,
          deliveryNoteNumber: `BL-${new Date().getFullYear()}-${String(i * orderCount + j).padStart(5, '0')}`,
          deliveryNoteUrl: null,
          internalNotes: Math.random() > 0.7 ? 'Client fidèle - Attention particulière' : '',
          customerNotes: Math.random() > 0.8 ? 'Merci de livrer avant 18h si possible' : '',
          synced: false,
          createdAt: orderDate,
          updatedAt: new Date(),
        }

        await db.collection('orders').insertOne(order)

        totalSpent += totals.totalCents
        if (orderDate > lastOrderDate) {
          lastOrderDate = orderDate
        }
      }

      // Mettre à jour les stats du customer
      await db.collection('customers').updateOne(
        { _id: customerId },
        {
          $set: {
            orderCount,
            totalSpent,
            lastOrderDate,
          }
        }
      )

      console.log(`    → ${orderCount} commande(s) créée(s) - Total: ${(totalSpent / 100).toFixed(2)}€`)
    }

    // Afficher les statistiques
    const customerCount = await db.collection('customers').countDocuments({ email: { $regex: /^test/ } })
    const orderCount = await db.collection('orders').countDocuments({ customerEmail: { $regex: /^test/ } })
    const totalRevenue = await db.collection('orders').aggregate([
      { $match: { customerEmail: { $regex: /^test/ } } },
      { $group: { _id: null, total: { $sum: '$totalCents' } } }
    ]).toArray()

    console.log('\n📊 Statistiques:')
    console.log(`  • Clients créés: ${customerCount}`)
    console.log(`  • Commandes créées: ${orderCount}`)
    console.log(`  • CA total: ${((totalRevenue[0]?.total || 0) / 100).toFixed(2)}€`)
    console.log(`  • Panier moyen: ${((totalRevenue[0]?.total || 0) / orderCount / 100).toFixed(2)}€`)

    console.log('\n✅ Seed terminé avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error)
    throw error
  } finally {
    await client.close()
  }
}

seedTestData()
