import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'totalCents', 'createdAt'],
    description: 'Gestion des commandes',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true // Admin can read all
      if (user?.collection === 'customers') {
        return {
          customer: {
            equals: user.id,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => user?.collection === 'users', // Only admin can update
    delete: ({ req: { user } }) => user?.collection === 'users', // Only admin can delete
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
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers' as any,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
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
      fields: [
        {
          name: 'productReference',
          type: 'text',
          required: true,
          admin: {
            description: 'Référence produit',
          },
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
          admin: {
            description: 'Nom du produit',
          },
        },
        {
          name: 'productId',
          type: 'text',
          admin: {
            description: 'ID Medusa du produit',
          },
        },
        {
          name: 'variantId',
          type: 'text',
          admin: {
            description: 'ID Medusa de la variante',
          },
        },
        {
          name: 'size',
          type: 'text',
          required: true,
          admin: {
            description: 'Taille (ex: 10x10cm)',
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
            description: 'Forme du support',
          },
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
          admin: {
            description: 'Prix unitaire HT en centimes',
          },
        },
        {
          name: 'totalPriceCents',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Prix total HT en centimes',
          },
        },
        {
          name: 'batVisual',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Visuel BAT (Bon à tirer)',
          },
        },
        {
          name: 'batApproved',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'BAT approuvé par le client',
          },
        },
        {
          name: 'batApprovedAt',
          type: 'date',
        },
      ],
    },

    // Pricing
    {
      name: 'subtotalHT',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Sous-total HT en centimes',
      },
    },
    {
      name: 'shippingCents',
      type: 'number',
      min: 0,
      admin: {
        description: 'Frais de livraison en centimes',
      },
    },
    {
      name: 'taxCents',
      type: 'number',
      min: 0,
      admin: {
        description: 'TVA en centimes (20%)',
      },
    },
    {
      name: 'discountCents',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Réduction en centimes',
      },
    },
    {
      name: 'totalCents',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total TTC en centimes',
      },
    },

    // Shipping Information
    {
      name: 'shippingMethod',
      type: 'text',
      required: true,
      admin: {
        description: 'Méthode de livraison (Colissimo, Chronopost, etc.)',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
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
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'province',
          type: 'text',
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
        },
        {
          name: 'lastName',
          type: 'text',
        },
        {
          name: 'company',
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
          name: 'countryCode',
          type: 'text',
        },
      ],
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        description: 'Numéro de suivi transporteur',
      },
    },
    {
      name: 'trackingUrl',
      type: 'text',
      admin: {
        description: 'URL de suivi',
      },
    },

    // Payment Information
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
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        description: 'Date et heure de validation du paiement',
      },
    },
    {
      name: 'paymentIntentId',
      type: 'text',
      admin: {
        description: 'Stripe Payment Intent ID',
      },
    },

    // Refund Information
    {
      name: 'refund',
      type: 'group',
      admin: {
        description: 'Informations de remboursement',
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

    // Documents
    {
      name: 'invoiceUrl',
      type: 'text',
      admin: {
        description: 'URL de la facture PDF',
      },
    },
    {
      name: 'invoiceNumber',
      type: 'text',
      admin: {
        description: 'Numéro de facture',
      },
    },
    {
      name: 'deliveryNoteUrl',
      type: 'text',
      admin: {
        description: 'URL du bon de livraison PDF',
      },
    },
    {
      name: 'deliveryNoteNumber',
      type: 'text',
      admin: {
        description: 'Numéro du bon de livraison',
      },
    },

    // Internal Notes
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Notes internes (visible admin uniquement)',
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      admin: {
        description: 'Notes du client (commentaire commande)',
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

        // Track status changes in history
        if (req.context?.previousStatus && data.status !== req.context.previousStatus) {
          if (!data.statusHistory) data.statusHistory = []
          data.statusHistory.push({
            status: data.status,
            changedAt: new Date().toISOString(),
            changedBy: req.user?.email || 'system',
            note: `Status changed from ${req.context.previousStatus} to ${data.status}`,
          })
        }

        return data
      },
    ],
  },
}
