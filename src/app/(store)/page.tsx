'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, Shield, Truck, Star, ChevronRight, Zap, CheckCircle2, Gift, Sparkles } from 'lucide-react'
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



  return (
    <div className="animate-fade-in bg-[#FAFAFA]">
      {/* ─── MOBILE QUICK CATEGORIES BAR (Swipeable Touch Strip) ─── */}
      <div className="md:hidden bg-white border-b border-gray-100 py-3 px-3 overflow-x-auto scrollbar-hide no-scrollbar shadow-2xs">
        <div className="flex items-center gap-3 w-max">
          {categories.map((cat) => {
            const catImg = CATEGORY_IMAGES[cat.slug] || '/images/hero-ladies.jpg'
            return (
              <Link
                key={`mob-${cat.id}`}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-1.5 w-[70px] text-center active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden p-0.5 border-2 border-rose-200/80 shadow-xs bg-white">
                  <img src={catImg} alt={cat.name} className="w-full h-full object-cover rounded-xl" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 leading-tight line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ─── EXACT REFERENCE HERO SECTION (Warm Champagne/Cream) ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE] via-[#FFF3DD] to-[#FFF8EA] border-b border-amber-200/50 py-8 sm:py-12 lg:py-16">
        {/* Subtle decorative sparkles */}
        <div className="absolute top-8 left-12 text-amber-400/50 select-none pointer-events-none">
          <Sparkles size={18} />
        </div>
        <div className="absolute bottom-12 left-1/3 text-amber-400/30 select-none pointer-events-none">
          <Sparkles size={14} />
        </div>
        <div className="absolute top-20 right-1/4 text-amber-400/30 select-none pointer-events-none">
          <Sparkles size={16} />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Active Status Pill */}
                  <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-200/80 shadow-xs mb-5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-extrabold text-gray-800 tracking-wide text-[11px] uppercase">
                      Express Delivery Active in Kinwat
                    </span>
                    <span className="bg-amber-100 text-amber-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full ml-1 flex items-center gap-1">
                      <Clock size={12} className="text-[#E8272A]" />
                      <span>30–45 Mins</span>
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.12] text-[#1E1E24] mb-4">
                    <span>{slide.titleLine1}</span>
                    <br />
                    <span className="bg-gradient-to-r from-[#E8272A] via-[#E03A1E] to-[#E55A00] bg-clip-text text-transparent">
                      {slide.titleLine2}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-gray-600 text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 max-w-xl font-normal">
                    {slide.subtitle}
                  </p>

                  {/* 3 Trust Badges in Pills */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-8 text-xs font-semibold text-gray-800">
                    <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>100% Guaranteed Quality</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                      <Clock size={14} className="text-[#E8272A]" />
                      <span>Kinwat Express in 30–45 Mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                      <Gift size={14} className="text-amber-600" />
                      <span>Complimentary Gift Wrap</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 mb-8">
                    <Link
                      href={slide.buttonHref}
                      className="inline-flex items-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-95"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight size={17} />
                    </Link>

                    <Link
                      href="/category/ladies-fashion"
                      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold text-sm sm:text-base px-7 py-3.5 rounded-full border border-gray-200/90 shadow-xs transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8272A]" />
                      <span>View Express Menu</span>
                    </Link>
                  </div>

                  {/* Social Proof Avatars */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex -space-x-2">
                      <div className="w-7 h-7 rounded-full bg-rose-200 text-rose-800 font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-xs">
                        S
                      </div>
                      <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-800 font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-xs">
                        P
                      </div>
                      <div className="w-7 h-7 rounded-full bg-purple-200 text-purple-800 font-bold text-[11px] flex items-center justify-center border-2 border-white shadow-xs">
                        A
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#8B101E] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                        +4k
                      </div>
                    </div>
                    <span className="text-xs text-gray-700 font-medium">
                      <strong className="font-bold text-gray-900">4,800+</strong> Happy Customers in Kinwat & surrounding talukas
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT COLUMN: FEATURED SPOTLIGHT CARD (Luxury Hard-Corner Silhouette) ── */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-md bg-white rounded-none p-5 sm:p-6 shadow-2xl shadow-stone-900/10 border border-gray-200/90 relative">
                {/* Spotlight Header */}
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-none">
                      Featured Spotlight
                    </span>
                    <h3 className="font-serif font-bold text-gray-950 text-lg mt-1">
                      {slide.spotlightTitle}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2.5 py-1 rounded-none border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>In Stock Today</span>
                  </span>
                </div>

                {/* Uncropped Rectangular Showcase Frame (No circular avatar crop) */}
                <Link
                  href={`/product/${slide.slug}`}
                  className="block relative aspect-[4/3] w-full overflow-hidden bg-gray-100 border border-gray-200 rounded-none group cursor-pointer"
                >
                  <img
                    src={slide.image}
                    alt={slide.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badges on top of card */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#E8272A] text-white text-[11px] font-black px-2.5 py-1 rounded-none uppercase tracking-wider shadow-sm">
                      {slide.discount}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-none shadow-sm border border-white/20">
                      <Clock size={11} className="text-amber-400" />
                      <span>30–45m Kinwat</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 text-gray-900 text-[10px] font-bold px-2.5 py-1 rounded-none shadow-md flex items-center gap-1">
                    <span>View Product</span>
                    <ArrowRight size={11} className="text-[#E8272A]" />
                  </div>
                </Link>

                {/* Product Details & Pricing */}
                <div className="mt-4 pt-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <Link
                      href={`/product/${slide.slug}`}
                      className="font-bold text-gray-950 text-base sm:text-lg leading-snug hover:text-[#E8272A] transition-colors line-clamp-1"
                    >
                      {slide.productName}
                    </Link>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 line-clamp-1">
                    {slide.productDesc}
                  </p>

                  {/* Pricing Bar */}
                  <div className="flex items-center justify-between gap-2 p-3 bg-[#FAF8F5] border border-amber-200/60 rounded-none mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#E8272A]">
                        ₹{slide.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        ₹{slide.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-2 py-0.5 rounded-none">
                      {slide.saveText}
                    </span>
                  </div>

                  {/* Full Width Order Now Action Button */}
                  <Link
                    href={`/product/${slide.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-none transition-all shadow-md shadow-red-500/20 active:scale-[0.99] text-center"
                  >
                    <span>Order Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Architectural Slider Indicators */}
                <div className="flex justify-center items-center gap-2 mt-5 pt-3 border-t border-gray-100">
                  {SPOTLIGHT_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 transition-all duration-300 rounded-none ${
                        i === currentSlide
                          ? 'w-8 bg-[#E8272A]'
                          : 'w-3 bg-gray-200 hover:bg-gray-400'
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
                <div key={i} className="skeleton h-56 rounded-2xl" />
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
                  <div key={i} className="skeleton h-80 rounded-2xl" />
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
                  <div key={i} className="skeleton h-80 rounded-2xl" />
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
