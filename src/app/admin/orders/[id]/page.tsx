import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminOrderDetailClient from './AdminOrderDetailClient'

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return <AdminOrderDetailClient order={order} />
}
