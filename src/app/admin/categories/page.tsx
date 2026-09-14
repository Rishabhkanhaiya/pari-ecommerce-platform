'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Search, Tag, Check, X, Loader2, Upload } from 'lucide-react'
import type { Category } from '@/lib/types'
import toast from 'react-hot-toast'
import { useRef } from 'react'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err: any) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenNew = () => {
    setEditCategory(null)
    setForm({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      is_active: true,
    })
    setShowModal(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setEditCategory(cat)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image_url: cat.image_url || '',
      is_active: cat.is_active,
    })
    setShowModal(true)
  }

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm((prev) => ({
      ...prev,
      name,
      slug: editCategory ? prev.slug : slug,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setForm((prev) => ({ ...prev, image_url: data.url }))
      toast.success(`Uploaded ${file.name}`)
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        is_active: form.is_active,
      }

      if (editCategory) {
        const { error } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editCategory.id)

        if (error) throw error
        toast.success('Category updated successfully')
      } else {
        const { error } = await supabase.from('categories').insert([payload])
        if (error) throw error
        toast.success('New category added successfully')
      }

      setShowModal(false)
      fetchCategories()
    } catch (err: any) {
      toast.error(err.message || 'Error saving category')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (cat: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !cat.is_active })
        .eq('id', cat.id)

      if (error) throw error
      toast.success(`${cat.name} ${!cat.is_active ? 'activated' : 'deactivated'}`)
      fetchCategories()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status')
    }
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">Organize store catalog and navigation menus</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-card mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Categories Grid / Table */}
      <div className="admin-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin text-primary-500" />
            <span>Loading categories...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Tag size={36} className="mx-auto mb-2 opacity-50" />
            <p className="font-medium text-gray-600">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                              {cat.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{cat.name}</div>
                          {cat.description && (
                            <div className="text-xs text-gray-500 line-clamp-1">{cat.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">
                      /category/{cat.slug}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          cat.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}
                      >
                        {cat.is_active ? <Check size={12} /> : <X size={12} />}
                        <span>{cat.is_active ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit category"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / New Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">
                {editCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ladies Fashion, Jewellery, Toys"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ladies-fashion"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Cover Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/images/categories/fashion.jpg or upload"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="input-field text-xs flex-1"
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>Upload</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {form.image_url && (
                  <div className="mt-2 w-16 h-16 rounded-none border border-gray-200 overflow-hidden bg-gray-50">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short summary displayed on category banners"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="cat_active" className="text-sm font-medium text-gray-800 cursor-pointer">
                  Show in store catalog & navigation (Active)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{editCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
