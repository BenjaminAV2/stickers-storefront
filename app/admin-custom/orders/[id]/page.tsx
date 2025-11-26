import OrderDetail from '@/components/admin/OrderDetail'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return <OrderDetail orderId={params.id} />
}
