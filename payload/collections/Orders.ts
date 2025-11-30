import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'status', 'totalCents', 'createdAt'],
    description: 'Gestion des commandes',
    listSearchableFields: ['orderNumber', 'customerName', 'customerEmail'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Admin users can read all
      if (user && 'role' in user && user.role === 'admin') return true

      // Customers can only read their own orders
      if (user && !('role' in user)) {
        return {
          customerEmail: {
            equals: (user as any).email,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!(user && 'role' in user && user.role === 'admin'),
    delete: ({ req: { user } }) => !!(user && 'role' in user && user.role === 'admin'),
  },
  fields: [
    // Order Reference
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Numéro de commande unique',
        readOnly: true,
      },
    },
    {
      name: 'medusaOrderId',
      type: 'text',
      unique: true,
      admin: {
        description: 'ID Medusa (si sync)',
      },
    },

    // Customer Information
    // NOTE: customer relationship field removed due to null reference issues with Payload 3.x
    // Use customerEmail instead to identify customer
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerCompany',
      type: 'text',
    },
    {
      name: 'countryCode',
      type: 'text',
      required: true,
      admin: {
        description: 'Code pays (FR, BE, CH, etc.)',
      },
    },

    // Order Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending_payment',
      options: [
        { label: '⏳ En attente de paiement', value: 'pending_payment' },
        { label: '✅ Payée - Attente BAT', value: 'paid_awaiting_bat' },
        { label: '🏭 En fabrication', value: 'in_production' },
        { label: '✓ Fabrication terminée', value: 'production_complete' },
        { label: '📦 Préparation expédition', value: 'preparing_shipment' },
        { label: '🚚 En livraison', value: 'in_delivery' },
        { label: '✓ Livrée', value: 'delivered' },
        { label: '❌ Annulée', value: 'cancelled' },
        { label: '💰 Remboursement complet', value: 'refund_full' },
        { label: '💸 Remboursement partiel', value: 'refund_partial' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'statusHistory',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Historique des changements de statut',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'status',
          type: 'text',
          required: true,
        },
        {
          name: 'changedBy',
          type: 'text',
        },
        {
          name: 'changedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'note',
          type: 'textarea',
        },
      ],
    },

    // Order Items
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Articles de la commande',
      },
      fields: [
        {
          name: 'productReference',
          type: 'text',
          required: true,
          admin: {
            description: 'Réf',
            width: '20%',
          },
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          admin: {
            description: 'Produit',
            width: '30%',
          },
        },
        {
          name: 'size',
          type: 'text',
          required: true,
          admin: {
            description: 'Taille',
            width: '15%',
          },
        },
        {
          name: 'supportShape',
          type: 'select',
          required: true,
          options: [
            { label: 'Carré', value: 'square' },
            { label: 'Rond', value: 'round' },
            { label: 'Ovale', value: 'oval' },
            { label: 'Rectangle', value: 'rectangle' },
          ],
          admin: {
            description: 'Forme',
            width: '15%',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Qté',
            width: '10%',
          },
        },
        {
          name: 'unitPriceCents',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Prix unit.',
            width: '10%',
          },
        },
        {
          name: 'totalPriceCents',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Total',
            width: '10%',
          },
        },
        {
          name: 'batApproved',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'BAT ✓',
            width: '10%',
          },
        },
        {
          name: 'batApprovedAt',
          type: 'date',
          admin: {
            description: 'Date BAT',
            width: '15%',
            condition: (data, siblingData) => siblingData?.batApproved,
          },
        },
        {
          name: 'productId',
          type: 'text',
          admin: {
            description: 'ID Medusa du produit',
            hidden: true,
          },
        },
        {
          name: 'variantId',
          type: 'text',
          admin: {
            description: 'ID Medusa de la variante',
            hidden: true,
          },
        },
      ],
    },

    // Pricing - Compact grouped display
    {
      name: 'pricing',
      type: 'group',
      admin: {
        description: 'Tarification',
      },
      fields: [
        {
          name: 'subtotalHT',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Sous-total HT',
            width: '50%',
          },
        },
        {
          name: 'shippingCents',
          type: 'number',
          min: 0,
          admin: {
            description: 'Livraison',
            width: '50%',
          },
        },
        {
          name: 'taxCents',
          type: 'number',
          min: 0,
          admin: {
            description: 'TVA',
            width: '50%',
          },
        },
        {
          name: 'discountCents',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Réduction',
            width: '50%',
          },
        },
        {
          name: 'totalCents',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Total TTC',
            width: '100%',
          },
        },
      ],
    },
    // Keep original fields for backward compatibility
    {
      name: 'subtotalHT',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Sous-total HT en centimes',
        hidden: true,
      },
    },
    {
      name: 'shippingCents',
      type: 'number',
      min: 0,
      admin: {
        description: 'Frais de livraison en centimes',
        hidden: true,
      },
    },
    {
      name: 'taxCents',
      type: 'number',
      min: 0,
      admin: {
        description: 'TVA en centimes (20%)',
        hidden: true,
      },
    },
    {
      name: 'discountCents',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Réduction en centimes',
        hidden: true,
      },
    },
    {
      name: 'totalCents',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total TTC en centimes',
        hidden: true,
      },
    },

    // Shipping Information
    {
      name: 'shippingMethod',
      type: 'text',
      required: true,
      admin: {
        description: 'Méthode de livraison (Colissimo, Chronopost, etc.)',
        width: '50%',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        description: 'Numéro de suivi transporteur',
        width: '50%',
      },
    },
    {
      name: 'trackingUrl',
      type: 'text',
      admin: {
        description: 'URL de suivi',
        width: '50%',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      admin: {
        description: 'Adresse de livraison',
      },
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'company',
          type: 'text',
          admin: {
            width: '100%',
          },
        },
        {
          name: 'address1',
          type: 'text',
          required: true,
          admin: {
            width: '100%',
          },
        },
        {
          name: 'address2',
          type: 'text',
          admin: {
            width: '100%',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'countryCode',
          type: 'text',
          required: true,
          admin: {
            width: '25%',
          },
        },
        {
          name: 'province',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'relayPoint',
      type: 'group',
      admin: {
        description: 'Informations point relais (si applicable)',
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'address',
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
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      admin: {
        description: 'Adresse de facturation (si différente)',
      },
      fields: [
        {
          name: 'firstName',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'company',
          type: 'text',
          admin: {
            width: '100%',
          },
        },
        {
          name: 'address1',
          type: 'text',
          admin: {
            width: '100%',
          },
        },
        {
          name: 'address2',
          type: 'text',
          admin: {
            width: '100%',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            width: '25%',
          },
        },
        {
          name: 'countryCode',
          type: 'text',
          admin: {
            width: '25%',
          },
        },
      ],
    },

    // Payment Information - Grouped for compact display
    {
      name: 'paymentInfo',
      type: 'group',
      admin: {
        description: 'Informations de paiement',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          options: [
            { label: 'Carte bancaire (Stripe)', value: 'stripe' },
            { label: 'PayPal', value: 'paypal' },
          ],
        },
        {
          name: 'paymentStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'En attente', value: 'pending' },
            { label: 'Payé', value: 'paid' },
            { label: 'Échoué', value: 'failed' },
            { label: 'Remboursé', value: 'refunded' },
          ],
        },
        {
          name: 'paidAt',
          type: 'date',
          admin: {
            description: 'Date paiement',
          },
        },
        {
          name: 'paymentIntentId',
          type: 'text',
          admin: {
            description: 'ID Transaction',
          },
        },
      ],
    },
    // Keep original fields for backward compatibility
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Carte bancaire (Stripe)', value: 'stripe' },
        { label: 'PayPal', value: 'paypal' },
      ],
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Payé', value: 'paid' },
        { label: 'Échoué', value: 'failed' },
        { label: 'Remboursé', value: 'refunded' },
      ],
      admin: {
        position: 'sidebar',
        hidden: true,
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        description: 'Date et heure de validation du paiement',
        hidden: true,
      },
    },
    {
      name: 'paymentIntentId',
      type: 'text',
      admin: {
        description: 'Stripe Payment Intent ID',
        hidden: true,
      },
    },

    // Refund Information
    {
      name: 'refund',
      type: 'group',
      admin: {
        description: 'Informations de remboursement',
        condition: (data) => {
          return data?.refund?.isRefunded || data?.paymentStatus === 'refunded'
        },
      },
      fields: [
        {
          name: 'isRefunded',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'refundType',
          type: 'select',
          options: [
            { label: 'Complet', value: 'full' },
            { label: 'Partiel', value: 'partial' },
          ],
        },
        {
          name: 'refundAmountCents',
          type: 'number',
          min: 0,
          admin: {
            description: 'Montant remboursé en centimes',
          },
        },
        {
          name: 'refundReason',
          type: 'textarea',
        },
        {
          name: 'refundedAt',
          type: 'date',
        },
        {
          name: 'refundedBy',
          type: 'text',
          admin: {
            description: 'Admin qui a effectué le remboursement',
          },
        },
      ],
    },

    // Documents - Compact grouped
    {
      name: 'documents',
      type: 'group',
      admin: {
        description: 'Documents',
      },
      fields: [
        {
          name: 'invoiceNumber',
          type: 'text',
          admin: {
            description: 'N° facture',
            width: '50%',
          },
        },
        {
          name: 'invoiceUrl',
          type: 'text',
          admin: {
            description: 'URL facture',
            width: '50%',
          },
        },
        {
          name: 'deliveryNoteNumber',
          type: 'text',
          admin: {
            description: 'N° bon de livraison',
            width: '50%',
          },
        },
        {
          name: 'deliveryNoteUrl',
          type: 'text',
          admin: {
            description: 'URL bon de livraison',
            width: '50%',
          },
        },
      ],
    },
    // Keep original fields for backward compatibility
    {
      name: 'invoiceUrl',
      type: 'text',
      admin: {
        description: 'URL de la facture PDF',
        hidden: true,
      },
    },
    {
      name: 'invoiceNumber',
      type: 'text',
      admin: {
        description: 'Numéro de facture',
        hidden: true,
      },
    },
    {
      name: 'deliveryNoteUrl',
      type: 'text',
      admin: {
        description: 'URL du bon de livraison PDF',
        hidden: true,
      },
    },
    {
      name: 'deliveryNoteNumber',
      type: 'text',
      admin: {
        description: 'Numéro du bon de livraison',
        hidden: true,
      },
    },

    // Internal Notes - Compact
    {
      name: 'notes',
      type: 'group',
      admin: {
        description: 'Notes',
      },
      fields: [
        {
          name: 'customerNotes',
          type: 'textarea',
          admin: {
            description: 'Notes du client',
            rows: 2,
          },
        },
        {
          name: 'internalNotes',
          type: 'textarea',
          admin: {
            description: 'Notes internes (admin)',
            rows: 2,
          },
        },
      ],
    },
    // Keep original fields for backward compatibility
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Notes internes (visible admin uniquement)',
        hidden: true,
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      admin: {
        description: 'Notes du client (commentaire commande)',
        hidden: true,
      },
    },

    // Medusa Sync
    {
      name: 'synced',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Synchronisé avec Medusa',
        position: 'sidebar',
      },
    },
    {
      name: 'medusaData',
      type: 'json',
      admin: {
        description: 'Données brutes Medusa',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Generate order number on creation
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now()
          const random = Math.floor(Math.random() * 10000)
          data.orderNumber = `ORD-${timestamp}-${random}`
        }

        return data
      },
      // Importer depuis le fichier séparé
      async (args) => {
        const { trackStatusHistoryHook } = await import('../hooks/trackStatusHistory')
        return trackStatusHistoryHook(args)
      },
    ],
    afterChange: [
      // Générer la facture au paiement
      async (args) => {
        const { generateInvoiceHook } = await import('../hooks/generateInvoice')
        return generateInvoiceHook(args)
      },
      // Générer le bon de livraison en fabrication
      async (args) => {
        const { generateDeliveryNoteHook } = await import('../hooks/generateDeliveryNote')
        return generateDeliveryNoteHook(args)
      },
      // Envoyer l'email de notification de statut
      async (args) => {
        const { sendStatusEmailHook } = await import('../hooks/sendStatusEmail')
        return sendStatusEmailHook(args)
      },
    ],
  },
}
