import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'published', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user, // Only authenticated users can create
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Page title (localised)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., "about-us")',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            if (value) {
              return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Main page content (localised)',
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      localized: true,
      admin: {
        description: 'SEO meta title (optional, defaults to page title)',
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'SEO meta description (150-160 characters recommended)',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Open Graph image for social sharing',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Toggle page visibility',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
