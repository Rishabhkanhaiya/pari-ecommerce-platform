'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [form, setForm] = useState({
    name: '', category_id: '', description: '', price: '', mrp: '',
    stock: '', sku: '', is_featured: false, is_active: true, tags: ''
  })
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(name, slug)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').eq('is_active', true).order('sort_order'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  const openNew = () => {
    setEditProduct(null)
    setForm({ name: '', category_id: '', description: '', price: '', mrp: '', stock: '', sku: '', is_featured: false, is_active: true, tags: '' })
    setImages([])
    setShowModal(true)
  }

  const openEdit = (product: Product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      category_id: product.category_id,
      description: product.description || '',
      price: product.price.toString(),
      mrp: product.mrp?.toString() || '',
      stock: product.stock.toString(),
      sku: product.sku || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
      tags: product.tags?.join(', ') || '',
    })
    setImages(product.images || [])
    setShowModal(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
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

        setImages((prev) => [...prev, data.url])
        toast.success(`Uploaded ${file.name}`)
      }
    } catch (error: any) {
      toast.error(error.message || 'Image upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = imageUrlInput.trim()
    if (!trimmed) return
    if (!trimmed.startsWith('http') && !trimmed.startsWith('/')) {
      toast.error('Please enter a valid image URL starting with http://, https:// or /')
      return
    }
    setImages((prev) => [...prev, trimmed])
    setImageUrlInput('')
    toast.success('Image link added')
  }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSave = async () => {
    if (!form.name || !form.category_id || !form.price || !form.stock) {
      toast.error('Please fill all required fields')
      return
    }
    setSaving(true)

    const payload = {
      name: form.name,
      slug: editProduct?.slug || generateSlug(form.name) + '-' + Date.now().toString().slice(-4),
      category_id: form.category_id,
      description: form.description,
      price: parseFloat(form.price),
      mrp: form.mrp ? parseFloat(form.mrp) : null,
      stock: parseInt(form.stock),
      sku: form.sku || null,
      images,
      is_featured: form.is_featured,
      is_active: form.is_active,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    }

    try {
      if (editProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editProduct.id)
        if (error) throw error
        toast.success('Product updated!')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        toast.success('Product created!')
      }
      setShowModal(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (product: Product) => {
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success('Product deleted')
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Products Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'MRP', 'Stock', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || '/images/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                        onError={(e) => (e.currentTarget.src = '/images/placeholder-product.jpg')}
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.sku || 'No SKU'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{(product as any).category?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {product.mrp ? `₹${product.mrp.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${product.stock === 0 ? 'badge-error' : product.stock <= 5 ? 'bg-orange-100 text-orange-700' : 'badge-success'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(product)} className="flex items-center gap-1 text-sm">
                      {product.is_active
                        ? <ToggleRight size={24} className="text-green-500" />
                        : <ToggleLeft size={24} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">No products found</div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-lg">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Red Georgette Kurti" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input-field" placeholder="e.g. KUR-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="499" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                <input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="input-field" placeholder="699" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" placeholder="kurti, ethnic, red" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Describe the product..." />
              </div>

              {/* Images Management */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-900">Product Photos</label>
                  <span className="text-xs text-gray-500">{images.length} photo{images.length === 1 ? '' : 's'} added</span>
                </div>

                {/* Thumbnails Gallery */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-none overflow-hidden bg-gray-100 border border-gray-200 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Dual Upload: File Picker + Direct URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <div>
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-gray-900 py-3.5 px-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 transition-colors bg-gray-50 hover:bg-white disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-gray-900" />
                          <span>Uploading Photo...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>Upload from Device</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste image URL"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddImageUrl(e)
                        }
                      }}
                      className="input-field text-xs flex-1 rounded-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 mt-2">
                  Accepts JPG, PNG, WebP up to 8MB. First photo will be displayed as the primary catalog showcase.
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-primary-500" />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured / Hot Deal</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-primary-500" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (visible to customers)</label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
