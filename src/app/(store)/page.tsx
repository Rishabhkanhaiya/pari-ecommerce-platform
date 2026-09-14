'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  Star,
  ChevronRight,
  Zap,
  Gift,
  MapPin,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Category } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import { useCart } from '@/store/cart'
import toast from 'react-hot-toast'

const CATEGORY_IMAGES: Record<string, string> = {
  'ladies-fashion': '/images/hero-ladies.jpg',
  'jewellery': '/images/products/kundan-necklace.jpg',
  'cosmetics-beauty': '/images/products/matte-lipstick.jpg',
  'toys-games': '/images/products/rc-car.jpg',
  'gifts-accessories': '/images/products/scented-candles.jpg',
}

const SPOTLIGHT_SLIDES = [
  {
    productId: 'spotlight-kundan-necklace',
    titleLine1: 'Sparkling Jewellery &',
    titleLine2: 'Festive Fashion Elegance',
    subtitle:
      'Discover bridal necklace sets, hand-cut glass bangles, luxury cosmetics kits, and bespoke personalized gifts delivered directly to your doorstep in Kinwat.',
    buttonText: 'Explore Jewellery',
    buttonHref: '/category/jewellery',
    spotlightTitle: 'Kinwat Festive Special',
    productName: 'Royal Bridal Chuda & Kundan Set',
    productDesc: 'High-grade gold finish with velvet storage box',
    price: 749,
    mrp: 1199,
    discount: '35% OFF',
    saveText: 'Save ₹450',
    image: '/images/products/kundan-necklace.jpg',
    urgencyText: 'Need it urgently for a function? Order now & get delivery in 30–45 minutes in Kinwat!',
    slug: 'kundan-choker-necklace-set',
  },
  {
    productId: 'spotlight-anarkali-kurti',
    titleLine1: 'Designer Kurtis &',
    titleLine2: 'Festive Anarkali Sets',
    subtitle:
      'Pure rayon and georgette party wear suits with intricate hand embroidery, matching dupattas and festive lehengas in stock now.',
    buttonText: 'Shop Ladies Fashion',
    buttonHref: '/category/ladies-fashion',
    spotlightTitle: 'Bestseller of the Week',
    productName: 'Anarkali Kurti Set with Dupatta',
    productDesc: 'Premium floral rayon with matching churidar & dupatta',
    price: 899,
    mrp: 1499,
    discount: '40% OFF',
    saveText: 'Save ₹600',
    image: '/images/products/anarkali-kurti.jpg',
    urgencyText: 'Festival or wedding today? We deliver freshly pressed garments in 30–45 mins!',
    slug: 'anarkali-kurti-set-with-dupatta',
  },
  {
    productId: 'spotlight-bandhani-saree',
    titleLine1: 'Traditional Sarees &',
    titleLine2: 'Royal Bridal Drapes',
    subtitle:
      'Authentic Rajasthani Bandhani prints, Chanderi silks, and daily comfort cotton sarees with unstitched matching blouse pieces.',
    buttonText: 'View Sarees Collection',
    buttonHref: '/category/ladies-fashion',
    spotlightTitle: 'Handcrafted Heritage',
    productName: 'Bandhani Print Georgette Saree',
    productDesc: 'Soft georgette with authentic tie-dye & zari border',
    price: 1250,
    mrp: 1999,
    discount: '37% OFF',
    saveText: 'Save ₹749',
    image: '/images/products/bandhani-saree.jpg',
    urgencyText: 'Gift ready packaging included with every saree order in Kinwat!',
    slug: 'bandhani-print-georgette-saree',
  },
]

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { addItem } = useCart()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function fetchData() {
      const [{ data: cats }, { data: featured }, { data: newArr }] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .is('parent_id', null)
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('products')
          .select('*, category:categories(name, slug)')
          .eq('is_active', true)
          .eq('is_featured', true)
          .limit(8),
        supabase
          .from('products')
          .select('*, category:categories(name, slug)')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      setCategories(cats || [])
      setFeaturedProducts(featured || [])
      setNewArrivals(newArr || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const slide = SPOTLIGHT_SLIDES[currentSlide]

  const handleQuickAddToCart = (slideItem: (typeof SPOTLIGHT_SLIDES)[0]) => {
    addItem({
      productId: slideItem.productId,
      name: slideItem.productName,
      image: slideItem.image,
      price: slideItem.price,
      quantity: 1,
      stock: 12,
      slug: slideItem.slug,
    })
    toast.success(`${slideItem.productName} added to bag`, { duration: 2000 })
  }

  return (
    <div className="animate-fade-in bg-[#FAF9F6]">
      {/* ─── MOBILE QUICK CATEGORIES BAR (Swipeable Touch Strip) ─── */}
      <div className="md:hidden bg-white border-b border-stone-200 py-3 px-3 overflow-x-auto scrollbar-hide no-scrollbar shadow-2xs">
        <div className="flex items-center gap-2.5 w-max">
          {categories.map((cat) => {
            const catImg = CATEGORY_IMAGES[cat.slug] || '/images/hero-ladies.jpg'
            return (
              <Link
                key={`mob-${cat.id}`}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 w-[68px] text-center active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 rounded-none overflow-hidden p-0.5 border border-stone-200 bg-white shadow-2xs">
                  <img src={catImg} alt={cat.name} className="w-full h-full object-cover rounded-none" />
                </div>
                <span className="text-[10px] font-bold text-stone-800 leading-tight line-clamp-1 uppercase tracking-wider">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─── REFINED LUXURY HERO SECTION (Warm Alabaster / Stone) ─── */}
      <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-stone-200/80 py-8 sm:py-10 lg:py-12">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* ── LEFT COLUMN: EDITORIAL HERO ── */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Kinwat Express Active Tag */}
                  <div className="inline-flex items-center gap-2 bg-white border border-stone-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-800 shadow-2xs mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Kinwat Express Dispatch</span>
                    <span className="text-stone-300">|</span>
                    <span className="text-[#E8272A] flex items-center gap-1">
                      <Clock size={12} />
                      <span>30–45 Mins Delivery</span>
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.14] text-stone-950 mb-3 tracking-tight">
                    <span>{slide.titleLine1}</span>{' '}
                    <span className="text-[#E8272A] italic">{slide.titleLine2}</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-stone-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed mb-5 max-w-xl font-normal">
                    {slide.subtitle}
                  </p>

                  {/* Architectural 3-Column Trust Strip with Hairline Dividers */}
                  <div className="grid grid-cols-3 border-y border-stone-200/80 py-3 mb-6 text-left max-w-lg bg-stone-50/50 px-2">
                    <div className="border-r border-stone-200 pr-3 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#E8272A] flex-shrink-0" />
                      <div>
                        <div className="text-[11px] font-black uppercase text-stone-950">100% Genuine</div>
                        <div className="text-[10px] text-stone-500 font-medium">Direct Shop Stock</div>
                      </div>
                    </div>
                    <div className="border-r border-stone-200 px-3 flex items-center gap-2">
                      <Clock size={16} className="text-[#E8272A] flex-shrink-0" />
                      <div>
                        <div className="text-[11px] font-black uppercase text-stone-950">30–45 Mins</div>
                        <div className="text-[10px] text-stone-500 font-medium">Kinwat Express</div>
                      </div>
                    </div>
                    <div className="pl-3 flex items-center gap-2">
                      <Truck size={16} className="text-[#E8272A] flex-shrink-0" />
                      <div>
                        <div className="text-[11px] font-black uppercase text-stone-950">Free &gt; ₹299</div>
                        <div className="text-[10px] text-stone-500 font-medium">Cash / UPI QR</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons (Architectural Hard Corners) */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Link
                      href={slide.buttonHref}
                      className="inline-flex items-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-widest px-7 py-3.5 rounded-none transition-all shadow-md shadow-red-500/20 active:scale-95"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight size={15} />
                    </Link>

                    <Link
                      href="/category/ladies-fashion"
                      className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-none border border-stone-300 hover:border-stone-900 transition-colors"
                    >
                      <span>View Express Menu</span>
                    </Link>
                  </div>

                  {/* Social Proof & Rating Credibility */}
                  <div className="flex items-center gap-2.5 text-xs text-stone-600 font-medium">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-stone-900">4.9 / 5.0</span>
                    <span className="text-stone-300">•</span>
                    <span>4,800+ Kinwat families served</span>
                    <span className="text-stone-300 hidden sm:inline">•</span>
                    <span className="text-emerald-700 font-bold hidden sm:inline flex items-center gap-1">
                      <MapPin size={11} /> Kinwat Bazar Local Store
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT COLUMN: BALANCED SPOTLIGHT SHOWCASE CARD ── */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm lg:max-w-md bg-white rounded-none p-4 sm:p-5 shadow-xl shadow-stone-900/5 border border-stone-200 relative">
                {/* Spotlight Header */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-none">
                      Featured Spotlight
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                      {slide.spotlightTitle}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-none border border-emerald-200 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock</span>
                  </span>
                </div>

                {/* Streamlined Showcase Frame (Proportioned to avoid viewport overflow) */}
                <Link
                  href={`/product/${slide.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-stone-100 border border-stone-200 rounded-none group cursor-pointer"
                >
                  <img
                    src={slide.image}
                    alt={slide.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Badges on top of card */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#E8272A] text-white text-[10px] font-black px-2 py-0.5 rounded-none uppercase tracking-wider shadow-2xs">
                      {slide.discount}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-none shadow-2xs border border-white/20">
                      <Clock size={10} className="text-amber-400" />
                      <span>30–45m Kinwat</span>
                    </span>
                  </div>
                </Link>

                {/* Product Details & Pricing */}
                <div className="mt-3">
                  <Link
                    href={`/product/${slide.slug}`}
                    className="block font-bold text-stone-950 text-sm sm:text-base leading-snug hover:text-[#E8272A] transition-colors truncate"
                  >
                    {slide.productName}
                  </Link>

                  <p className="text-[11px] text-stone-500 mb-2.5 truncate font-normal">
                    {slide.productDesc}
                  </p>

                  {/* Pricing Bar */}
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-none mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-[#E8272A]">
                        ₹{slide.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{slide.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-none">
                      {slide.saveText}
                    </span>
                  </div>

                  {/* Dual 1-Click Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickAddToCart(slide)}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-[11px] uppercase tracking-wider py-2.5 rounded-none transition-all shadow-xs active:scale-95 cursor-pointer"
                      title="Add to Shopping Bag"
                    >
                      <ShoppingCart size={13} />
                      <span>Add to Bag</span>
                    </button>
                    <Link
                      href={`/product/${slide.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 border border-stone-300 hover:border-stone-900 bg-white hover:bg-stone-50 text-stone-900 font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-none transition-colors text-center"
                    >
                      <span>Order Now</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Architectural Slider Indicators */}
                <div className="flex justify-center items-center gap-1.5 mt-3 pt-2.5 border-t border-stone-100">
                  {SPOTLIGHT_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1 transition-all duration-300 rounded-none cursor-pointer ${
                        i === currentSlide
                          ? 'w-7 bg-[#E8272A]'
                          : 'w-2.5 bg-stone-200 hover:bg-stone-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── CATEGORIES GRID (With Real Photos) ─── */}
      <section className="py-14 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Explore our handpicked local Kinwat inventory</p>
            </div>
            <Link href="/category/ladies-fashion" className="flex items-center gap-1 text-[#E8272A] font-bold text-sm hover:underline">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-56 rounded-none" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {categories.map((cat, index) => {
                const catImg = CATEGORY_IMAGES[cat.slug] || '/images/hero-ladies.jpg'
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <Link
                      href={`/category/${cat.slug}`}
                      className="group relative block rounded-none overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 border border-gray-200/90 hover:border-gray-900 bg-gray-900"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src={catImg}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-base leading-snug drop-shadow group-hover:text-amber-300 transition-colors">
                              {cat.name}
                            </h3>
                            <span className="w-7 h-7 rounded-none bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white group-hover:bg-[#E8272A] group-hover:border-[#E8272A] transition-colors flex-shrink-0">
                              <ArrowRight size={13} />
                            </span>
                          </div>
                          <p className="text-xs text-white/80 line-clamp-1">
                            {cat.description || 'Explore collection'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── FEATURED HOT DEALS (Real Products) ─── */}
      {(loading || featuredProducts.length > 0) && (
        <section className="py-14 bg-gray-50/80 border-t border-gray-100">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Featured Best Sellers</h2>
                <p className="text-gray-500 text-sm mt-1">Most popular items ordered in Kinwat this week</p>
              </div>
              <Link href="/category/ladies-fashion" className="flex items-center gap-1 text-[#E8272A] font-bold text-sm hover:underline">
                View All Products <ChevronRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton h-80 rounded-none" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 30-MIN DELIVERY PROMISE BANNER (Modern Luxury Hard-Corner Layout) ─── */}
      <section className="py-12 sm:py-16 bg-[#FAFAFA]">
        <div className="container-custom">
          <div className="relative bg-[#141216] border border-neutral-800 rounded-none overflow-hidden shadow-2xl">
            {/* Subtle ambient light glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E8272A]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14 relative z-10">
              {/* Left Column: Editorial Copy */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 border border-amber-500/40 bg-amber-500/10 text-amber-300 px-3 py-1 rounded-none text-[11px] font-black uppercase tracking-widest mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Kinwat Express Dispatch</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white font-bold">30–45 Mins</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-bold text-white leading-[1.15] mb-4">
                  Need It In A Hurry?
                  <br />
                  <span className="bg-gradient-to-r from-[#FF4D50] via-[#F43F5E] to-[#FB923C] bg-clip-text text-transparent">
                    Delivered In 30–45 Minutes.
                  </span>
                </h2>

                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-normal">
                  From emergency party cosmetics and royal jewellery to festive dresses and customized gift hampers — order online and get rapid doorstep delivery across Kinwat Bazar & surrounding areas.
                </p>

                {/* 3 Crisp Architectural Perks */}
                <div className="grid grid-cols-3 gap-3 pt-4 pb-8 border-t border-neutral-800 text-left max-w-lg">
                  <div className="border-l border-[#E8272A] pl-3">
                    <div className="text-white font-black text-xs uppercase tracking-wider">30–45 Mins</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Average drop time</div>
                  </div>
                  <div className="border-l border-amber-500 pl-3">
                    <div className="text-white font-black text-xs uppercase tracking-wider">Free &gt; ₹299</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Zero delivery fee</div>
                  </div>
                  <div className="border-l border-emerald-500 pl-3">
                    <div className="text-white font-black text-xs uppercase tracking-wider">COD &amp; UPI</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Pay upon handover</div>
                  </div>
                </div>

                {/* Action Buttons with Hard Corners */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/category/ladies-fashion"
                    className="inline-flex items-center justify-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-none transition-all shadow-lg hover:shadow-red-600/30 active:scale-95"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight size={15} />
                  </Link>

                  <Link
                    href="/category/jewellery"
                    className="inline-flex items-center justify-center gap-2 border border-neutral-700 hover:border-white text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-none transition-colors hover:bg-white/5"
                  >
                    <span>Explore Jewellery &amp; Gifts</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Visual Product Showcase with Hard Corners */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Main Display Frame */}
                  <div className="relative aspect-[4/3] sm:aspect-square rounded-none overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl group">
                    <img
                      src="/images/products/kundan-necklace.jpg"
                      alt="Kinwat Express Delivery"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                    {/* Top Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#E8272A] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-none shadow-sm">
                        30–45m Local Express
                      </span>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Pari Gift Center</div>
                        <div className="text-sm font-bold text-white">Live Store Stock • Kinwat Bazar</div>
                      </div>
                      <span className="text-xs text-white/90 font-mono font-bold bg-white/10 px-2 py-1 border border-white/20">
                        Open Now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FRESH NEW ARRIVALS ─── */}
      {(loading || newArrivals.length > 0) && (
        <section className="py-14 bg-gray-50/80 border-t border-gray-100">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">Fresh New Arrivals</h2>
                <p className="text-gray-500 text-sm mt-1">Just arrived in our Kinwat shop inventory</p>
              </div>
              <Link href="/category/ladies-fashion" className="flex items-center gap-1 text-[#E8272A] font-bold text-sm hover:underline">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton h-80 rounded-none" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {newArrivals.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
