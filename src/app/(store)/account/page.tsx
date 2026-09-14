'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, MapPin, User, LogOut, Edit2, Phone } from 'lucide-react'
import type { Profile, Order, Address } from '@/lib/types'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders')
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }

      const [{ data: profile }, { data: orderList }, { data: addrList }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', data.user.id).single(),
        supabase.from('orders').select('*, items:order_items(id)').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('addresses').select('*').eq('user_id', data.user.id),
      ])

      setUser(profile)
      setOrders(orderList || [])
      setAddresses(addrList || [])
      setEditName(profile?.name || '')
      setEditEmail(profile?.email || '')
      setLoading(false)
    })
  }, [])

  const handleSaveProfile = async () => {
    if (!user) return
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ name: editName, email: editEmail }).eq('id', user.id)
    if (error) { toast.error('Failed to update profile'); return }
    setUser({ ...user, name: editName, email: editEmail })
    toast.success('Profile updated!')
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    toast.success('Logged out!')
  }

  if (loading) return <div className="container-custom py-20 text-center text-gray-400">Loading...</div>

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">My Account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.name || 'Customer'} | {user?.phone}
          </p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'orders', label: 'My Orders', icon: ShoppingBag },
          { key: 'addresses', label: 'Addresses', icon: MapPin },
          { key: 'profile', label: 'Profile', icon: User },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ShoppingBag size={48} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">No orders yet</p>
              <Link href="/" className="btn-primary inline-flex mt-4 text-sm">Start Shopping</Link>
            </div>
          ) : (
            orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="bg-white rounded-2xl p-5 shadow-card flex items-center justify-between hover:shadow-card-hover transition-shadow block">
                <div>
                  <div className="font-mono font-semibold text-gray-900">{order.order_number}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className="text-sm text-gray-500">{(order.items as any)?.length || 0} items</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</div>
                  <span className={`badge ${ORDER_STATUS_COLORS[order.status]} mt-1`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{addr.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}</div>
                  {addr.landmark && <div className="text-sm text-gray-500">Near {addr.landmark}</div>}
                  <div className="text-sm text-gray-600">{addr.city} — {addr.pincode}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Phone size={13} className="text-gray-400" />
                    <span>{addr.phone}</span>
                  </div>
                </div>
                {addr.is_default && <span className="badge badge-primary">Default</span>}
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MapPin size={40} className="mx-auto mb-2 opacity-50" />
              <p>No saved addresses. Add one at checkout!</p>
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-card max-w-md">
          <h2 className="font-semibold text-gray-900 mb-4">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input value={user?.phone || ''} disabled className="input-field bg-gray-50 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
            </div>
            <button onClick={handleSaveProfile} className="btn-primary w-full">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  )
}
