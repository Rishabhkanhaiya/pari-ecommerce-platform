import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import CategorySort from '@/components/products/CategorySort'
import type { Product, Category } from '@/lib/types'
import Link from 'next/link'
import { Package } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string; sub?: string; page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: cat } = await supabase.from('categories').select('name, description').eq('slug', slug).single()
  return {
    title: cat?.name || 'Category',
    description: cat?.description || '',
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams
  const supabase = await createClient()
  const page = parseInt(search.page || '1')
  const pageSize = 20
  const sortBy = search.sort || 'newest'

  const { data: category } = await supabase
    .from('categories')
    .select('*, subcategories:categories!parent_id(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!category) notFound()

  // Get all category IDs (parent + subcategories)
  const catIds = [category.id, ...(category.subcategories?.map((s: Category) => s.id) || [])]
  if (search.sub) {
    const sub = category.subcategories?.find((s: Category) => s.slug === search.sub)
    if (sub) catIds.length = 0, catIds.push(sub.id)
  }

  let query = supabase
    .from('products')
    .select('*, category:categories(name, slug)', { count: 'exact' })
    .in('category_id', catIds)
    .eq('is_active', true)
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (sortBy === 'price_asc') query = query.order('price', { ascending: true })
  else if (sortBy === 'price_desc') query = query.order('price', { ascending: false })
  else if (sortBy === 'featured') query = query.order('is_featured', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: products, count } = await query
  const totalPages = Math.ceil((count || 0) / pageSize)

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Featured', value: 'featured' },
  ]

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">{category.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{count} products</p>
          </div>

          {/* Sort */}
          <CategorySort currentSort={sortBy} sortOptions={sortOptions} />
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <Link
            href={`/category/${slug}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!search.sub ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}
          >All</Link>
          {category.subcategories.map((sub: Category) => (
            <Link
              key={sub.id}
              href={`/category/${slug}?sub=${sub.slug}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${search.sub === sub.slug ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}
            >{sub.name}</Link>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-gray-200 text-gray-400">
            <Package size={24} />
          </div>
          <p className="font-semibold text-gray-900">No products found in this category yet</p>
          <p className="text-sm mt-1">Check back soon — we're constantly restocking!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/category/${slug}?page=${p}${sortBy ? `&sort=${sortBy}` : ''}`}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >{p}</Link>
          ))}
        </div>
      )}
    </div>
  )
}
