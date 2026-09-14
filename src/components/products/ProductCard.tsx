'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Heart, Clock } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product } from '@/lib/types'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null

  const primaryImage = product.images?.[0] || '/images/placeholder-product.jpg'

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock === 0) {
      toast.error('This product is out of stock')
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      image: primaryImage,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      slug: product.slug,
    })
    toast.success(`${product.name} added to cart`, { duration: 2000 })
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block bg-white rounded-none overflow-hidden border border-gray-200 hover:border-gray-900 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      {/* Product Image Area with Hard Corners */}
      <div className="relative aspect-[4/5] sm:aspect-square bg-gray-50 overflow-hidden rounded-none">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-none"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg'
          }}
        />

        {/* Crisp Hard-Corner Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-[#E8272A] text-white text-[10px] font-black px-2 py-0.5 rounded-none shadow-xs uppercase tracking-wider">
              {discountPercent}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="bg-amber-400 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded-none shadow-2xs uppercase tracking-wider">
              HOT DEAL
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-none uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Fast delivery pill (crisp hard corner) */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="bg-white/95 text-gray-900 text-[10px] font-extrabold px-2 py-0.5 rounded-none shadow-xs border border-gray-200 flex items-center gap-1 uppercase tracking-wide">
            <Clock size={10} className="text-[#E8272A]" />
            <span>30–45m Kinwat</span>
          </span>
        </div>

        {/* Wishlist Square Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsWishlisted(!isWishlisted)
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
              duration: 1500,
            })
          }}
          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/95 rounded-none shadow-xs flex items-center justify-center text-gray-400 hover:text-[#E8272A] border border-gray-100 transition-colors z-10"
        >
          <Heart
            size={14}
            className={isWishlisted ? 'fill-[#E8272A] text-[#E8272A]' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {product.category && (
            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mb-1 line-clamp-1">
              {product.category.name}
            </p>
          )}
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 mb-1 group-hover:text-[#E8272A] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Touch-friendly Hard-Corner Add Button */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-1.5">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-black text-[#E8272A] text-sm sm:text-base">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= product.low_stock_threshold && (
              <span className="text-[9px] text-amber-700 font-bold uppercase tracking-wide">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Quick 1-Tap Add to Cart Button (Hard Corners) */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center justify-center gap-1.5 bg-[#E8272A] hover:bg-[#CC1A1D] active:scale-95 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-none shadow-xs transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex-shrink-0"
            title="Add to Cart"
          >
            <ShoppingCart size={12} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
