import dotenv from 'dotenv'
import { resolve } from 'path'
import { MongoClient, ObjectId } from 'mongodb'

// Load .env files explicitly
dotenv.config({ path: resolve(process.cwd(), '.env.local') })
dotenv.config({ path: resolve(process.cwd(), '.env') })

async function seedProductsAndCategories() {
  const uri = process.env.DATABASE_URL || ''
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')

    const db = client.db()

    // Step 1: Create Categories
    console.log('\n📁 Création des catégories...')

    const categories = [
      {
        name: { fr: 'Vinyle Blanc', en: 'White Vinyl' },
        slug: 'vinyle-blanc',
        description: {
          fr: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ type: 'text', text: 'Stickers en vinyle blanc brillant, parfaits pour une impression de qualité professionnelle.' }]
              }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        order: 1,
        isActive: true,
        seoTitle: { fr: 'Stickers Vinyle Blanc - Qualité Premium' },
        seoDescription: { fr: 'Découvrez nos stickers en vinyle blanc brillant pour une impression de haute qualité.' },
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { fr: 'Vinyle Transparent', en: 'Transparent Vinyl' },
        slug: 'vinyle-transparent',
        description: {
          fr: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ type: 'text', text: 'Stickers transparents pour un effet élégant et discret sur vos supports.' }]
              }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        order: 2,
        isActive: true,
        seoTitle: { fr: 'Stickers Vinyle Transparent' },
        seoDescription: { fr: 'Stickers transparents de qualité pour un rendu professionnel.' },
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { fr: 'Vinyle Holographique', en: 'Holographic Vinyl' },
        slug: 'vinyle-holographique',
        description: {
          fr: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ type: 'text', text: 'Stickers holographiques avec effets arc-en-ciel pour un rendu unique et original.' }]
              }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        order: 3,
        isActive: true,
        seoTitle: { fr: 'Stickers Holographiques - Effet Arc-en-ciel' },
        seoDescription: { fr: 'Stickers holographiques avec effet arc-en-ciel unique.' },
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { fr: 'Vinyle Miroir', en: 'Mirror Vinyl' },
        slug: 'vinyle-miroir',
        description: {
          fr: {
            root: {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ type: 'text', text: 'Stickers effet miroir pour un rendu brillant et réfléchissant spectaculaire.' }]
              }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        order: 4,
        isActive: true,
        seoTitle: { fr: 'Stickers Effet Miroir' },
        seoDescription: { fr: 'Stickers avec effet miroir réfléchissant.' },
        productsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const categoryResult = await db.collection('categories').insertMany(categories)
    const categoryIds = Object.values(categoryResult.insertedIds)
    console.log(`✅ ${categoryIds.length} catégories créées`)

    // Step 2: Create Products
    console.log('\n📦 Création des produits...')

    const products = [
      {
        title: { fr: 'Stickers Personnalisés Vinyle Blanc', en: 'Custom White Vinyl Stickers' },
        slug: 'stickers-vinyle-blanc',
        reference: 'STK-VB-001',
        category: [categoryIds[0]], // Vinyle Blanc
        shortDescription: { fr: 'Stickers en vinyle blanc brillant pour tous vos besoins de personnalisation.' },
        description: {
          fr: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Nos stickers en vinyle blanc sont parfaits pour créer vos autocollants personnalisés. Impression haute qualité, résistants à l\'eau et aux UV.' }]
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Idéal pour : décoration, emballage produits, marquage véhicules, événements...' }]
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        images: [], // Pas d'images pour éviter les bugs
        basePrice: 5000, // 50€ en centimes
        priceMatrix: [
          {
            size: '10x10cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 100 },
              { minQuantity: 100, pricePerUnit: 80 },
              { minQuantity: 250, pricePerUnit: 60 },
              { minQuantity: 500, pricePerUnit: 50 },
            ]
          },
          {
            size: '15x15cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 150 },
              { minQuantity: 100, pricePerUnit: 120 },
              { minQuantity: 250, pricePerUnit: 90 },
              { minQuantity: 500, pricePerUnit: 75 },
            ]
          },
          {
            size: '20x20cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 200 },
              { minQuantity: 100, pricePerUnit: 160 },
              { minQuantity: 250, pricePerUnit: 120 },
              { minQuantity: 500, pricePerUnit: 100 },
            ]
          },
        ],
        discount: {
          isActive: false,
        },
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle blanc brillant' },
            { label: 'Épaisseur', value: '80 microns' },
            { label: 'Résistance', value: 'Eau et UV' },
            { label: 'Durée de vie', value: '3-5 ans en extérieur' },
            { label: 'Application', value: 'Intérieur et extérieur' },
          ]
        },
        availableSizes: [
          { size: '10x10cm', label: { fr: '10x10 cm' } },
          { size: '15x15cm', label: { fr: '15x15 cm' } },
          { size: '20x20cm', label: { fr: '20x20 cm' } },
          { size: '15x20cm', label: { fr: '15x20 cm' } },
        ],
        availableShapes: ['square', 'round', 'oval', 'rectangle'],
        isActive: true,
        isFeatured: true,
        stock: -1, // Illimité
        seo: {
          title: { fr: 'Stickers Vinyle Blanc Personnalisés | Qualité Premium' },
          description: { fr: 'Commandez vos stickers personnalisés en vinyle blanc. Impression haute qualité, résistants et durables. Livraison rapide.' },
          keywords: { fr: 'stickers vinyle blanc, autocollants personnalisés, stickers imperméables' },
        },
        viewsCount: 0,
        salesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Stickers Transparents Premium', en: 'Premium Transparent Stickers' },
        slug: 'stickers-transparents',
        reference: 'STK-VT-001',
        category: [categoryIds[1]], // Vinyle Transparent
        shortDescription: { fr: 'Stickers transparents de qualité pour un rendu élégant et discret.' },
        description: {
          fr: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Stickers transparents pour un effet subtil et professionnel. Parfaits pour les vitres, emballages produits haut de gamme.' }]
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        images: [],
        basePrice: 6000,
        priceMatrix: [
          {
            size: '10x10cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 120 },
              { minQuantity: 100, pricePerUnit: 95 },
              { minQuantity: 250, pricePerUnit: 70 },
              { minQuantity: 500, pricePerUnit: 60 },
            ]
          },
          {
            size: '15x15cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 180 },
              { minQuantity: 100, pricePerUnit: 140 },
              { minQuantity: 250, pricePerUnit: 105 },
              { minQuantity: 500, pricePerUnit: 90 },
            ]
          },
        ],
        discount: {
          isActive: false,
        },
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle transparent' },
            { label: 'Finition', value: 'Brillante' },
            { label: 'Résistance', value: 'Eau et UV' },
            { label: 'Application', value: 'Intérieur et vitres' },
          ]
        },
        availableSizes: [
          { size: '10x10cm', label: { fr: '10x10 cm' } },
          { size: '15x15cm', label: { fr: '15x15 cm' } },
        ],
        availableShapes: ['square', 'round', 'rectangle'],
        isActive: true,
        isFeatured: true,
        stock: -1,
        seo: {
          title: { fr: 'Stickers Transparents Personnalisés | Qualité Premium' },
          description: { fr: 'Stickers transparents de haute qualité. Effet élégant pour vos vitres et emballages.' },
          keywords: { fr: 'stickers transparents, autocollants vitres, stickers discrets' },
        },
        viewsCount: 0,
        salesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Stickers Holographiques Effet Arc-en-ciel', en: 'Holographic Rainbow Effect Stickers' },
        slug: 'stickers-holographiques',
        reference: 'STK-VH-001',
        category: [categoryIds[2]], // Vinyle Holographique
        shortDescription: { fr: 'Stickers avec effet holographique arc-en-ciel pour un rendu unique et original.' },
        description: {
          fr: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Donnez une touche magique à vos créations avec nos stickers holographiques. Effet arc-en-ciel qui change selon l\'angle de vue.' }]
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        images: [],
        basePrice: 8000,
        priceMatrix: [
          {
            size: '10x10cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 160 },
              { minQuantity: 100, pricePerUnit: 130 },
              { minQuantity: 250, pricePerUnit: 95 },
              { minQuantity: 500, pricePerUnit: 80 },
            ]
          },
        ],
        discount: {
          isActive: true,
          type: 'percentage',
          value: 10,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        },
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle holographique' },
            { label: 'Effet', value: 'Arc-en-ciel changeant' },
            { label: 'Résistance', value: 'Eau' },
            { label: 'Application', value: 'Intérieur recommandé' },
          ]
        },
        availableSizes: [
          { size: '10x10cm', label: { fr: '10x10 cm' } },
          { size: '15x15cm', label: { fr: '15x15 cm' } },
        ],
        availableShapes: ['square', 'round'],
        isActive: true,
        isFeatured: true,
        stock: -1,
        seo: {
          title: { fr: 'Stickers Holographiques | Effet Arc-en-ciel Unique' },
          description: { fr: 'Stickers holographiques avec effet arc-en-ciel magique. Parfaits pour un rendu original et captivant.' },
          keywords: { fr: 'stickers holographiques, autocollants arc-en-ciel, stickers effet miroir' },
        },
        viewsCount: 0,
        salesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { fr: 'Stickers Effet Miroir', en: 'Mirror Effect Stickers' },
        slug: 'stickers-miroir',
        reference: 'STK-VM-001',
        category: [categoryIds[3]], // Vinyle Miroir
        shortDescription: { fr: 'Stickers avec effet miroir réfléchissant pour un rendu spectaculaire.' },
        description: {
          fr: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: 'Stickers effet miroir pour une finition luxueuse et réfléchissante. Idéal pour les applications haut de gamme.' }]
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          }
        },
        images: [],
        basePrice: 9000,
        priceMatrix: [
          {
            size: '10x10cm',
            quantityTiers: [
              { minQuantity: 50, pricePerUnit: 180 },
              { minQuantity: 100, pricePerUnit: 145 },
              { minQuantity: 250, pricePerUnit: 110 },
              { minQuantity: 500, pricePerUnit: 95 },
            ]
          },
        ],
        discount: {
          isActive: false,
        },
        specifications: {
          fr: [
            { label: 'Matériau', value: 'Vinyle effet miroir' },
            { label: 'Finition', value: 'Réfléchissante' },
            { label: 'Résistance', value: 'Intérieur uniquement' },
            { label: 'Application', value: 'Surfaces lisses' },
          ]
        },
        availableSizes: [
          { size: '10x10cm', label: { fr: '10x10 cm' } },
        ],
        availableShapes: ['square', 'round'],
        isActive: true,
        isFeatured: false,
        stock: -1,
        seo: {
          title: { fr: 'Stickers Effet Miroir | Finition Luxueuse' },
          description: { fr: 'Stickers avec effet miroir réfléchissant. Parfaits pour un rendu haut de gamme.' },
          keywords: { fr: 'stickers miroir, autocollants réfléchissants, stickers luxe' },
        },
        viewsCount: 0,
        salesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const productResult = await db.collection('products').insertMany(products)
    console.log(`✅ ${Object.keys(productResult.insertedIds).length} produits créés`)

    // Update category product counts
    for (let i = 0; i < categoryIds.length; i++) {
      const count = products.filter(p => p.category.includes(categoryIds[i])).length
      await db.collection('categories').updateOne(
        { _id: categoryIds[i] },
        { $set: { productsCount: count } }
      )
    }

    console.log('\n✅ Seed terminé avec succès!')
    console.log(`📁 ${categoryIds.length} catégories`)
    console.log(`📦 ${Object.keys(productResult.insertedIds).length} produits`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

seedProductsAndCategories()
