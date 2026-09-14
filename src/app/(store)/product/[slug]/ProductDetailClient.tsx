'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Zap, Check, Minus, Plus, ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem } = useCart()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)

  const currentPrice = selectedVariant?.price || product.price
  const currentStock = selectedVariant?.stock ?? product.stock

  const discountPercent = product.mrp && product.mrp > currentPrice
    ? Math.round(((product.mrp - currentPrice) / product.mrp) * 100)
    : null

  const images = product.images?.length > 0 ? product.images : ['/images/placeholder-product.jpg']

  const handleAddToCart = () => {
    if (currentStock === 0) { toast.error('Out of stock'); return }
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantName: selectedVariant?.name,
      image: images[0],
      price: currentPrice,
      quantity,
      stock: currentStock,
      slug: product.slug,
    })
    toast.success('Added to cart successfully')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-500">Home</Link>
        <span>/</span>
        {product.category && (
          <><Link href={`/category/${product.category.slug}`} className="hover:text-primary-500">{product.category.name}</Link><span>/</span></>
        )}
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-none border border-gray-200 overflow-hidden mb-3 relative">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = '/images/placeholder-product.jpg')}
            />
            {currentStock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-950 font-black px-6 py-3 rounded-none text-base uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
            {discountPercent && (
              <div className="absolute top-4 left-4 bg-[#E8272A] text-white text-xs font-black px-3 py-1 rounded-none uppercase tracking-wider shadow-sm">
                -{discountPercent}% OFF
              </div>
            )}
            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-none shadow flex items-center justify-center hover:bg-white border border-gray-200"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-none shadow flex items-center justify-center hover:bg-white border border-gray-200"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-none overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-[#E8272A]' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = '/images/placeholder-product.jpg')}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="text-sm text-primary-500 font-medium mb-1">{product.category?.name}</div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">₹{currentPrice.toLocaleString('en-IN')}</span>
            {product.mrp && product.mrp > currentPrice && (
              <span className="text-xl text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
            {discountPercent && (
              <span className="badge bg-green-100 text-green-700 text-sm font-bold">{discountPercent}% OFF</span>
            )}
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2 mb-5 text-sm font-medium ${
            currentStock === 0 ? 'text-red-500' : currentStock <= 5 ? 'text-orange-500' : 'text-green-600'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              currentStock === 0 ? 'bg-red-500' : currentStock <= 5 ? 'bg-orange-500' : 'bg-green-500'
            }`} />
            {currentStock === 0 ? 'Out of Stock' : currentStock <= 5 ? `Only ${currentStock} left!` : 'In Stock'}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Select Option:</p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.id === v.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {v.name}
                    {v.price && v.price !== product.price && ` (+₹${(v.price - product.price).toFixed(0)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Quantity:</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-primary-300 transition-colors">
                <Minus size={16} />
              </button>
              <span className="font-bold text-xl w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={quantity >= currentStock}
                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-primary-300 transition-colors disabled:opacity-40">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className="flex-1 py-4 px-6 border-2 border-[#E8272A] text-[#E8272A] hover:bg-rose-50 font-black text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
            >
              <ShoppingCart size={17} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={currentStock === 0}
              className="flex-1 py-4 px-6 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/25 disabled:opacity-50 active:scale-95"
            >
              <Zap size={17} /> Buy Now
            </button>
          </div>

          {/* Delivery & Trust Perks */}
          <div className="bg-[#FAF9F6] border border-amber-200/70 rounded-none p-4 space-y-2.5">
            {[
              {
                icon: Zap,
                text: '30–45 min express delivery in Kinwat (10 AM – 8 PM)',
                highlight: true,
                color: 'text-[#E8272A]',
              },
              {
                icon: Truck,
                text: 'Free delivery on orders above ₹299 (Else ₹40 standard fee)',
                color: 'text-gray-600',
              },
              {
                icon: RotateCcw,
                text: '24-Hour exchange guarantee (Free at shop counter or ₹40 pickup)',
                color: 'text-gray-600',
              },
              {
                icon: ShieldCheck,
                text: 'Cash on Delivery or UPI Scanner at doorstep',
                color: 'text-emerald-600',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.text} className="flex items-center gap-2.5 text-xs text-gray-700 font-medium">
                  <Icon size={16} className={`flex-shrink-0 ${item.color}`} />
                  <span className={item.highlight ? 'font-bold text-gray-950' : ''}>{item.text}</span>
                </div>
              )
            })}
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="section-title mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
