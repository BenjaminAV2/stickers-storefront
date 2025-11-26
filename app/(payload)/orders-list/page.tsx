import OrdersList from '@/components/admin/OrdersList'

export const metadata = {
  title: 'Liste des Commandes | Exclusives Stickers CMS',
}

export default function OrdersListPage() {
  return (
    <div className="custom-admin-page">
      <OrdersList />
    </div>
  )
}
