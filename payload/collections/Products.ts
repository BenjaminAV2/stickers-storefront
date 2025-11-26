import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'basePrice', 'isActive'],
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
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: true,
      admin: {
        description: 'Catégories du produit',
      },
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
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
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
