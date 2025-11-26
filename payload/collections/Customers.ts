import { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'createdAt'],
  },
  auth: true,
  access: {
    // Customers can only read/update their own profile
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true // Admin can read all
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    create: () => true, // Anyone can create an account
    update: ({ req: { user } }) => {
      if (user?.collection === 'users') return true // Admin can update all
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => user?.collection === 'users', // Only admin can delete
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      localized: false,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      localized: false,
    },
    {
      name: 'company',
      type: 'text',
      localized: false,
    },
    {
      name: 'phone',
      type: 'text',
      localized: false,
    },
    {
      name: 'addresses',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label (Domicile, Bureau, etc.)',
        },
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
        },
        {
          name: 'address1',
          type: 'text',
          required: true,
        },
        {
          name: 'address2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'province',
          type: 'text',
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'countryCode',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isBillingDefault',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'orderCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Total amount spent in cents',
      },
    },
    {
      name: 'lastOrderDate',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes (admin only)',
        condition: (data, siblingData, { user }) => user?.collection === 'users',
      },
    },
  ],
}
