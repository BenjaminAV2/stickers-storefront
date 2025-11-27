import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // TEMPORARY: Auth disabled to allow unrestricted admin access
  // auth: {
  //   maxLoginAttempts: 999999,
  //   lockTime: 1,
  //   useAPIKey: false,
  // },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    // TEMPORARY: Allow unrestricted access while auth is disabled
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
