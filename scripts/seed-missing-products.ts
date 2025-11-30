import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function seedMissingProducts() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    console.log('\n📦 Creating missing products...')

    const missingProducts = [
      // VINYLE BLANC - Rectangle
      {
        title: { fr: 'Sticker Vinyle Blanc Rectangle', en: 'Rectangle White Vinyl Sticker' },
        slug: 'sticker-vinyle-blanc-rectangle',
        reference: 'STK-VB-RE-006',
        shortDescription: {
          fr: 'Sticker blanc rectangulaire',
          en: 'Rectangular white sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rectangulaire en vinyle blanc. Idéal pour les étiquettes et messages.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Rectangular white vinyl sticker. Ideal for labels and messages.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-blanc' }],
        basePrice: 3200,
        availableSizes: [
          { size: '5x10', label: { fr: '5cm x 10cm', en: '5cm x 10cm' } },
          { size: '8x15', label: { fr: '8cm x 15cm', en: '8cm x 15cm' } },
          { size: '10x20', label: { fr: '10cm x 20cm', en: '10cm x 20cm' } },
        ],
        availableShapes: ['rectangle'],
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
      // VINYLE BLANC - Rond
      {
        title: { fr: 'Sticker Vinyle Blanc Rond', en: 'Round White Vinyl Sticker' },
        slug: 'sticker-vinyle-blanc-rond',
        reference: 'STK-VB-RO-007',
        shortDescription: {
          fr: 'Sticker blanc rond',
          en: 'Round white sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rond en vinyle blanc. Format classique et élégant.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Round white vinyl sticker. Classic and elegant format.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-blanc' }],
        basePrice: 3100,
        availableSizes: [
          { size: '5', label: { fr: 'Ø 5cm', en: 'Ø 5cm' } },
          { size: '8', label: { fr: 'Ø 8cm', en: 'Ø 8cm' } },
          { size: '10', label: { fr: 'Ø 10cm', en: 'Ø 10cm' } },
        ],
        availableShapes: ['round'],
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
      // VINYLE TRANSPARENT - Carré
      {
        title: { fr: 'Sticker Transparent Carré', en: 'Square Transparent Sticker' },
        slug: 'sticker-transparent-carre',
        reference: 'STK-TR-SQ-008',
        shortDescription: {
          fr: 'Sticker transparent carré',
          en: 'Square transparent sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker carré transparent pour un effet discret et moderne.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Square transparent sticker for a discreet and modern effect.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-transparent' }],
        basePrice: 3800,
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE TRANSPARENT - Rectangle
      {
        title: { fr: 'Sticker Transparent Rectangle', en: 'Rectangle Transparent Sticker' },
        slug: 'sticker-transparent-rectangle',
        reference: 'STK-TR-RE-009',
        shortDescription: {
          fr: 'Sticker transparent rectangulaire',
          en: 'Rectangular transparent sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rectangulaire transparent, parfait pour les étiquettes discrètes.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Rectangular transparent sticker, perfect for discreet labels.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-transparent' }],
        basePrice: 4100,
        availableSizes: [
          { size: '5x10', label: { fr: '5cm x 10cm', en: '5cm x 10cm' } },
          { size: '8x15', label: { fr: '8cm x 15cm', en: '8cm x 15cm' } },
          { size: '10x20', label: { fr: '10cm x 20cm', en: '10cm x 20cm' } },
        ],
        availableShapes: ['rectangle'],
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE TRANSPARENT - Rond
      {
        title: { fr: 'Sticker Transparent Rond', en: 'Round Transparent Sticker' },
        slug: 'sticker-transparent-rond',
        reference: 'STK-TR-RO-010',
        shortDescription: {
          fr: 'Sticker transparent rond',
          en: 'Round transparent sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rond transparent pour un rendu élégant et moderne.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Round transparent sticker for an elegant and modern finish.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-transparent' }],
        basePrice: 3900,
        availableSizes: [
          { size: '5', label: { fr: 'Ø 5cm', en: 'Ø 5cm' } },
          { size: '8', label: { fr: 'Ø 8cm', en: 'Ø 8cm' } },
          { size: '10', label: { fr: 'Ø 10cm', en: 'Ø 10cm' } },
        ],
        availableShapes: ['round'],
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE HOLOGRAPHIQUE - Carré
      {
        title: { fr: 'Sticker Holographique Carré', en: 'Square Holographic Sticker' },
        slug: 'sticker-holographique-carre',
        reference: 'STK-HO-SQ-011',
        shortDescription: {
          fr: 'Sticker holographique carré',
          en: 'Square holographic sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker carré holographique avec effet arc-en-ciel spectaculaire.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Square holographic sticker with spectacular rainbow effect.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-holographique' }],
        basePrice: 4800,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
          { size: '10x10', label: { fr: '10cm x 10cm', en: '10cm x 10cm' } },
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE HOLOGRAPHIQUE - Rectangle
      {
        title: { fr: 'Sticker Holographique Rectangle', en: 'Rectangle Holographic Sticker' },
        slug: 'sticker-holographique-rectangle',
        reference: 'STK-HO-RE-012',
        shortDescription: {
          fr: 'Sticker holographique rectangulaire',
          en: 'Rectangular holographic sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rectangulaire holographique pour un impact visuel maximum.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Rectangular holographic sticker for maximum visual impact.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-holographique' }],
        basePrice: 5200,
        availableSizes: [
          { size: '5x10', label: { fr: '5cm x 10cm', en: '5cm x 10cm' } },
          { size: '8x15', label: { fr: '8cm x 15cm', en: '8cm x 15cm' } },
          { size: '10x20', label: { fr: '10cm x 20cm', en: '10cm x 20cm' } },
        ],
        availableShapes: ['rectangle'],
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE HOLOGRAPHIQUE - Rond
      {
        title: { fr: 'Sticker Holographique Rond', en: 'Round Holographic Sticker' },
        slug: 'sticker-holographique-rond',
        reference: 'STK-HO-RO-013',
        shortDescription: {
          fr: 'Sticker holographique rond',
          en: 'Round holographic sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rond holographique avec effet arc-en-ciel brillant.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Round holographic sticker with bright rainbow effect.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-holographique' }],
        basePrice: 4900,
        availableSizes: [
          { size: '5', label: { fr: 'Ø 5cm', en: 'Ø 5cm' } },
          { size: '8', label: { fr: 'Ø 8cm', en: 'Ø 8cm' } },
          { size: '10', label: { fr: 'Ø 10cm', en: 'Ø 10cm' } },
        ],
        availableShapes: ['round'],
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE MIROIR - Carré
      {
        title: { fr: 'Sticker Miroir Carré', en: 'Square Mirror Sticker' },
        slug: 'sticker-miroir-carre',
        reference: 'STK-MI-SQ-014',
        shortDescription: {
          fr: 'Sticker miroir carré',
          en: 'Square mirror sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker carré effet miroir pour un rendu luxueux et élégant.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Square mirror sticker for a luxurious and elegant finish.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-miroir' }],
        basePrice: 5300,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
          { size: '10x10', label: { fr: '10cm x 10cm', en: '10cm x 10cm' } },
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE MIROIR - Rectangle
      {
        title: { fr: 'Sticker Miroir Rectangle', en: 'Rectangle Mirror Sticker' },
        slug: 'sticker-miroir-rectangle',
        reference: 'STK-MI-RE-015',
        shortDescription: {
          fr: 'Sticker miroir rectangulaire',
          en: 'Rectangular mirror sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rectangulaire effet miroir pour un impact visuel premium.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Rectangular mirror sticker for premium visual impact.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-miroir' }],
        basePrice: 5700,
        availableSizes: [
          { size: '5x10', label: { fr: '5cm x 10cm', en: '5cm x 10cm' } },
          { size: '8x15', label: { fr: '8cm x 15cm', en: '8cm x 15cm' } },
          { size: '10x20', label: { fr: '10cm x 20cm', en: '10cm x 20cm' } },
        ],
        availableShapes: ['rectangle'],
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE MIROIR - Rond
      {
        title: { fr: 'Sticker Miroir Rond', en: 'Round Mirror Sticker' },
        slug: 'sticker-miroir-rond',
        reference: 'STK-MI-RO-016',
        shortDescription: {
          fr: 'Sticker miroir rond',
          en: 'Round mirror sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker rond effet miroir pour un rendu métallique brillant.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Round mirror sticker for a bright metallic finish.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-miroir' }],
        basePrice: 5400,
        availableSizes: [
          { size: '5', label: { fr: 'Ø 5cm', en: 'Ø 5cm' } },
          { size: '8', label: { fr: 'Ø 8cm', en: 'Ø 8cm' } },
          { size: '10', label: { fr: 'Ø 10cm', en: 'Ø 10cm' } },
        ],
        availableShapes: ['round'],
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
        isFeatured: false,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection('products').insertMany(missingProducts)
    console.log(`✅ ${missingProducts.length} produits manquants créés`)

    const totalProducts = await db.collection('products').countDocuments()
    console.log(`\n📊 Total produits dans la base: ${totalProducts}`)
    console.log('\n✅ Seed des produits manquants terminé avec succès!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

seedMissingProducts()
