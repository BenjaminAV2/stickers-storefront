import type { CollectionConfig } from 'payload'

export const PricingSettings: CollectionConfig = {
  slug: 'pricing-settings',
  admin: {
    useAsTitle: 'name',
    description: 'Global pricing configuration for stickers',
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Default Pricing Configuration',
      admin: {
        description: 'Configuration name',
      },
    },
    {
      name: 'baseEurPerCm2',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price in EUR per square centimeter',
        step: 0.001,
      },
    },
    {
      name: 'shapeMultipliers',
      type: 'json',
      required: true,
      admin: {
        description: 'Multipliers for different shapes (e.g., {"cut-contour": 1.5, "carre": 1.0, "rectangle": 1.1, "rond": 1.2})',
      },
      defaultValue: {
        'cut-contour': 1.5,
        'carre': 1.0,
        'rectangle': 1.1,
        'rond': 1.2,
      },
    },
    {
      name: 'supportMultipliers',
      type: 'json',
      required: true,
      admin: {
        description: 'Multipliers for different support materials (e.g., {"vinyle-blanc": 1.0, "vinyle-transparent": 1.2, "vinyle-holographique": 1.8, "vinyle-miroir": 1.5})',
      },
      defaultValue: {
        'vinyle-blanc': 1.0,
        'vinyle-transparent': 1.2,
        'vinyle-holographique': 1.8,
        'vinyle-miroir': 1.5,
      },
    },
    {
      name: 'quantityDiscounts',
      type: 'json',
      required: true,
      admin: {
        description: 'Quantity-based discounts (e.g., {"30": 1.0, "50": 0.95, "100": 0.90, "200": 0.85})',
      },
      defaultValue: {
        '30': 1.0,
        '50': 0.95,
        '100': 0.90,
        '200': 0.85,
        '500': 0.80,
        '1000': 0.75,
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Set as active pricing configuration',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
