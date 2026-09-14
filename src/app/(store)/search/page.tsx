import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/lib/types'
import { Search } from 'lucide-react'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export const metadata = {
  title: 'Search Products',
}

export default async function SearchPage({ searchParams }: Props) {
  const search = await searchParams
  const query = search.q?.trim()
  let products: Product[] = []

  if (query) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(40)

    products = data || []
  }

  return (
    <div className="container-custom py-8">
      <h1 className="section-title mb-2">
        {query ? `Search Results for "${query}"` : 'Search Products'}
      </h1>
      {query && <p className="text-gray-500 text-sm mb-6">{products.length} products found</p>}

      {!query && (
        <div className="text-center py-20 text-gray-400">
          <Search size={48} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">Enter a search term to find products</p>
          <p className="text-sm mt-1">Try "kurti", "earrings", "lipstick"...</p>
        </div>
      )}

      {query && products.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center border border-gray-200 text-gray-400">
            <Search size={24} />
          </div>
          <p className="font-semibold text-gray-900">No products found for "{query}"</p>
          <p className="text-sm mt-1 mb-6">Try a different search term or browse popular categories</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {['Kurti', 'Jewellery', 'Lipstick', 'Toys', 'Gifts'].map((s) => (
              <Link key={s} href={`/search?q=${s}`} className="px-4 py-2 bg-gray-50 border border-gray-200 hover:border-[#E8272A] hover:text-[#E8272A] rounded-none text-xs font-bold uppercase tracking-wider text-gray-700 transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
