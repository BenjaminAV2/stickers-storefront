import type { CollectionBeforeChangeHook } from 'payload'

export const trackStatusHistoryHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Tracker les changements de statut
  if (operation === 'update' && data.status && originalDoc?.status !== data.status) {
    const newHistoryEntry = {
      status: data.status,
      changedAt: new Date().toISOString(),
      changedBy: req.user?.email || 'system',
      note: `Statut modifié de "${originalDoc.status}" vers "${data.status}"`,
    }

    // Ajouter au tableau d'historique
    data.statusHistory = [
      ...(originalDoc.statusHistory || []),
      newHistoryEntry,
    ]
  }

  // Si création, ajouter l'entrée initiale
  if (operation === 'create' && data.status) {
    data.statusHistory = [
      {
        status: data.status,
        changedAt: new Date().toISOString(),
        changedBy: req.user?.email || 'system',
        note: 'Commande créée',
      },
    ]
  }

  return data
}
