import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

const statuses = [
  'pending_payment',
  'paid_awaiting_bat',
  'in_production',
  'production_complete',
  'preparing_shipment',
  'in_delivery',
  'delivered',
]

const shippingMethods = ['Colissimo', 'Chronopost', 'Mondial Relay']
const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Nantes', 'Lille']

const customers = [
  { name: 'Alice Martin', email: 'alice.martin@example.com', company: 'Design Studio Paris' },
  { name: 'Bob Dubois', email: 'bob.dubois@example.com', company: 'GraphiK SARL' },
  { name: 'Charlie Bernard', email: 'charlie.bernard@example.com', company: 'Print Co' },
  { name: 'Diane Laurent', email: 'diane.laurent@example.com', company: 'Creative Agency' },
  { name: 'Eric Thomas', email: 'eric.thomas@example.com', company: 'Marketing Plus' },
  { name: 'Sophie Moreau', email: 'sophie.moreau@example.com', company: 'Comm&Co' },
  { name: 'Lucas Petit', email: 'lucas.petit@example.com', company: 'Event Solutions' },
  { name: 'Emma Rousseau', email: 'emma.rousseau@example.com', company: 'Branding Studio' },
]

async function seedOrdersWithProducts() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // Delete existing test orders first
    await db.collection('orders').deleteMany({})
    console.log('🗑️  Anciennes commandes supprimées')

    // Get all products
    const products = await db.collection('products').find({}).toArray()
    console.log(`📦 ${products.length} produits trouvés`)

    if (products.length === 0) {
      console.error('❌ Aucun produit trouvé. Veuillez d\'abord créer les produits.')
      return
    }

    console.log('\n📝 Création de 20 commandes de test avec produits réels...')

    const orders = []

    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length]
      const orderDate = new Date(Date.now() - Math.floor(Math.random() * 45) * 24 * 60 * 60 * 1000)

      // Select 1-3 random products for this order
      const numItems = Math.floor(Math.random() * 3) + 1
      const orderProducts = []
      const usedProducts = new Set()

      for (let j = 0; j < numItems; j++) {
        let product
        do {
          product = products[Math.floor(Math.random() * products.length)]
        } while (usedProducts.has(product._id.toString()))

        usedProducts.add(product._id.toString())

        // Get a random size from the product's available sizes
        const sizeOption = product.availableSizes[Math.floor(Math.random() * product.availableSizes.length)]
        const size = sizeOption.size

        // Get a random shape from the product's available shapes
        const shape = product.availableShapes[Math.floor(Math.random() * product.availableShapes.length)]

        // Generate quantity and pricing
        const quantity = [50, 100, 250, 500, 1000][Math.floor(Math.random() * 5)]
        const unitPrice = product.basePrice + Math.floor(Math.random() * 2000)
        const totalPrice = quantity * unitPrice

        orderProducts.push({
          productReference: product.reference,
          productName: product.title.fr,
          productId: product._id.toString(),
          size: size,
          supportShape: shape,
          quantity: quantity,
          unitPriceCents: unitPrice,
          totalPriceCents: totalPrice,
          batApproved: Math.random() > 0.3,
          batApprovedAt: Math.random() > 0.3 ? new Date(orderDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
        })
      }

      // Calculate totals
      const subtotal = orderProducts.reduce((sum, item) => sum + item.totalPriceCents, 0)
      const shipping = Math.random() > 0.5 ? 500 : 1000
      const tax = Math.floor(subtotal * 0.2)
      const total = subtotal + shipping + tax

      // Determine order status based on date
      const daysAgo = Math.floor((Date.now() - orderDate.getTime()) / (24 * 60 * 60 * 1000))
      let status
      if (daysAgo < 2) status = statuses[0] // pending_payment
      else if (daysAgo < 5) status = statuses[1] // paid_awaiting_bat
      else if (daysAgo < 10) status = statuses[2] // in_production
      else if (daysAgo < 15) status = statuses[3] // production_complete
      else if (daysAgo < 20) status = statuses[4] // preparing_shipment
      else if (daysAgo < 30) status = statuses[5] // in_delivery
      else status = statuses[6] // delivered

      const isPaid = status !== 'pending_payment'
      const paymentStatus = isPaid ? 'paid' : 'pending'

      const order = {
        orderNumber: `ORD-${Date.now() + i}-${Math.floor(Math.random() * 10000)}`,
        customerEmail: customer.email,
        customerName: customer.name,
        customerCompany: customer.company,
        countryCode: 'FR',
        status: status,
        statusHistory: [
          {
            status: 'pending_payment',
            changedAt: orderDate,
            changedBy: 'system',
            note: 'Commande créée',
          },
          ...(isPaid
            ? [
                {
                  status: status,
                  changedAt: new Date(orderDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000),
                  changedBy: 'admin',
                  note: 'Statut mis à jour',
                },
              ]
            : []),
        ],
        items: orderProducts,
        subtotalHT: subtotal,
        shippingCents: shipping,
        taxCents: tax,
        discountCents: 0,
        totalCents: total,
        shippingMethod: shippingMethods[Math.floor(Math.random() * shippingMethods.length)],
        shippingAddress: {
          firstName: customer.name.split(' ')[0],
          lastName: customer.name.split(' ')[1],
          company: customer.company,
          address1: `${Math.floor(Math.random() * 200) + 1} Rue ${['de la Paix', 'Victor Hugo', 'de Rivoli', 'Montmartre'][Math.floor(Math.random() * 4)]}`,
          city: cities[Math.floor(Math.random() * cities.length)],
          postalCode: `${75000 + Math.floor(Math.random() * 20000)}`,
          countryCode: 'FR',
          phone: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        },
        paymentMethod: 'stripe',
        paymentStatus: paymentStatus,
        paidAt: isPaid ? new Date(orderDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000) : null,
        paymentIntentId: isPaid ? `pi_${Math.random().toString(36).substring(7)}` : null,
        trackingNumber:
          status === 'in_delivery' || status === 'delivered'
            ? `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`
            : null,
        invoiceNumber: isPaid ? `INV-${Date.now() + i}` : null,
        synced: false,
        createdAt: orderDate,
        updatedAt: new Date(),
      }

      orders.push(order)
    }

    const result = await db.collection('orders').insertMany(orders)
    console.log(`✅ ${result.insertedCount} commandes créées avec produits réels`)

    // Summary statistics
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalCents, 0)
    const statusCounts = {}
    orders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    })

    console.log('\n📊 Statistiques:')
    console.log(`   💰 Revenu total: ${(totalRevenue / 100).toFixed(2)}€`)
    console.log(`   📦 Commandes par statut:`)
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`      - ${status}: ${count}`)
    })

    console.log('\n✅ Seed terminé avec succès!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

seedOrdersWithProducts()
