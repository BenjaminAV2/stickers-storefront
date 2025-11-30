import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true, // Public read access for media
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    staticDir: '../media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Texte alternatif pour l\'accessibilité et le SEO',
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Titre de l\'image',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Légende de l\'image',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Crédit photo / source',
      },
    },
  ],
}
