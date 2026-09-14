'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types'
import type { Order, OrderStatus } from '@/lib/types'
import { ArrowLeft, CheckCircle, Phone, Printer } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Props {
  order: Order
}

export default function AdminOrderDetailClient({ order: initialOrder }: Props) {
  const [order, setOrder] = useState(initialOrder)
  const [updating, setUpdating] = useState(false)

  const supabase = createClient()

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          ...(newStatus === 'delivered' ? { delivered_at: new Date().toISOString() } : {}),
        })
        .eq('id', order.id)

      if (error) throw error
      setOrder({ ...order, status: newStatus })
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[newStatus]}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const currentStatusIndex = ORDER_STATUS_FLOW.indexOf(order.status as OrderStatus)
  const nextStatus = ORDER_STATUS_FLOW[currentStatusIndex + 1] as OrderStatus | undefined

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="btn-ghost flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.order_number}</h1>
          <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Order Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status Card */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Order Status</h2>
              <span className={`badge ${ORDER_STATUS_COLORS[order.status as OrderStatus]} px-3 py-1`}>
                {ORDER_STATUS_LABELS[order.status as OrderStatus]}
              </span>
            </div>

            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <div className="flex flex-wrap gap-2">
                {nextStatus && (
                  <button
                    onClick={() => handleUpdateStatus(nextStatus)}
                    disabled={updating}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <CheckCircle size={16} />
                    Mark as {ORDER_STATUS_LABELS[nextStatus]}
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={updating}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm rounded-xl transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="admin-card">
            <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {(order.items as any[])?.map((item: any) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img
                    src={item.product_image || '/images/placeholder-product.jpg'}
                    alt={item.product_name}
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                    onError={(e) => (e.currentTarget.src = '/images/placeholder-product.jpg')}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                    {item.variant_name && <p className="text-xs text-gray-500">{item.variant_name}</p>}
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{item.total_price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.coupon_code && `(${order.coupon_code})`}</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span></div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2"><span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>

        {/* Right - Customer + Actions */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="admin-card">
            <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
            <p className="font-medium text-gray-900">{order.delivery_name}</p>
            <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
              <Phone size={13} className="text-gray-400" />
              <span>{order.delivery_phone}</span>
            </p>
          </div>

          {/* Delivery Address */}
          <div className="admin-card">
            <h2 className="font-semibold text-gray-900 mb-3">Delivery Address</h2>
            <p className="text-gray-700 text-sm">{order.delivery_address}</p>
            <p className="text-gray-600 text-sm">{order.delivery_city} — {order.delivery_pincode}</p>
          </div>

          {/* Payment */}
          <div className="admin-card">
            <h2 className="font-semibold text-gray-900 mb-3">Payment</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Actions */}
          <div className="space-y-2">
            <a
              href={`tel:${order.delivery_phone}`}
              className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-medium px-4 py-3 rounded-xl transition-colors w-full justify-center text-sm shadow-sm"
            >
              <Phone size={16} />
              Call Customer ({order.delivery_phone})
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium px-4 py-2.5 rounded-xl transition-colors w-full justify-center text-sm"
            >
              <Printer size={16} />
              Print / Save Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
