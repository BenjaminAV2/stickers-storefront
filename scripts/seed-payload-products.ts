import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

// Based on frontend filters: Vinyle Blanc, Transparent, Holographique, Miroir
// And shapes: Cut Contour, Carré, Rectangle, Rond
async function seedPayloadProducts() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // ========================================
    // 1. CREATE CATEGORIES
    // ========================================
    console.log('\n📁 Creating categories...')

    const categories = [
      {
        name: {
          fr: 'Vinyle Blanc',
          en: 'White Vinyl',
        },
        slug: 'vinyle-blanc',
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Stickers en vinyle blanc classique, parfaits pour tous types de surfaces.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Classic white vinyl stickers, perfect for all types of surfaces.' }],
            },
          ],
        },
        isActive: true,
        order: 1,
        productsCount: 0,
        seoTitle: {
          fr: 'Stickers Vinyle Blanc Personnalisés',
          en: 'Custom White Vinyl Stickers',
        },
        seoDescription: {
          fr: 'Découvrez nos stickers en vinyle blanc de qualité professionnelle. Personnalisables et résistants.',
          en: 'Discover our professional quality white vinyl stickers. Customizable and durable.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: {
          fr: 'Vinyle Transparent',
          en: 'Transparent Vinyl',
        },
        slug: 'vinyle-transparent',
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Stickers transparents élégants, idéals pour un effet discret et moderne.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Elegant transparent stickers, ideal for a discreet and modern effect.' }],
            },
          ],
        },
        isActive: true,
        order: 2,
        productsCount: 0,
        seoTitle: {
          fr: 'Stickers Vinyle Transparent',
          en: 'Transparent Vinyl Stickers',
        },
        seoDescription: {
          fr: 'Stickers transparents de qualité premium pour un rendu professionnel.',
          en: 'Premium quality transparent stickers for a professional finish.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: {
          fr: 'Vinyle Holographique',
          en: 'Holographic Vinyl',
        },
        slug: 'vinyle-holographique',
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Stickers holographiques brillants avec effet arc-en-ciel pour un impact visuel maximal.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Shiny holographic stickers with rainbow effect for maximum visual impact.' }],
            },
          ],
        },
        isActive: true,
        order: 3,
        productsCount: 0,
        seoTitle: {
          fr: 'Stickers Holographiques Premium',
          en: 'Premium Holographic Stickers',
        },
        seoDescription: {
          fr: 'Effet holographique spectaculaire pour des stickers qui attirent le regard.',
          en: 'Spectacular holographic effect for eye-catching stickers.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: {
          fr: 'Vinyle Miroir',
          en: 'Mirror Vinyl',
        },
        slug: 'vinyle-miroir',
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Stickers effet miroir métallique pour un rendu luxueux et unique.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Metallic mirror effect stickers for a luxurious and unique finish.' }],
            },
          ],
        },
        isActive: true,
        order: 4,
        productsCount: 0,
        seoTitle: {
          fr: 'Stickers Effet Miroir',
          en: 'Mirror Effect Stickers',
        },
        seoDescription: {
          fr: 'Stickers vinyle miroir pour un effet métallique brillant et élégant.',
          en: 'Mirror vinyl stickers for a bright and elegant metallic effect.',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const categoryResult = await db.collection('categories').insertMany(categories)
    console.log(`✅ ${categoryResult.insertedCount} categories created`)

    // Get the inserted category IDs
    const insertedCategories = await db.collection('categories').find({}).toArray()
    const categoryMap = new Map(insertedCategories.map((cat) => [cat.slug, cat._id.toString()]))

    // ========================================
    // 2. CREATE PRODUCTS
    // ========================================
    console.log('\n📦 Creating products...')

    // Helper function to create pricing matrix
    const createPricingMatrix = () => ({
      sizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
      quantities: [50, 100, 250, 500, 1000, 2000],
      prices: {
        '5x5': {
          50: 3500, 100: 5000, 250: 11000, 500: 20000, 1000: 38000, 2000: 72000,
        },
        '8x8': {
          50: 4500, 100: 7000, 250: 16000, 500: 30000, 1000: 56000, 2000: 105000,
        },
        '10x10': {
          50: 5500, 100: 9000, 250: 21000, 500: 40000, 1000: 75000, 2000: 140000,
        },
        '15x15': {
          50: 8000, 100: 14000, 250: 33000, 500: 63000, 1000: 120000, 2000: 225000,
        },
        '20x20': {
          50: 11000, 100: 19000, 250: 45000, 500: 86000, 1000: 165000, 2000: 310000,
        },
      },
    })

    const products = [
      // VINYLE BLANC - Cut Contour
      {
        title: {
          fr: 'Sticker Vinyle Blanc Cut Contour',
          en: 'White Vinyl Cut Contour Sticker',
        },
        slug: 'sticker-vinyle-blanc-cut-contour',
        reference: 'STK-VB-CC-001',
        shortDescription: {
          fr: 'Sticker personnalisé découpé à la forme de votre design',
          en: 'Custom cut-to-shape sticker',
        },
        description: {
          fr: [
            {
              type: 'paragraph',
              children: [{ text: 'Sticker personnalisé en vinyle blanc découpé à la forme de votre design. Parfait pour logos et illustrations complexes.' }],
            },
          ],
          en: [
            {
              type: 'paragraph',
              children: [{ text: 'Custom white vinyl sticker cut to match your design shape. Perfect for logos and complex illustrations.' }],
            },
          ],
        },
        categorySlugs: [{ slug: 'vinyle-blanc' }],
        basePrice: 3500,
        availableSizes: [
          { size: '5x5', label: { fr: '5cm x 5cm', en: '5cm x 5cm' } },
          { size: '8x8', label: { fr: '8cm x 8cm', en: '8cm x 8cm' } },
          { size: '10x10', label: { fr: '10cm x 10cm', en: '10cm x 10cm' } },
          { size: '15x15', label: { fr: '15cm x 15cm', en: '15cm x 15cm' } },
          { size: '20x20', label: { fr: '20cm x 20cm', en: '20cm x 20cm' } },
        ],
        availableShapes: ['square'],
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle blanc premium' },
            { label: 'Finition', value: 'Brillante' },
            { label: 'Durabilité extérieure', value: '3-5 ans' },
            { label: 'Résistance UV', value: 'Excellente' },
            { label: 'Application', value: 'Intérieur/Extérieur' },
          ],
          en: [
            { label: 'Material', value: 'Premium white vinyl' },
            { label: 'Finish', value: 'Glossy' },
            { label: 'Outdoor durability', value: '3-5 years' },
            { label: 'UV resistance', value: 'Excellent' },
            { label: 'Application', value: 'Indoor/Outdoor' },
          ],
        },
        isActive: true,
        isFeatured: true,
        stock: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE BLANC - Carré
      {
        title: {
          fr: 'Sticker Vinyle Blanc Carré',
          en: 'Square White Vinyl Sticker',
        },
        slug: 'sticker-vinyle-blanc-carre',
        description: {
          fr: 'Sticker carré en vinyle blanc classique. Format parfait pour logos et messages courts.',
          en: 'Classic square white vinyl sticker. Perfect format for logos and short messages.',
        },
        category: [categoryMap.get('vinyle-blanc')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle blanc premium' },
            { name: 'Finition', value: 'Brillante' },
            { name: 'Durabilité extérieure', value: '3-5 ans' },
            { name: 'Résistance UV', value: 'Excellente' },
          ],
          en: [
            { name: 'Material', value: 'Premium white vinyl' },
            { name: 'Finish', value: 'Glossy' },
            { name: 'Outdoor durability', value: '3-5 years' },
            { name: 'UV resistance', value: 'Excellent' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['square'],
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE TRANSPARENT - Cut Contour
      {
        title: {
          fr: 'Sticker Vinyle Transparent Cut Contour',
          en: 'Transparent Vinyl Cut Contour Sticker',
        },
        slug: 'sticker-vinyle-transparent-cut-contour',
        description: {
          fr: 'Sticker transparent découpé à la forme, effet discret et élégant sur toute surface.',
          en: 'Transparent cut-to-shape sticker, discreet and elegant effect on any surface.',
        },
        category: [categoryMap.get('vinyle-transparent')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle transparent' },
            { name: 'Finition', value: 'Brillante' },
            { name: 'Durabilité extérieure', value: '3-5 ans' },
            { name: 'Effet', value: 'Invisible sur fond clair' },
          ],
          en: [
            { name: 'Material', value: 'Transparent vinyl' },
            { name: 'Finish', value: 'Glossy' },
            { name: 'Outdoor durability', value: '3-5 years' },
            { name: 'Effect', value: 'Invisible on light background' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['cut-contour'],
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE TRANSPARENT - Rond
      {
        title: {
          fr: 'Sticker Vinyle Transparent Rond',
          en: 'Round Transparent Vinyl Sticker',
        },
        slug: 'sticker-vinyle-transparent-rond',
        description: {
          fr: 'Sticker rond transparent pour un rendu élégant et moderne.',
          en: 'Round transparent sticker for an elegant and modern finish.',
        },
        category: [categoryMap.get('vinyle-transparent')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle transparent' },
            { name: 'Finition', value: 'Brillante' },
            { name: 'Durabilité extérieure', value: '3-5 ans' },
          ],
          en: [
            { name: 'Material', value: 'Transparent vinyl' },
            { name: 'Finish', value: 'Glossy' },
            { name: 'Outdoor durability', value: '3-5 years' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['round'],
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE HOLOGRAPHIQUE - Cut Contour
      {
        title: {
          fr: 'Sticker Holographique Cut Contour',
          en: 'Holographic Cut Contour Sticker',
        },
        slug: 'sticker-holographique-cut-contour',
        description: {
          fr: 'Sticker holographique découpé à la forme avec effet arc-en-ciel spectaculaire.',
          en: 'Cut-to-shape holographic sticker with spectacular rainbow effect.',
        },
        category: [categoryMap.get('vinyle-holographique')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle holographique' },
            { name: 'Finition', value: 'Effet arc-en-ciel' },
            { name: 'Durabilité extérieure', value: '2-3 ans' },
            { name: 'Effet spécial', value: 'Reflets multicolores' },
          ],
          en: [
            { name: 'Material', value: 'Holographic vinyl' },
            { name: 'Finish', value: 'Rainbow effect' },
            { name: 'Outdoor durability', value: '2-3 years' },
            { name: 'Special effect', value: 'Multicolor reflections' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['cut-contour'],
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE HOLOGRAPHIQUE - Rectangle
      {
        title: {
          fr: 'Sticker Holographique Rectangle',
          en: 'Rectangle Holographic Sticker',
        },
        slug: 'sticker-holographique-rectangle',
        description: {
          fr: 'Sticker rectangulaire holographique pour un impact visuel maximum.',
          en: 'Rectangular holographic sticker for maximum visual impact.',
        },
        category: [categoryMap.get('vinyle-holographique')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle holographique' },
            { name: 'Finition', value: 'Effet arc-en-ciel' },
            { name: 'Durabilité extérieure', value: '2-3 ans' },
          ],
          en: [
            { name: 'Material', value: 'Holographic vinyl' },
            { name: 'Finish', value: 'Rainbow effect' },
            { name: 'Outdoor durability', value: '2-3 years' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['rectangle'],
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE MIROIR - Cut Contour
      {
        title: {
          fr: 'Sticker Miroir Cut Contour',
          en: 'Mirror Cut Contour Sticker',
        },
        slug: 'sticker-miroir-cut-contour',
        description: {
          fr: 'Sticker effet miroir découpé à la forme pour un rendu métallique premium.',
          en: 'Cut-to-shape mirror effect sticker for a premium metallic finish.',
        },
        category: [categoryMap.get('vinyle-miroir')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle effet miroir' },
            { name: 'Finition', value: 'Métallique réfléchissante' },
            { name: 'Durabilité extérieure', value: '2-3 ans' },
            { name: 'Effet spécial', value: 'Reflet miroir' },
          ],
          en: [
            { name: 'Material', value: 'Mirror effect vinyl' },
            { name: 'Finish', value: 'Reflective metallic' },
            { name: 'Outdoor durability', value: '2-3 years' },
            { name: 'Special effect', value: 'Mirror reflection' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['cut-contour'],
        isActive: true,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // VINYLE MIROIR - Carré
      {
        title: {
          fr: 'Sticker Miroir Carré',
          en: 'Square Mirror Sticker',
        },
        slug: 'sticker-miroir-carre',
        description: {
          fr: 'Sticker carré effet miroir pour un rendu luxueux et élégant.',
          en: 'Square mirror sticker for a luxurious and elegant finish.',
        },
        category: [categoryMap.get('vinyle-miroir')],
        status: 'published',
        pricingMatrix: createPricingMatrix(),
        specifications: {
          fr: [
            { name: 'Matériau', value: 'Vinyle effet miroir' },
            { name: 'Finition', value: 'Métallique réfléchissante' },
            { name: 'Durabilité extérieure', value: '2-3 ans' },
          ],
          en: [
            { name: 'Material', value: 'Mirror effect vinyl' },
            { name: 'Finish', value: 'Reflective metallic' },
            { name: 'Outdoor durability', value: '2-3 years' },
          ],
        },
        availableSizes: ['5x5', '8x8', '10x10', '15x15', '20x20'],
        availableShapes: ['square'],
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const productResult = await db.collection('products').insertMany(products)
    console.log(`✅ ${productResult.insertedCount} products created`)

    // Update category product counts
    for (const category of insertedCategories) {
      const count = await db
        .collection('products')
        .countDocuments({ category: category._id.toString() })

      await db
        .collection('categories')
        .updateOne({ _id: category._id }, { $set: { productsCount: count } })
    }

    console.log('\n📊 Summary:')
    console.log(`   - Categories: ${categoryResult.insertedCount}`)
    console.log(`   - Products: ${productResult.insertedCount}`)
    console.log('\n✅ Seed completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.close()
  }
}

seedPayloadProducts()
