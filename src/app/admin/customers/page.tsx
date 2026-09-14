'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Search, Phone, Calendar, ShoppingBag, Shield, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  phone: string
  name: string | null
  role: string
  created_at: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Failed to load customers')
    } else {
      setCustomers(data || [])
    }
    setLoading(false)
  }

  const filtered = customers.filter((c) =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm">Registered shoppers and active accounts across Kinwat</p>
        </div>
        <div className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl self-start sm:self-auto shadow-2xs">
          Total Users: {customers.length}
        </div>
      </div>

      <div className="admin-card mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or mobile number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin text-primary-500" />
            <span>Loading customer list...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users size={36} className="mx-auto mb-2 opacity-50" />
            <p className="font-medium text-gray-600">No customers registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Phone</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                          {(c.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{c.name || 'Shopper'}</div>
                          <div className="text-xs text-gray-400 font-mono">{c.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium"
                      >
                        <Phone size={13} className="text-gray-400" />
                        <span>{c.phone}</span>
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          c.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Shield size={11} />
                        <span>{c.role === 'admin' ? 'Store Admin' : 'Customer'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <a
                        href={`tel:${c.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#E8272A] hover:underline"
                        title="Call Customer"
                      >
                        <Phone size={13} />
                        Call
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
