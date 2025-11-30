import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function seedSimpleProducts() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // Create categories first (simple, no relationships)
    console.log('\n📁 Creating categories...')
    const categories = [
      {
        name: { fr: 'Vinyle Blanc', en: 'White Vinyl' },
        slug: 'vinyle-blanc',
        description: {
          fr: [{ type: 'paragraph', children: [{ text: 'Stickers en vinyle blanc premium' }] }],
          en: [{ type: 'paragraph', children: [{ text: 'Premium white vinyl stickers' }] }],
        },
        isActive: true,
        order: 1,
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { fr: 'Vinyle Transparent', en: 'Transparent Vinyl' },
        slug: 'vinyle-transparent',
        description: {
          fr: [{ type: 'paragraph', children: [{ text: 'Stickers transparents élégants' }] }],
          en: [{ type: 'paragraph', children: [{ text: 'Elegant transparent stickers' }] }],
        },
        isActive: true,
        order: 2,
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { fr: 'Vinyle Holographique', en: 'Holographic Vinyl' },
        slug: 'vinyle-holographique',
        description: {
          fr: [{ type: 'paragraph', children: [{ text: 'Stickers holographiques avec effet arc-en-ciel' }] }],
          en: [{ type: 'paragraph', children: [{ text: 'Holographic stickers with rainbow effect' }] }],
        },
        isActive: true,
        order: 3,
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { fr: 'Vinyle Miroir', en: 'Mirror Vinyl' },
        slug: 'vinyle-miroir',
        description: {
          fr: [{ type: 'paragraph', children: [{ text: 'Stickers effet miroir métallique' }] }],
          en: [{ type: 'paragraph', children: [{ text: 'Metallic mirror effect stickers' }] }],
        },
        isActive: true,
        order: 4,
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection('categories').insertMany(categories)
    console.log(`✅ ${categories.length} categories created`)

    // Create products (avoiding relationship fields)
    console.log('\n📦 Creating products...')
    const products = [
      {
        title: { fr: 'Sticker Vinyle Blanc Cut Contour', en: 'White Vinyl Cut Contour Sticker' },
        slug: 'sticker-vinyle-blanc-cut-contour',
        reference: 'STK-VB-CC-001',
        shortDescription: {
          fr: 'Sticker blanc découpé à la forme',
          en: 'White cut-to-shape sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Sticker personnalisé en vinyle blanc découpé à la forme de votre design. Parfait pour logos et illustrations.',
                },
              ],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [
                {
                  text: 'Custom white vinyl sticker cut to match your design shape. Perfect for logos and illustrations.',
                },
              ],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-blanc' }],
        basePrice: 3500,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
          { size: '10x10', label: { fr: '10cm x 10cm', en: '10cm x 10cm' } },
        ],
        availableShapes: ['square'],
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle blanc premium' },
            { label: 'Finition', value: 'Brillante' },
            { label: 'Durabilité', value: '3-5 ans' },
          ],
          en: [
            { label: 'Material', value: 'Premium white vinyl' },
            { label: 'Finish', value: 'Glossy' },
            { label: 'Durability', value: '3-5 years' },
          ],
        },
        isActive: true,
        isFeatured: true,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Sticker Vinyle Blanc Carré', en: 'Square White Vinyl Sticker' },
        slug: 'sticker-vinyle-blanc-carre',
        reference: 'STK-VB-SQ-002',
        shortDescription: {
          fr: 'Sticker blanc carré classique',
          en: 'Classic square white sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker carré en vinyle blanc. Format parfait pour logos et messages courts.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Square white vinyl sticker. Perfect format for logos and short messages.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-blanc' }],
        basePrice: 3000,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
          { size: '10x10', label: { fr: '10cm x 10cm', en: '10cm x 10cm' } },
        ],
        availableShapes: ['square'],
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle blanc premium' },
            { label: 'Finition', value: 'Brillante' },
          ],
          en: [
            { label: 'Material', value: 'Premium white vinyl' },
            { label: 'Finish', value: 'Glossy' },
          ],
        },
        isActive: true,
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Sticker Transparent Cut Contour', en: 'Transparent Cut Contour Sticker' },
        slug: 'sticker-transparent-cut-contour',
        reference: 'STK-TR-CC-003',
        shortDescription: {
          fr: 'Sticker transparent découpé à la forme',
          en: 'Transparent cut-to-shape sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker transparent découpé à la forme, effet discret et élégant.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Transparent cut-to-shape sticker, discreet and elegant effect.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-transparent' }],
        basePrice: 4000,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
          { size: '10x10', label: { fr: '10cm x 10cm', en: '10cm x 10cm' } },
        ],
        availableShapes: ['square'],
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle transparent' },
            { label: 'Finition', value: 'Brillante' },
          ],
          en: [
            { label: 'Material', value: 'Transparent vinyl' },
            { label: 'Finish', value: 'Glossy' },
          ],
        },
        isActive: true,
        isFeatured: true,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Sticker Holographique Cut Contour', en: 'Holographic Cut Contour Sticker' },
        slug: 'sticker-holographique-cut-contour',
        reference: 'STK-HO-CC-004',
        shortDescription: {
          fr: 'Sticker holographique avec effet arc-en-ciel',
          en: 'Holographic sticker with rainbow effect',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker holographique découpé à la forme avec effet arc-en-ciel spectaculaire.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Cut-to-shape holographic sticker with spectacular rainbow effect.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-holographique' }],
        basePrice: 5000,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
        ],
        availableShapes: ['square'],
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle holographique' },
            { label: 'Finition', value: 'Effet arc-en-ciel' },
          ],
          en: [
            { label: 'Material', value: 'Holographic vinyl' },
            { label: 'Finish', value: 'Rainbow effect' },
          ],
        },
        isActive: true,
        isFeatured: true,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Sticker Miroir Cut Contour', en: 'Mirror Cut Contour Sticker' },
        slug: 'sticker-miroir-cut-contour',
        reference: 'STK-MI-CC-005',
        shortDescription: {
          fr: 'Sticker effet miroir métallique',
          en: 'Metallic mirror effect sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker effet miroir découpé à la forme pour un rendu métallique premium.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Cut-to-shape mirror effect sticker for a premium metallic finish.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-miroir' }],
        basePrice: 5500,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
        ],
        availableShapes: ['square'],
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle effet miroir' },
            { label: 'Finition', value: 'Métallique réfléchissante' },
          ],
          en: [
            { label: 'Material', value: 'Mirror effect vinyl' },
            { label: 'Finish', value: 'Reflective metallic' },
          ],
        },
        isActive: true,
        isFeatured: true,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection('products').insertMany(products)
    console.log(`✅ ${products.length} products created`)

    console.log('\n📊 Summary:')
    console.log(`   - Categories: ${categories.length}`)
    console.log(`   - Products: ${products.length}`)
    console.log('\n✅ Seed completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

seedSimpleProducts()
