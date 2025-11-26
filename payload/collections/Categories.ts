import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'productsCount'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.collection === 'users',
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'name',
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
      name: 'description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Catégorie parente (pour sous-catégories)',
      },
    },
    {
      name: 'productsCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Nombre de produits dans cette catégorie',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Ordre d\'affichage',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'Titre SEO (meta title)',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Description SEO (meta description)',
      },
    },
  ],
  timestamps: true,
}
