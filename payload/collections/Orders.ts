import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: ['orderId', 'customerEmail', 'totalCents', 'synced', 'createdAt'],
    description: 'Orders synced from Medusa backend',
  },
  access: {
    read: ({ req: { user } }) => !!user, // Only authenticated users
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order ID from Medusa',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Customer email address',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      admin: {
        description: 'Customer full name',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        description: 'Order line items',
      },
      fields: [
        {
          name: 'productId',
          type: 'text',
          required: true,
        },
        {
          name: 'productTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'variantId',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPriceCents',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'totalPriceCents',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'metadata',
          type: 'json',
          admin: {
            description: 'Additional product metadata',
          },
        },
      ],
    },
    {
      name: 'subtotalCents',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Order subtotal in cents (EUR)',
      },
    },
    {
      name: 'shippingCents',
      type: 'number',
      min: 0,
      admin: {
        description: 'Shipping cost in cents (EUR)',
      },
    },
    {
      name: 'taxCents',
      type: 'number',
      min: 0,
      admin: {
        description: 'Tax amount in cents (EUR)',
      },
    },
    {
      name: 'totalCents',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total order amount in cents (EUR)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'synced',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this order has been synced with Medusa',
        position: 'sidebar',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
        },
        {
          name: 'lastName',
          type: 'text',
        },
        {
          name: 'address1',
          type: 'text',
        },
        {
          name: 'address2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'medusaData',
      type: 'json',
      admin: {
        description: 'Raw order data from Medusa API',
      },
    },
  ],
  timestamps: true,
}
