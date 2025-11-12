import type { CollectionConfig } from 'payload'

export const ShippingProviders: CollectionConfig = {
  slug: 'shipping-providers',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'countries', 'isRelayService'],
    group: 'E-commerce',
  },
  access: {
    read: () => true, // Public access for frontend
    create: ({ req }) => req.user !== undefined,
    update: ({ req }) => req.user !== undefined,
    delete: ({ req }) => req.user !== undefined,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nom du transporteur',
      localized: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Description courte',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo du transporteur',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Prix TTC (en euros)',
      min: 0,
    },
    {
      name: 'estimatedDelivery',
      type: 'text',
      required: true,
      label: 'Délai estimé',
      localized: true,
      admin: {
        placeholder: 'Ex: 2-3 jours ouvrés',
      },
    },
    {
      name: 'countries',
      type: 'select',
      hasMany: true,
      required: true,
      label: 'Pays desservis',
      options: [
        { label: 'France', value: 'FR' },
        { label: 'Belgique', value: 'BE' },
        { label: 'Suisse', value: 'CH' },
        { label: 'Luxembourg', value: 'LU' },
        { label: 'Allemagne', value: 'DE' },
        { label: 'Espagne', value: 'ES' },
        { label: 'Italie', value: 'IT' },
        { label: 'Pays-Bas', value: 'NL' },
        { label: 'Portugal', value: 'PT' },
        { label: 'Royaume-Uni', value: 'GB' },
      ],
    },
    {
      name: 'postalCodeRules',
      type: 'group',
      label: 'Règles de code postal',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Activer le filtrage par code postal',
          defaultValue: false,
        },
        {
          name: 'pattern',
          type: 'text',
          label: 'Pattern RegEx',
          admin: {
            placeholder: 'Ex: ^75\\d{3}$ pour Paris',
            condition: (data) => data.postalCodeRules?.enabled,
            description: 'Expression régulière pour valider les codes postaux',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          admin: {
            placeholder: 'Ex: Paris et Île-de-France uniquement',
            condition: (data) => data.postalCodeRules?.enabled,
          },
        },
      ],
    },
    {
      name: 'isRelayService',
      type: 'checkbox',
      label: 'Service point relais',
      defaultValue: false,
    },
    {
      name: 'relayApi',
      type: 'group',
      label: 'Configuration API Point Relais',
      admin: {
        condition: (data) => data.isRelayService,
      },
      fields: [
        {
          name: 'provider',
          type: 'select',
          label: 'Fournisseur',
          options: [
            { label: 'Mondial Relay', value: 'mondial-relay' },
            { label: 'Relais Colis', value: 'relais-colis' },
            { label: 'Pickup', value: 'pickup' },
            { label: 'Autre', value: 'custom' },
          ],
        },
        {
          name: 'apiKey',
          type: 'text',
          label: 'Clé API',
          admin: {
            description: 'Clé API pour interroger les points relais',
          },
        },
        {
          name: 'apiUrl',
          type: 'text',
          label: 'URL API',
          admin: {
            placeholder: 'https://api.exemple.com/relay-points',
          },
        },
      ],
    },
    {
      name: 'trackingUrl',
      type: 'text',
      label: 'URL de suivi',
      admin: {
        placeholder: 'https://tracking.exemple.com/{trackingNumber}',
        description: 'Utilisez {trackingNumber} comme placeholder',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Caractéristiques',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Ordre d\'affichage',
      defaultValue: 0,
      admin: {
        description: 'Plus le nombre est petit, plus le transporteur est affiché en premier',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Actif',
      defaultValue: true,
      admin: {
        description: 'Désactivez pour masquer temporairement ce transporteur',
      },
    },
  ],
}
