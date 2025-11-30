import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'published', 'updatedAt'],
    description: 'Gestionnaire de pages avec constructeur de contenu modulaire',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.collection === 'users',
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Titre de la page',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL de la page (ex: "a-propos")',
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

    // Page Builder avec blocs modulaires
    {
      name: 'blocks',
      type: 'blocks',
      localized: true,
      minRows: 0,
      admin: {
        description: 'Blocs de contenu de la page',
      },
      blocks: [
        // Bloc Texte riche
        {
          slug: 'richText',
          labels: {
            singular: 'Texte riche',
            plural: 'Textes riches',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
              admin: {
                description: 'Contenu texte avec formatage',
              },
            },
            {
              name: 'textAlign',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Gauche', value: 'left' },
                { label: 'Centre', value: 'center' },
                { label: 'Droite', value: 'right' },
                { label: 'Justifié', value: 'justify' },
              ],
            },
            {
              name: 'fontSize',
              type: 'select',
              defaultValue: 'base',
              options: [
                { label: 'Très petit', value: 'xs' },
                { label: 'Petit', value: 'sm' },
                { label: 'Normal', value: 'base' },
                { label: 'Grand', value: 'lg' },
                { label: 'Très grand', value: 'xl' },
                { label: '2XL', value: '2xl' },
                { label: '3XL', value: '3xl' },
              ],
            },
            {
              name: 'textColor',
              type: 'text',
              admin: {
                description: 'Couleur du texte (ex: #000000 ou rgb(0,0,0))',
              },
            },
            {
              name: 'backgroundColor',
              type: 'text',
              admin: {
                description: 'Couleur de fond (ex: #ffffff)',
              },
            },
            {
              name: 'padding',
              type: 'group',
              fields: [
                {
                  name: 'top',
                  type: 'select',
                  defaultValue: '4',
                  options: [
                    { label: 'Aucun', value: '0' },
                    { label: 'Petit', value: '2' },
                    { label: 'Moyen', value: '4' },
                    { label: 'Grand', value: '8' },
                    { label: 'Très grand', value: '12' },
                  ],
                },
                {
                  name: 'bottom',
                  type: 'select',
                  defaultValue: '4',
                  options: [
                    { label: 'Aucun', value: '0' },
                    { label: 'Petit', value: '2' },
                    { label: 'Moyen', value: '4' },
                    { label: 'Grand', value: '8' },
                    { label: 'Très grand', value: '12' },
                  ],
                },
              ],
            },
          ],
        },

        // Bloc Titre
        {
          slug: 'heading',
          labels: {
            singular: 'Titre',
            plural: 'Titres',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Texte du titre',
              },
            },
            {
              name: 'level',
              type: 'select',
              required: true,
              defaultValue: 'h2',
              options: [
                { label: 'H1 (Principal)', value: 'h1' },
                { label: 'H2 (Section)', value: 'h2' },
                { label: 'H3 (Sous-section)', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' },
              ],
              admin: {
                description: 'Niveau de titre (balise HTML)',
              },
            },
            {
              name: 'fontSize',
              type: 'text',
              admin: {
                description: 'Taille personnalisée (ex: 2rem, 32px)',
              },
            },
            {
              name: 'fontWeight',
              type: 'select',
              defaultValue: 'bold',
              options: [
                { label: 'Normal', value: 'normal' },
                { label: 'Semi-gras', value: 'semibold' },
                { label: 'Gras', value: 'bold' },
                { label: 'Extra-gras', value: 'extrabold' },
              ],
            },
            {
              name: 'textAlign',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Gauche', value: 'left' },
                { label: 'Centre', value: 'center' },
                { label: 'Droite', value: 'right' },
              ],
            },
            {
              name: 'color',
              type: 'text',
              admin: {
                description: 'Couleur du texte (ex: #000000)',
              },
            },
            {
              name: 'margin',
              type: 'group',
              fields: [
                {
                  name: 'top',
                  type: 'select',
                  defaultValue: '6',
                  options: [
                    { label: 'Aucun', value: '0' },
                    { label: 'Petit', value: '2' },
                    { label: 'Moyen', value: '4' },
                    { label: 'Grand', value: '6' },
                    { label: 'Très grand', value: '8' },
                  ],
                },
                {
                  name: 'bottom',
                  type: 'select',
                  defaultValue: '4',
                  options: [
                    { label: 'Aucun', value: '0' },
                    { label: 'Petit', value: '2' },
                    { label: 'Moyen', value: '4' },
                    { label: 'Grand', value: '6' },
                    { label: 'Très grand', value: '8' },
                  ],
                },
              ],
            },
          ],
        },

        // Bloc Image
        {
          slug: 'image',
          labels: {
            singular: 'Image',
            plural: 'Images',
          },
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
              required: true,
              localized: true,
              admin: {
                description: 'Texte alternatif pour l\'accessibilité et le SEO',
              },
            },
            {
              name: 'caption',
              type: 'text',
              localized: true,
              admin: {
                description: 'Légende de l\'image (optionnelle)',
              },
            },
            {
              name: 'size',
              type: 'select',
              defaultValue: 'large',
              options: [
                { label: 'Petite', value: 'small' },
                { label: 'Moyenne', value: 'medium' },
                { label: 'Grande', value: 'large' },
                { label: 'Pleine largeur', value: 'full' },
              ],
            },
            {
              name: 'alignment',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Gauche', value: 'left' },
                { label: 'Centre', value: 'center' },
                { label: 'Droite', value: 'right' },
              ],
            },
            {
              name: 'link',
              type: 'text',
              admin: {
                description: 'URL de lien (optionnel)',
              },
            },
          ],
        },

        // Bloc Hero
        {
          slug: 'hero',
          labels: {
            singular: 'Bannière Hero',
            plural: 'Bannières Hero',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'subtitle',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'backgroundColor',
              type: 'text',
              admin: {
                description: 'Couleur de fond si pas d\'image',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#ffffff',
            },
            {
              name: 'height',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Petit (300px)', value: 'small' },
                { label: 'Moyen (500px)', value: 'medium' },
                { label: 'Grand (700px)', value: 'large' },
                { label: 'Plein écran', value: 'full' },
              ],
            },
            {
              name: 'ctaButtons',
              type: 'array',
              maxRows: 2,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'style',
                  type: 'select',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primaire', value: 'primary' },
                    { label: 'Secondaire', value: 'secondary' },
                    { label: 'Outline', value: 'outline' },
                  ],
                },
              ],
            },
          ],
        },

        // Bloc Galerie
        {
          slug: 'gallery',
          labels: {
            singular: 'Galerie',
            plural: 'Galeries',
          },
          fields: [
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
                  required: true,
                  localized: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  localized: true,
                },
              ],
            },
            {
              name: 'columns',
              type: 'select',
              defaultValue: '3',
              options: [
                { label: '2 colonnes', value: '2' },
                { label: '3 colonnes', value: '3' },
                { label: '4 colonnes', value: '4' },
              ],
            },
            {
              name: 'spacing',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Serré', value: 'tight' },
                { label: 'Moyen', value: 'medium' },
                { label: 'Large', value: 'loose' },
              ],
            },
          ],
        },

        // Bloc CTA
        {
          slug: 'cta',
          labels: {
            singular: 'Appel à l\'action',
            plural: 'Appels à l\'action',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'buttonText',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'buttonUrl',
              type: 'text',
              required: true,
            },
            {
              name: 'buttonStyle',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primaire', value: 'primary' },
                { label: 'Secondaire', value: 'secondary' },
                { label: 'Outline', value: 'outline' },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'text',
              defaultValue: '#f3f4f6',
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#000000',
            },
          ],
        },
      ],
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
            description: 'Description SEO (150-160 caractères)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          localized: true,
          admin: {
            description: 'Mots-clés (séparés par des virgules)',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image Open Graph pour réseaux sociaux',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Empêcher l\'indexation par les moteurs de recherche',
          },
        },
      ],
    },

    // Publication
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Page visible publiquement',
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        description: 'Date de publication',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
