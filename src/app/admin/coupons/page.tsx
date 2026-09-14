'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import type { Coupon } from '@/lib/types'
import toast from 'react-hot-toast'

const emptyForm = {
  code: '', description: '', type: 'percent' as 'percent' | 'flat',
  value: '', min_order_amount: '', max_discount: '', max_uses: '',
  expires_at: '', is_active: true,
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => { fetchCoupons() }, [])

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons(data || [])
  }

  const openNew = () => { setEditCoupon(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (c: Coupon) => {
    setEditCoupon(c)
    setForm({
      code: c.code, description: c.description || '', type: c.type,
      value: c.value.toString(), min_order_amount: c.min_order_amount.toString(),
      max_discount: c.max_discount?.toString() || '', max_uses: c.max_uses?.toString() || '',
      expires_at: c.expires_at ? c.expires_at.slice(0, 16) : '', is_active: c.is_active,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.code || !form.value) { toast.error('Code and value are required'); return }
    setSaving(true)
    const payload = {
      code: form.code.toUpperCase().trim(),
      description: form.description,
      type: form.type,
      value: parseFloat(form.value),
      min_order_amount: parseFloat(form.min_order_amount || '0'),
      max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    }
    try {
      if (editCoupon) {
        await supabase.from('coupons').update(payload).eq('id', editCoupon.id)
        toast.success('Coupon updated!')
      } else {
        await supabase.from('coupons').insert(payload)
        toast.success('Coupon created!')
      }
      setShowModal(false)
      fetchCoupons()
    } catch (e: any) {
      toast.error(e.message || 'Failed to save coupon')
    } finally { setSaving(false) }
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    await supabase.from('coupons').delete().eq('id', id)
    setCoupons(coupons.filter((c) => c.id !== id))
    toast.success('Coupon deleted')
  }

  const toggleActive = async (c: Coupon) => {
    await supabase.from('coupons').update({ is_active: !c.is_active }).eq('id', c.id)
    setCoupons(coupons.map((x) => x.id === c.id ? { ...x, is_active: !x.is_active } : x))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-500 text-sm">{coupons.length} coupons</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Coupon
        </button>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Code', 'Type', 'Value', 'Min Order', 'Usage', 'Expires', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-primary-500" />
                    <span className="font-mono font-bold text-gray-900">{c.code}</span>
                  </div>
                  {c.description && <div className="text-xs text-gray-400">{c.description}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">{c.type}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}
                  {c.max_discount && <div className="text-xs text-gray-400">Max ₹{c.max_discount}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {c.min_order_amount > 0 ? `₹${c.min_order_amount}` : 'None'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {c.expires_at ? new Date(c.expires_at).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${c.is_active ? 'badge-success' : 'badge-error'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => deleteCoupon(c.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <div className="text-center py-12 text-gray-400">No coupons yet</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="font-bold text-lg">{editCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="input-field uppercase" placeholder="SAVE20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="input-field">
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="input-field" placeholder={form.type === 'percent' ? '20' : '50'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                <input type="number" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} className="input-field" placeholder="299" />
              </div>
              {form.type === 'percent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (₹)</label>
                  <input type="number" value={form.max_discount} onChange={(e) => setForm({ ...form, max_discount: e.target.value })} className="input-field" placeholder="200" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className="input-field" placeholder="100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input type="datetime-local" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" placeholder="20% off on all orders above ₹299" />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-primary-500" />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Coupon'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
