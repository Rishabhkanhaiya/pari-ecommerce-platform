'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Menu, X, User, MapPin, ChevronDown, Heart, Phone, Sparkles, Zap } from 'lucide-react'
import Logo from '@/components/common/Logo'
import SearchBar from '@/components/layout/SearchBar'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import CartDrawer from '@/components/cart/CartDrawer'
import WishlistDrawer from '@/components/wishlist/WishlistDrawer'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const { getTotalItems, getTotalPrice, openDrawer: openCartDrawer } = useCart()
  const { getTotalItems: getWishlistCount, openDrawer: openWishlistDrawer } = useWishlist()
  const cartCount = getTotalItems()
  const cartTotal = getTotalPrice()
  const wishlistCount = getWishlistCount()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        setUser(profile)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setUser(profile)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const navCategories = [
    { name: 'Ladies Fashion', href: '/category/ladies-fashion', badge: 'New' },
    { name: 'Jewellery & Bangles', href: '/category/jewellery', hasDropdown: true },
    { name: 'Cosmetics & Beauty', href: '/category/cosmetics-beauty' },
    { name: 'Toys & Kids Store', href: '/category/toys-games' },
    { name: 'Custom Gifts & Hampers', href: '/category/gifts-accessories' },
    { name: "Today's Deals", href: '/category/ladies-fashion', isDeal: true },
  ]

  return (
    <>
      {/* ─── 1. TOP ANNOUNCEMENT BAR (Regal Onyx & Ruby) ─── */}
      <div className="bg-[#181113] text-white text-xs py-2 px-3 sm:px-4 border-b border-white/10">
        <div className="container-custom flex items-center justify-between gap-2">
          {/* Left: Express Pill + Delivery info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial">
            <span className="inline-flex items-center gap-1 border border-[#E8272A]/50 bg-[#E8272A]/20 px-2 py-0.5 rounded-none text-[10px] sm:text-[11px] font-black tracking-wider uppercase flex-shrink-0 text-rose-200">
              <Zap size={11} className="text-amber-300" />
              <span>Express Store</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs truncate text-stone-200">
              <span>30–45 Mins Express Delivery in <strong className="font-bold text-white">Kinwat</strong></span>
              <span className="hidden sm:inline">& nearby areas</span>
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline text-stone-300 text-xs font-normal">
              Free delivery on orders above ₹299
            </span>
          </div>

          {/* Right: Contact & Location */}
          <div className="hidden lg:flex items-center gap-4 text-stone-300 font-medium text-[11px]">
            <a href="tel:+919422000000" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={12} className="text-amber-400" />
              <span>Call Support: +91 94220 00000</span>
            </a>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1 text-stone-200">
              <MapPin size={12} className="text-rose-400" />
              <span>In Kinwat, MH</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN NAVBAR ─── */}
      <header className="sticky top-0 z-50 bg-white shadow-xs border-b border-stone-200">
        <div className="container-custom py-3 sm:py-3.5">
          <div className="flex items-center justify-between gap-3 md:gap-6">
            {/* Modern Logo */}
            <Logo size="md" />

            {/* Delivering To Widget (Architectural Hard Corners) */}
            <div className="hidden xl:flex items-center gap-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-none cursor-pointer transition-colors flex-shrink-0">
              <div className="w-7 h-7 rounded-none bg-rose-50 border border-rose-200 flex items-center justify-center text-[#E8272A] flex-shrink-0">
                <MapPin size={13} className="text-[#E8272A]" />
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="text-[9px] text-stone-400 font-extrabold uppercase tracking-widest">Delivering To</div>
                <div className="font-bold text-stone-900 flex items-center gap-1">
                  <span>Kinwat Bazar, 431804</span>
                  <ChevronDown size={12} className="text-stone-400" />
                </div>
              </div>
            </div>

            {/* Optimized Search Bar with Live Suggestions */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchBar />
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Wishlist Button */}
              <button
                onClick={openWishlistDrawer}
                className="relative p-2 text-stone-700 hover:text-[#E8272A] hover:bg-rose-50 transition-colors hidden sm:flex items-center justify-center border border-stone-200 rounded-none cursor-pointer"
                title="Saved Items"
                aria-label="View Wishlist"
              >
                <Heart size={18} className={wishlistCount > 0 ? 'text-[#E8272A] fill-[#E8272A]' : 'text-stone-700'} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-[#E8272A] text-white text-[9px] font-black rounded-none px-1 flex items-center justify-center shadow-2xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* User Account / Sign In */}
              <Link
                href={user ? '/account' : '/login'}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-stone-800 hover:text-[#E8272A] hover:bg-stone-50 transition-colors border border-stone-200 rounded-none"
              >
                <User size={16} />
                <span className="hidden sm:inline">
                  {user ? (user.name || 'Account') : 'Sign In'}
                </span>
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={openCartDrawer}
                className="flex items-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white text-xs font-black uppercase tracking-wider px-3.5 sm:px-4 py-2 rounded-none transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Open Shopping Bag"
                aria-label="Open Shopping Bag"
              >
                <div className="relative">
                  <ShoppingCart size={15} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 text-gray-950 text-[10px] font-black rounded-none flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Bag: ₹{cartTotal > 0 ? cartTotal.toLocaleString('en-IN') : 0}</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-none"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile search bar with live autocomplete */}
          <div className="mt-3 md:hidden">
            <SearchBar isMobile placeholder="Search jewellery, gifts, kurtis..." />
          </div>
        </div>

        {/* ─── 3. SUB-NAVIGATION CATEGORIES BAR ─── */}
        <div className="border-t border-stone-200/80 bg-white hidden md:block">
          <div className="container-custom">
            <nav className="flex items-center gap-6 overflow-x-auto py-2 text-xs font-semibold whitespace-nowrap scrollbar-hide no-scrollbar">
              {navCategories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 py-1 transition-colors ${
                    item.isDeal
                      ? 'text-[#E8272A] hover:text-[#CC1A1D] font-black uppercase tracking-wider ml-auto'
                      : 'text-stone-700 hover:text-[#E8272A]'
                  }`}
                >
                  {item.isDeal && <Zap size={12} className="text-[#E8272A]" />}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-rose-100 text-[#E8272A] text-[9px] font-black px-1.5 py-0.2 rounded-none uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.hasDropdown && <ChevronDown size={12} className="text-stone-400" />}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white py-3 px-4 shadow-lg animate-fade-in">
            <nav className="flex flex-col gap-2 text-sm font-semibold">
              {navCategories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 px-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#E8272A] flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-rose-100 text-[#E8272A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-1 space-y-1">
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    openWishlistDrawer()
                  }}
                  className="w-full text-left py-2 px-3 rounded-none text-gray-700 hover:bg-rose-50 hover:text-[#E8272A] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Heart size={16} />
                    <span>My Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-[#E8272A] text-white text-[10px] font-black px-1.5 py-0.2">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                <Link
                  href={user ? '/account' : '/login'}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 px-3 rounded-none text-gray-700 hover:bg-rose-50 hover:text-[#E8272A] flex items-center gap-2"
                >
                  <User size={16} />
                  <span>{user ? 'My Profile & Orders' : 'Sign In / Register'}</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Slide-Over Drawers */}
      <CartDrawer />
      <WishlistDrawer />
    </>
  )
}
