import { createClient } from '@/lib/supabase/server'
import { ShoppingBag, Users, Package, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [todayOrders, pendingOrders, totalRevenue, totalProducts, totalCustomers, lowStockProducts] =
    await Promise.all([
      supabase.from('orders').select('id, total, status', { count: 'exact' }).gte('created_at', today.toISOString()),
      supabase.from('orders').select('id, order_number, delivery_name, total, created_at', { count: 'exact' }).eq('status', 'pending').order('created_at', { ascending: false }).limit(10),
      supabase.from('orders').select('total').eq('payment_status', 'paid'),
      supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
      supabase.from('products').select('id, name, stock').lt('stock', 5).eq('is_active', true).limit(5),
    ])

  const revenue = totalRevenue.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
  const todayRevenue = todayOrders.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders.count || 0,
      sub: `₹${todayRevenue.toLocaleString('en-IN')} revenue today`,
      icon: ShoppingBag,
      color: 'bg-primary-50 text-primary-600',
      href: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders.count || 0,
      sub: 'Need your attention',
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      href: '/admin/orders?status=pending',
    },
    {
      title: 'Total Revenue',
      value: `₹${revenue.toLocaleString('en-IN')}`,
      sub: 'All-time paid orders',
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      href: '/admin/orders',
    },
    {
      title: 'Products',
      value: totalProducts.count || 0,
      sub: 'Active listings',
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/products',
    },
    {
      title: 'Customers',
      value: totalCustomers.count || 0,
      sub: 'Registered accounts',
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/customers',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here\'s what\'s happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href} className="admin-card hover:shadow-card-hover transition-shadow">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</div>
            <div className="text-sm font-medium text-gray-700">{stat.title}</div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Orders */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pending Orders</h2>
            <Link href="/admin/orders?status=pending" className="text-xs text-primary-500 hover:underline">View all</Link>
          </div>
          {pendingOrders.data?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pending orders to process</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.data?.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{order.order_number}</div>
                    <div className="text-xs text-gray-500">{order.delivery_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 text-sm">₹{order.total.toLocaleString('en-IN')}</div>
                    <div className="badge badge-warning">Pending</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              Low Stock Alert
            </h2>
            <Link href="/admin/products" className="text-xs text-primary-500 hover:underline">Manage</Link>
          </div>
          {lowStockProducts.data?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">All products have sufficient inventory</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.data?.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                  <div className={`badge ${product.stock === 0 ? 'badge-error' : 'bg-orange-100 text-orange-700'}`}>
                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
