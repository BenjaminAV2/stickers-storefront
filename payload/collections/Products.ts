import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categorySlugs', 'basePrice', 'isActive'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.collection === 'users',
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    // Basic Information
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Référence produit unique (ex: STK-001)',
      },
    },
    {
      name: 'medusaProductId',
      type: 'text',
      admin: {
        description: 'ID du produit dans Medusa (si synchronisé)',
      },
    },

    // Category
    // NOTE: Made optional temporarily due to Payload 3.x relationship traversal bug
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories' as any,
      required: false, // Changed from true to false
      hasMany: true,
      admin: {
        description: 'Catégories du produit',
      },
    },
    // Category slugs as text array (workaround for relationship bug)
    {
      name: 'categorySlugs',
      type: 'array',
      admin: {
        description: 'Slugs des catégories (ex: vinyle-blanc, vinyle-transparent)',
      },
      fields: [
        {
          name: 'slug',
          type: 'text',
        },
      ],
    },

    // Description
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Description courte pour les listes',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Description complète du produit',
      },
    },

    // Images
    // NOTE: Made optional temporarily due to Payload 3.x upload relationship bug
    {
      name: 'images',
      type: 'array',
      required: false, // Changed from true to false
      minRows: 0, // Changed from 1 to 0
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false, // Changed from true to false
        },
        {
          name: 'alt',
          type: 'text',
          localized: true,
        },
      ],
    },
    // Image URLs as text (workaround for upload relationship bug)
    {
      name: 'imageUrls',
      type: 'array',
      admin: {
        description: 'URLs des images (temporaire, en attendant fix Media)',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'alt',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image principale (first image si non renseignée)',
      },
    },

    // Pricing
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Prix de base HT en centimes',
      },
    },
    {
      name: 'priceMatrix',
      type: 'array',
      admin: {
        description: 'Matrice de prix par taille et quantité',
      },
      fields: [
        {
          name: 'size',
          type: 'text',
          required: true,
          admin: {
            description: 'Taille (ex: 10x10cm)',
          },
        },
        {
          name: 'quantityTiers',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'minQuantity',
              type: 'number',
              required: true,
              min: 1,
            },
            {
              name: 'pricePerUnit',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description: 'Prix unitaire HT en centimes',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'discount',
      type: 'group',
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Pourcentage', value: 'percentage' },
            { label: 'Montant fixe', value: 'fixed' },
          ],
        },
        {
          name: 'value',
          type: 'number',
          admin: {
            description: 'Pourcentage (ex: 20 pour 20%) ou montant en centimes',
          },
        },
        {
          name: 'startDate',
          type: 'date',
        },
        {
          name: 'endDate',
          type: 'date',
        },
      ],
    },

    // Product Specifications
    {
      name: 'specifications',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },

    // Available Sizes
    {
      name: 'availableSizes',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Tailles disponibles',
      },
      fields: [
        {
          name: 'size',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
      ],
    },

    // Available Support Shapes
    {
      name: 'availableShapes',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Carré', value: 'square' },
        { label: 'Rond', value: 'round' },
        { label: 'Ovale', value: 'oval' },
        { label: 'Rectangle', value: 'rectangle' },
      ],
      defaultValue: ['square'],
    },

    // Status
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Afficher en page d\'accueil',
      },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Stock disponible (-1 = illimité)',
      },
    },

    // SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          admin: {
            description: 'Titre SEO (meta title)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Description SEO (meta description)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          localized: true,
          admin: {
            description: 'Mots-clés SEO (séparés par des virgules)',
          },
        },
      ],
    },

    // Statistics
    {
      name: 'viewsCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'salesCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
