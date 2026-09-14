'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Loader2, ArrowRight, Zap, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/lib/types'

interface SearchBarProps {
  className?: string
  placeholder?: string
  isMobile?: boolean
  onCloseMobile?: () => void
}

const POPULAR_SEARCHES = [
  'Kurti Set',
  'Waterproof Kajal',
  'Kundan Choker',
  'Bandhani Saree',
  'Matte Lipstick',
  'RC Toy Car',
  'Gift Hamper',
]

export default function SearchBar({
  className = '',
  placeholder = 'Search jewellery, bangles, cosmetics, kurtis, gifts...',
  isMobile = false,
  onCloseMobile,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Live search debounced
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setProducts([])
      setCategories([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const supabase = createClient()
        const [{ data: prodData }, { data: catData }] = await Promise.all([
          supabase
            .from('products')
            .select('id, name, slug, price, mrp, images, category:categories(name, slug)')
            .eq('is_active', true)
            .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%`)
            .limit(6),
          supabase
            .from('categories')
            .select('id, name, slug')
            .eq('is_active', true)
            .ilike('name', `%${trimmed}%`)
            .limit(3),
        ])

        setProducts((prodData as unknown as Product[]) || [])
        setCategories((catData as unknown as Category[]) || [])
      } catch (err) {
        console.error('Live search error:', err)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      if (onCloseMobile) onCloseMobile()
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false)
    if (onCloseMobile) onCloseMobile()
    router.push(`/product/${slug}`)
  }

  const handleSelectSearch = (term: string) => {
    setQuery(term)
    setIsOpen(false)
    if (onCloseMobile) onCloseMobile()
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  const handleClear = () => {
    setQuery('')
    setProducts([])
    setCategories([])
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* ─── SEARCH INPUT BAR ─── */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center bg-stone-50 hover:bg-stone-100/90 focus-within:bg-white border border-stone-300 focus-within:border-[#E8272A] focus-within:ring-2 focus-within:ring-red-500/15 transition-all shadow-2xs rounded-none">
          {/* Left Icon */}
          <div className="pl-3.5 pr-2 text-gray-400 flex items-center pointer-events-none flex-shrink-0">
            {loading ? (
              <Loader2 size={17} className="animate-spin text-[#E8272A]" />
            ) : (
              <Search size={17} />
            )}
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false)
            }}
            placeholder={placeholder}
            className="w-full py-2.5 sm:py-2 text-xs sm:text-sm bg-transparent outline-none text-gray-950 placeholder:text-gray-400 font-medium"
          />

          {/* Clear Button (if has text) */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors mr-1 flex-shrink-0"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 sm:py-2 transition-colors flex-shrink-0 flex items-center gap-1.5 rounded-none cursor-pointer"
          >
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* ─── LIVE AUTOCOMPLETE & SUGGESTIONS DROPDOWN ─── */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 shadow-2xl z-50 overflow-hidden animate-fade-in text-left rounded-none">
          {/* Case 1: Active query with results */}
          {query.trim() && (
            <div className="divide-y divide-stone-100 max-h-[440px] overflow-y-auto">
              {/* Category Matches */}
              {categories.length > 0 && (
                <div className="p-3 bg-stone-50/70">
                  <div className="text-[10px] font-black uppercase tracking-wider text-stone-400 mb-2">
                    Matching Categories
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => {
                          setIsOpen(false)
                          if (onCloseMobile) onCloseMobile()
                        }}
                        className="inline-flex items-center gap-1.5 bg-white hover:bg-red-50 hover:text-[#E8272A] border border-stone-200 hover:border-red-200 px-3 py-1 text-xs font-bold text-stone-800 transition-colors shadow-2xs rounded-none"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight size={11} className="text-[#E8272A]" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Matches */}
              {products.length > 0 ? (
                <div className="py-2">
                  <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-stone-400">
                    Products ({products.length})
                  </div>
                  {products.map((prod) => {
                    const img = prod.images?.[0] || '/images/placeholder-product.jpg'
                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.slug)}
                        className="flex items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-stone-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0 rounded-none">
                            <img
                              src={img}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform rounded-none"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-[#E8272A] transition-colors">
                              {prod.name}
                            </div>
                            {prod.category && (
                              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                {prod.category.name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price & Delivery badge */}
                        <div className="text-right flex-shrink-0 flex flex-col items-end">
                          <div className="text-xs sm:text-sm font-black text-[#E8272A]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                            <Clock size={10} />
                            <span>30–45m</span>
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                !loading && (
                  <div className="p-6 text-center text-stone-500">
                    <p className="text-sm font-semibold text-stone-800">
                      No products found for "{query}"
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Check your spelling or search for kurtis, kajal, sarees, jewellery...
                    </p>
                  </div>
                )
              )}

              {/* View all results button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-4 bg-stone-50 hover:bg-red-50 text-xs font-bold text-stone-900 hover:text-[#E8272A] flex items-center justify-center gap-1.5 transition-colors border-t border-stone-100 rounded-none"
              >
                <span>View all search results for "{query}"</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Case 2: Input is focused but empty -> Show Popular Searches */}
          {!query.trim() && (
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-stone-400 mb-3">
                <Zap size={12} className="text-[#E8272A]" />
                <span>Popular in Kinwat</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectSearch(term)}
                    className="inline-flex items-center gap-1.5 bg-stone-50 hover:bg-red-50 hover:text-[#E8272A] border border-stone-200 hover:border-red-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors rounded-none"
                  >
                    <Clock size={11} className="text-stone-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
