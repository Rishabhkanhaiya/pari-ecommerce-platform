'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Clock, Package, Truck, MapPin, Phone, Printer, ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types'
import type { Order, OrderStatus } from '@/lib/types'

export default function OrderDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', params.id as string)
        .single()
      setOrder(data)
      setLoading(false)
    }
    fetchOrder()

    // Realtime subscription for order status updates
    const channel = supabase
      .channel(`order-${params.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${params.id}`,
      }, (payload) => {
        setOrder((prev) => prev ? { ...prev, ...payload.new as Order } : null)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [params.id])

  if (loading) {
    return (
      <div className="container-custom py-20 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-3 border-[#E8272A] border-t-transparent mx-auto mb-3" />
        <p className="text-sm font-bold">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container-custom py-20 text-center text-gray-500">
        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-gray-200 text-gray-400">
          <Package size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">Please check your order number or phone number.</p>
        <Link href="/orders" className="btn-primary rounded-none">
          Track Another Order
        </Link>
      </div>
    )
  }

  const statusIndex = ORDER_STATUS_FLOW.indexOf(order.status as OrderStatus)

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="container-custom max-w-3xl">
        {/* Back Link */}
        <div className="mb-4">
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#E8272A] transition-colors">
            <ArrowLeft size={14} /> Back to All Orders
          </Link>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 p-5 sm:p-6 mb-6 rounded-none flex items-start gap-3">
            <CheckCircle size={22} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950 text-base">Order Placed Successfully</div>
              <div className="text-emerald-800 text-xs sm:text-sm mt-0.5 leading-relaxed">
                Thank you for shopping at Pari Gift Center! Your order has been dispatched to our Kinwat store team for packaging. Estimated delivery: <strong className="font-bold">30–45 minutes</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Order Header Box */}
        <div className="bg-white border border-gray-200 p-5 sm:p-6 mb-6 rounded-none shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] bg-red-50 border border-red-200 px-2 py-0.5 inline-block mb-1">
                Kinwat Express Order
              </span>
              <h1 className="font-serif text-2xl font-bold text-gray-950">{order.order_number}</h1>
              <p className="text-gray-400 text-xs mt-0.5">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${ORDER_STATUS_COLORS[order.status as OrderStatus]} px-3 py-1.5 text-xs font-bold rounded-none uppercase`}>
                {ORDER_STATUS_LABELS[order.status as OrderStatus]}
              </span>
              <button
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-none transition-colors"
                title="Print Receipt"
              >
                <Printer size={13} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* 5-Step Order Progress Tracker */}
          {order.status !== 'cancelled' && (
            <div className="pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
                Live Fulfillment Status
              </h3>
              <div className="relative mb-2">
                <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200" />
                <div
                  className="absolute top-4 left-4 h-1 bg-[#E8272A] transition-all duration-700"
                  style={{ width: `${(Math.max(0, statusIndex) / (ORDER_STATUS_FLOW.length - 1)) * 100}%` }}
                />
                <div className="relative flex justify-between">
                  {ORDER_STATUS_FLOW.map((s, i) => {
                    const done = i <= statusIndex
                    const active = i === statusIndex
                    return (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            done ? 'bg-[#E8272A] border-[#E8272A] text-white' : 'bg-white border-gray-300 text-gray-400'
                          }`}
                        >
                          {done ? <CheckCircle size={15} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                        </div>
                        <span
                          className={`text-[11px] font-bold text-center max-w-[70px] leading-tight ${
                            active ? 'text-[#E8272A]' : done ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[s]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Details & Items Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Delivery Address */}
          <div className="bg-white border border-gray-200 p-5 rounded-none md:col-span-1">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin size={14} className="text-[#E8272A]" /> Destination
            </h3>
            <p className="font-bold text-gray-950 text-sm">{order.delivery_name}</p>
            <p className="text-gray-600 text-xs mt-1 leading-relaxed">{order.delivery_address}</p>
            <p className="text-gray-600 text-xs font-semibold">{order.delivery_city} — {order.delivery_pincode}</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 flex items-center gap-1.5 font-medium">
              <Phone size={13} className="text-gray-400" />
              <span>{order.delivery_phone}</span>
            </div>
          </div>

          {/* Items & Bill */}
          <div className="bg-white border border-gray-200 p-5 rounded-none md:col-span-2">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4">
              Items in Order ({order.items?.length || 0})
            </h3>
            <div className="space-y-3 divide-y divide-gray-100">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0 items-center">
                  <img
                    src={item.product_image || '/images/placeholder-product.jpg'}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover bg-gray-50 border border-gray-200 rounded-none flex-shrink-0"
                    onError={(e) => (e.currentTarget.src = '/images/placeholder-product.jpg')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs line-clamp-1">{item.product_name}</p>
                    {item.variant_name && (
                      <p className="text-[10px] text-gray-500 font-medium">Variant: {item.variant_name}</p>
                    )}
                    <p className="text-[11px] text-gray-400">Qty: {item.quantity} × ₹{item.price_per_item}</p>
                  </div>
                  <p className="font-black text-gray-900 text-xs sm:text-sm">
                    ₹{item.total_price.toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Calculation */}
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Delivery (Express Kinwat)</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
              </div>
              <div className="flex justify-between font-black text-gray-950 text-sm border-t border-gray-200 pt-2">
                <span>Total Amount</span>
                <span className="text-[#E8272A]">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px] pt-1">
                <span>Payment Mode: {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
                <span className={order.payment_status === 'paid' ? 'text-emerald-700 font-bold tracking-wider' : 'text-amber-700 font-bold tracking-wider'}>
                  {order.payment_status === 'paid' ? 'PAID' : 'PENDING ON DELIVERY'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 24-Hr Exchange Guarantee Notice */}
        <div className="bg-amber-50/70 border border-amber-200 p-4 mb-6 rounded-none flex items-start gap-3">
          <RotateCcw size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <strong className="font-bold">24-Hour Easy Exchange Guarantee:</strong> If there is any sizing or defect issue, exchange is valid within 24 hours of delivery. Doorstep reverse pickup fee is ₹40, or exchange for FREE at our physical shop counter in Kinwat Bazar.
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="sm:hidden w-full py-3 bg-white border border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-none"
          >
            <Printer size={14} /> Print Invoice
          </button>
          <Link
            href="/orders"
            className="flex-1 py-3 text-center bg-white border border-gray-300 hover:border-gray-900 text-gray-800 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
          >
            Track Other Orders
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 text-center bg-[#E8272A] hover:bg-[#CC1A1D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs rounded-none"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
