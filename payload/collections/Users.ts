import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // TEMPORARY: Disable lockout mechanism for debugging
    maxLoginAttempts: 999999,
    lockTime: 1, // 1ms
    useAPIKey: false,
  },
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        // TEMPORARY: Log login attempts for debugging
        if (user) {
          console.log('🔓 Login attempt for user:', user.email, 'Role:', user.role)
          // Reset login attempts for admin users
          if (user.role === 'admin') {
            console.log('🔓 Resetting login attempts for admin user')
            return {
              ...user,
              loginAttempts: 0,
              lockUntil: undefined,
            }
          }
        }
        return user
      },
    ],
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
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
