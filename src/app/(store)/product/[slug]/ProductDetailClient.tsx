'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  Zap,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Heart,
  Star,
  MapPin,
  X,
  Clock,
  Award,
  Maximize2,
} from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props {
  product: Product
  relatedProducts: Product[]
}

interface RecentlyViewedItem {
  id: string
  name: string
  price: number
  mrp?: number | null
  image: string
  slug: string
  categoryName?: string
}

const KINWAT_LOCALITIES = [
  'Kinwat Bazar',
  'Ambedkar Chowk',
  'Station Road',
  'Gokul Nagar',
  'Shivaji Nagar',
  'Bodhan Road',
]

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const router = useRouter()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)
  const [quantity, setQuantity] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Kinwat Locality & Pincode Checker
  const [pincodeInput, setPincodeInput] = useState('431804')
  const [deliveryStatus, setDeliveryStatus] = useState<{
    type: 'kinwat' | 'regional' | 'invalid'
    message: string
    subtext: string
  }>({
    type: 'kinwat',
    message: 'Express Delivery in 30–45 mins',
    subtext: 'Free delivery on orders above ₹299 to Kinwat (431804)',
  })

  // Recently Viewed Shelf
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([])

  const isWishlisted = wishlistItems.some((item) => item.productId === product.id)
  const currentPrice = selectedVariant?.price || product.price
  const currentStock = selectedVariant?.stock ?? product.stock

  const discountPercent =
    product.mrp && product.mrp > currentPrice
      ? Math.round(((product.mrp - currentPrice) / product.mrp) * 100)
      : null

  const images = product.images?.length > 0 ? product.images : ['/images/placeholder-product.jpg']

  // Track Recently Viewed
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pari-recently-viewed')
      const existing: RecentlyViewedItem[] = raw ? JSON.parse(raw) : []
      const filtered = existing.filter((item) => item.id !== product.id)

      const currentItem: RecentlyViewedItem = {
        id: product.id,
        name: product.name,
        price: currentPrice,
        mrp: product.mrp,
        image: images[0],
        slug: product.slug,
        categoryName: product.category?.name,
      }

      const updated = [currentItem, ...filtered].slice(0, 10)
      localStorage.setItem('pari-recently-viewed', JSON.stringify(updated))
      setRecentlyViewed(filtered.slice(0, 4))
    } catch {
      // Storage unavailable
    }
  }, [product.id, currentPrice, images, product.name, product.mrp, product.slug, product.category?.name])

  // Pincode & Locality Validation
  const handleCheckPincode = (value?: string) => {
    const val = (value !== undefined ? value : pincodeInput).trim()
    if (!val) {
      setDeliveryStatus({
        type: 'invalid',
        message: 'Please enter a valid pincode or locality',
        subtext: 'Kinwat pincode is 431804',
      })
      return
    }

    const isKinwatLocality = KINWAT_LOCALITIES.some((loc) =>
      loc.toLowerCase().includes(val.toLowerCase())
    )

    if (val === '431804' || isKinwatLocality || val.toLowerCase().includes('kinwat')) {
      setDeliveryStatus({
        type: 'kinwat',
        message: 'Express Delivery in 30–45 mins',
        subtext: `Free doorstep delivery on orders above ₹299 to ${val}`,
      })
    } else if (/^\d{6}$/.test(val)) {
      setDeliveryStatus({
        type: 'regional',
        message: 'Standard Regional Courier: 2–3 Days',
        subtext: `Dispatched from Kinwat Central Hub to pincode ${val} (₹60 flat fee)`,
      })
    } else {
      setDeliveryStatus({
        type: 'invalid',
        message: 'Unrecognized area or pincode',
        subtext: 'Enter 431804 for Kinwat local express delivery',
      })
    }
  }

  const handleAddToCart = () => {
    if (currentStock === 0) {
      toast.error('This product is currently out of stock')
      return
    }
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
    toast.success(`${product.name} added to bag`, { duration: 2000 })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist', { duration: 1500 })
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: currentPrice,
        mrp: product.mrp,
        image: images[0],
        slug: product.slug,
        stock: currentStock,
        categoryName: product.category?.name,
      })
      toast.success('Saved to wishlist', { duration: 1500 })
    }
  }

  return (
    <div className="container-custom max-w-6xl py-6 lg:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-500">Home</Link>
        <span>/</span>
        {product.category && (
          <><Link href={`/category/${product.category.slug}`} className="hover:text-primary-500">{product.category.name}</Link><span>/</span></>
        )}
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-12 items-start">
        {/* Left Column: Images (6 cols) */}
        <div className="lg:col-span-6">
          {/* Main Image Container */}
          <div
            onClick={() => setLightboxOpen(true)}
            className="aspect-square max-h-[480px] sm:max-h-[520px] w-full bg-[#FAF9F6] rounded-none border border-stone-200 overflow-hidden mb-3 relative cursor-pointer select-none flex items-center justify-center p-3 sm:p-5"
            title="Click to view fullscreen"
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-none select-none"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg'
              }}
            />

            {/* Tap to expand indicator */}
            <div className="absolute bottom-3 right-3 bg-white/95 border border-stone-200 px-2 py-1 flex items-center gap-1.5 text-[11px] font-bold text-stone-700 shadow-2xs pointer-events-none opacity-85">
              <Maximize2 size={12} className="text-[#E8272A]" />
              <span className="hidden sm:inline">Tap to expand</span>
            </div>

            {/* Sold Out Overlay */}
            {currentStock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none z-20">
                <span className="bg-white text-gray-950 font-black px-6 py-3 rounded-none text-sm uppercase tracking-widest">
                  Sold Out
                </span>
              </div>
            )}

            {/* Discount Badge */}
            {discountPercent && (
              <div className="absolute top-3 left-3 bg-[#E8272A] text-white text-[11px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider shadow-xs z-10 pointer-events-none">
                {discountPercent}% OFF
              </div>
            )}

            {/* Carousel Nav Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-none shadow-xs flex items-center justify-center hover:bg-white border border-gray-200 text-gray-700 transition-colors z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImage((prev) => (prev + 1) % images.length)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/95 rounded-none shadow-xs flex items-center justify-center hover:bg-white border border-gray-200 text-gray-700 transition-colors z-20"
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-none overflow-hidden border-2 transition-all p-1 flex items-center justify-center ${
                    i === selectedImage ? 'border-[#E8272A] shadow-2xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} preview ${i + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-none"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            {/* Category & Badge */}
            {product.category && (
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#E8272A] mb-1.5">
                {product.category.name}
              </div>
            )}

            {/* Product Title */}
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Rating Summary Bar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-black text-gray-900">4.9</span>
              <span className="text-xs text-gray-400 font-medium">• 48 Kinwat ratings</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-black text-[#E8272A] tracking-tight">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > currentPrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through font-medium">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-2 py-0.5 rounded-none uppercase">
                  Save ₹{(product.mrp! - currentPrice).toLocaleString('en-IN')} ({discountPercent}% OFF)
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentStock === 0
                    ? 'bg-rose-500'
                    : currentStock <= 5
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span
                className={
                  currentStock === 0
                    ? 'text-rose-600'
                    : currentStock <= 5
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }
              >
                {currentStock === 0
                  ? 'Currently Out of Stock'
                  : currentStock <= 5
                  ? `Hurry, only ${currentStock} units remaining!`
                  : 'In Stock • Ready for immediate delivery'}
              </span>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2">
                  Select Option:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v: any) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedVariant?.id === v.id
                          ? 'border-[#E8272A] bg-rose-50 text-[#E8272A]'
                          : 'border-gray-200 text-gray-800 hover:border-gray-400'
                      }`}
                    >
                      {v.name}
                      {v.price && v.price !== product.price && ` (+₹${(v.price - product.price).toFixed(0)})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div className="mb-6">
              <p className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-2">
                Quantity:
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-950 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="font-black text-sm w-10 text-center text-gray-950 select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-950 transition-colors disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Subtotal: <strong className="text-gray-900">₹{(currentPrice * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons with Wishlist Integration */}
            <div className="flex gap-2.5 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentStock === 0}
                className="flex-1 py-3.5 px-4 bg-white border-2 border-[#E8272A] text-[#E8272A] hover:bg-rose-50 font-black text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-xs"
              >
                <ShoppingCart size={16} /> Add to Bag
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="flex-1 py-3.5 px-4 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-xs"
              >
                <Zap size={16} /> Buy Now
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-12 flex-shrink-0 flex items-center justify-center border-2 rounded-none transition-all active:scale-95 ${
                  isWishlisted
                    ? 'border-[#E8272A] bg-rose-50 text-[#E8272A]'
                    : 'border-gray-200 text-gray-500 hover:text-[#E8272A] hover:border-gray-400'
                }`}
                title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? 'fill-[#E8272A] text-[#E8272A]' : ''}
                />
              </button>
            </div>

            {/* Kinwat Locality & Pincode Checker */}
            <div className="bg-[#FAF9F6] border border-gray-200 rounded-none p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={15} className="text-[#E8272A]" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Check Kinwat Delivery
                </span>
              </div>

              <div className="flex gap-2 mb-2.5">
                <input
                  type="text"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode()}
                  placeholder="Enter Kinwat Area / 431804"
                  className="flex-1 text-xs font-bold uppercase tracking-wider px-3 py-2 bg-white border border-gray-300 rounded-none focus:outline-none focus:border-[#E8272A]"
                />
                <button
                  type="button"
                  onClick={() => handleCheckPincode()}
                  className="bg-gray-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-none transition-colors"
                >
                  Check
                </button>
              </div>

              {/* Quick Area Chips */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {KINWAT_LOCALITIES.map((locality) => (
                  <button
                    type="button"
                    key={locality}
                    onClick={() => {
                      setPincodeInput(locality)
                      handleCheckPincode(locality)
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-200 hover:border-gray-900 rounded-none text-gray-700 transition-colors"
                  >
                    {locality}
                  </button>
                ))}
              </div>

              {/* Status Outcome */}
              <div
                className={`p-2.5 rounded-none border text-xs ${
                  deliveryStatus.type === 'kinwat'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : deliveryStatus.type === 'regional'
                    ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-black uppercase tracking-wider mb-0.5">
                  <Clock size={13} className={deliveryStatus.type === 'kinwat' ? 'text-emerald-600' : 'text-blue-600'} />
                  <span>{deliveryStatus.message}</span>
                </div>
                <p className="text-[11px] font-medium text-gray-700">
                  {deliveryStatus.subtext}
                </p>
              </div>
            </div>

            {/* Store Guarantee & Perks */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {[
                {
                  icon: Zap,
                  text: '30–45 min express delivery in Kinwat (10 AM – 8 PM)',
                  bold: true,
                },
                {
                  icon: Truck,
                  text: 'Free doorstep delivery on orders above ₹299 (Else ₹40 standard fee)',
                },
                {
                  icon: RotateCcw,
                  text: '24-Hour exchange guarantee at Kinwat shop counter or doorstep pickup',
                },
                {
                  icon: ShieldCheck,
                  text: 'Pay on delivery via Cash or instant UPI Scanner (GPay, PhonePe, Paytm)',
                },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                    <Icon size={15} className="text-[#E8272A] flex-shrink-0" />
                    <span className={item.bold ? 'font-bold text-gray-950' : 'font-medium'}>
                      {item.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="bg-white border border-gray-200 rounded-none p-6 sm:p-8 mb-12">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Award size={18} className="text-[#E8272A]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-gray-900">
              Product Details & Specifications
            </h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line font-normal">
            {product.description}
          </p>
        </div>
      )}

      {/* Customer Reviews & Star Distribution Breakdown */}
      <div className="bg-white border border-gray-200 rounded-none p-6 sm:p-8 mb-12">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-gray-900">
              Customer Ratings & Reviews
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Verified buyers from Kinwat and surrounding areas
            </p>
          </div>
          <span className="text-xs font-black uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1">
            4.9 / 5.0 Rating
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 pb-8 border-b border-gray-100">
          {/* Left: Star Aggregate (4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
            <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">4.9</div>
            <div className="flex items-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Based on 48 verified purchases in Kinwat
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Product Quality</span>
                <span className="font-bold text-gray-900">99%</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Punctuality</span>
                <span className="font-bold text-gray-900">98%</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Packaging Care</span>
                <span className="font-bold text-gray-900">100%</span>
              </div>
            </div>
          </div>

          {/* Center: Rating Distribution Bars (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
            {[
              { star: 5, pct: 92, count: 44 },
              { star: 4, pct: 6, count: 3 },
              { star: 3, pct: 2, count: 1 },
              { star: 2, pct: 0, count: 0 },
              { star: 1, pct: 0, count: 0 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-3 text-xs">
                <span className="font-bold text-gray-700 w-12 flex-shrink-0">
                  {row.star} Stars
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-none transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-gray-400 font-mono w-10 text-right">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Pooja Deshmukh',
              location: 'Kinwat Bazar',
              date: '2 days ago',
              rating: 5,
              text: 'The quality is fantastic and arrived carefully packaged in just 35 minutes. It feels like buying directly from the shop counter without leaving home.',
            },
            {
              name: 'Anand Rathod',
              location: 'Station Road, Kinwat',
              date: '1 week ago',
              rating: 5,
              text: 'Accurate description and premium material. The fast doorstep delivery with UPI payment scanner on delivery was super convenient.',
            },
            {
              name: 'Sneha Kulkarni',
              location: 'Ambedkar Chowk, Kinwat',
              date: '2 weeks ago',
              rating: 5,
              text: 'Always reliable for festive shopping and gifts. The gift wrapping is elegant and neat. Best retail store experience in Kinwat.',
            },
          ].map((review, i) => (
            <div
              key={i}
              className="p-4 bg-[#FAF9F6] border border-gray-200 rounded-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(review.rating)].map((_, s) => (
                      <Star key={s} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {review.date}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed font-normal mb-3">
                  "{review.text}"
                </p>
              </div>

              <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">{review.name}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{review.location}</div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed Shelf */}
      {recentlyViewed.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-900">
                Recently Viewed by You
              </h2>
              <p className="text-xs text-gray-500">Pick up right where you left off</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewed.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                className="group block bg-white border border-gray-200 hover:border-gray-900 rounded-none p-3 transition-all"
              >
                <div className="aspect-square bg-[#FAF9F6] rounded-none overflow-hidden mb-2 flex items-center justify-center p-2 border border-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain rounded-none select-none"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg'
                    }}
                  />
                </div>
                {item.categoryName && (
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider line-clamp-1 mb-0.5">
                    {item.categoryName}
                  </p>
                )}
                <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#E8272A] transition-colors mb-1">
                  {item.name}
                </h3>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-black text-[#E8272A]">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  {item.mrp && item.mrp > item.price && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{item.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-gray-900">
                You Might Also Like
              </h2>
              <p className="text-xs text-gray-500">Handpicked recommendations for you</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-none flex items-center justify-center transition-colors z-10"
            aria-label="Close fullscreen preview"
          >
            <X size={20} />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-none shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-none flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-none flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
