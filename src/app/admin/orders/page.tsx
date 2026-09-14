import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types'
import type { Order, OrderStatus } from '@/lib/types'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const search = await searchParams
  const supabase = await createClient()
  const status = search.status as OrderStatus | undefined
  const page = parseInt(search.page || '1')
  const pageSize = 20

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (status) query = query.eq('status', status)

  const { data: orders, count } = await query
  const totalPages = Math.ceil((count || 0) / pageSize)

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Packed', value: 'packed' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm">{count} total orders</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              (status || '') === tab.value
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm font-semibold text-gray-900">{order.order_number}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{order.delivery_name}</div>
                    <div className="text-xs text-gray-500">{order.delivery_phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">—</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${ORDER_STATUS_COLORS[order.status as OrderStatus]}`}>
                      {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-primary-500 hover:underline text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders?.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/orders?${status ? `status=${status}&` : ''}page=${p}`}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                p === page ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
