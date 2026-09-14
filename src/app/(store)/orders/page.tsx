'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, Package, Clock, ArrowRight, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types'
import type { Order, OrderStatus } from '@/lib/types'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setUser(data.user)
        const { data: userOrders } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })

        setOrders((userOrders as unknown as Order[]) || [])
      }
      setLoading(false)
    })
  }, [])

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim()
    if (!query) return

    setSearching(true)
    try {
      const supabase = createClient()
      const { data: foundOrder } = await supabase
        .from('orders')
        .select('id, order_number')
        .or(`order_number.ilike.%${query}%,delivery_phone.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (foundOrder) {
        router.push(`/orders/${foundOrder.id}`)
      } else {
        toast.error(`No order found matching "${query}". Please verify your order number or phone number.`)
      }
    } catch {
      toast.error('Order not found. Please check the order number.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-14">
      <div className="container-custom max-w-4xl">
        {/* Header Banner */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 mb-8 rounded-none shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] bg-rose-50 border border-rose-200 px-3 py-1 inline-block mb-2">
                Hyperlocal Dispatch Tracker
              </span>
              <h1 className="font-serif text-3xl font-bold text-gray-950">Track Your Order</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Enter your Order Number or Registered Phone Number for live Kinwat status
              </p>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold self-start sm:self-auto">
              <Clock size={14} className="text-[#E8272A]" />
              <span>30–45 Mins Average Delivery</span>
            </div>
          </div>

          {/* Search Lookup Box */}
          <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. PGC...) or 10-digit Phone"
                className="input-field pl-10 text-xs sm:text-sm rounded-none"
              />
            </div>
            <button
              type="submit"
              disabled={searching || !searchQuery.trim()}
              className="px-6 py-3 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-wider rounded-none transition-colors shadow-xs active:scale-95 disabled:opacity-50"
            >
              {searching ? 'Locating...' : 'Track Live Order'}
            </button>
          </form>
        </div>

        {/* User Past Orders List (if logged in) */}
        {user && (
          <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-none shadow-xs">
            <h2 className="font-serif text-xl font-bold text-gray-950 mb-4 pb-3 border-b border-gray-100">
              Your Order History
            </h2>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                <Package size={36} className="mx-auto mb-2 text-gray-300" />
                <p className="font-semibold text-gray-800">No previous orders on this account</p>
                <Link
                  href="/"
                  className="mt-4 inline-block text-xs font-bold text-[#E8272A] underline"
                >
                  Start Shopping Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <Link
                    key={ord.id}
                    href={`/orders/${ord.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 hover:border-[#E8272A] transition-colors rounded-none group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900 text-sm group-hover:text-[#E8272A] transition-colors">
                          {ord.order_number}
                        </span>
                        <span
                          className={`badge text-[10px] font-bold ${
                            ORDER_STATUS_COLORS[ord.status as OrderStatus]
                          }`}
                        >
                          {ORDER_STATUS_LABELS[ord.status as OrderStatus]}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        Deliver to: {ord.delivery_name} • {ord.delivery_address}
                      </div>
                    </div>

                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <div className="font-black text-base text-[#E8272A]">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <span>View Details</span>
                        <ArrowRight size={11} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
