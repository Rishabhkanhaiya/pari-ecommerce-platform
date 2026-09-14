'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingCart, Search, Menu, X, User, MapPin, ChevronDown, Heart, Phone, Sparkles, Zap } from 'lucide-react'
import Logo from '@/components/common/Logo'
import SearchBar from '@/components/layout/SearchBar'
import { useCart } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const { getTotalItems, getTotalPrice } = useCart()
  const cartCount = getTotalItems()
  const cartTotal = getTotalPrice()

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
      {/* ─── 1. TOP ANNOUNCEMENT BAR (Burgundy Red) ─── */}
      <div className="bg-[#780A16] text-white text-xs py-2 px-3 sm:px-4 border-b border-red-950/20">
        <div className="container-custom flex items-center justify-between gap-2">
          {/* Left: Express Pill + Delivery info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial">
            <span className="inline-flex items-center gap-1 border border-white/40 bg-white/10 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase flex-shrink-0">
              <Zap size={11} className="text-amber-300" />
              <span>Express Store</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs truncate">
              <span>30–45 Mins Express Delivery in <strong className="font-bold">Kinwat</strong></span>
              <span className="hidden sm:inline">& nearby areas</span>
            </span>
            <span className="hidden md:inline text-white/50">|</span>
            <span className="hidden md:inline text-white/90 text-xs">
              Free delivery on orders above ₹299
            </span>
          </div>

          {/* Right: Contact & Location */}
          <div className="hidden lg:flex items-center gap-4 text-white/90 font-medium text-[11px]">
            <a href="tel:+919422000000" className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={12} className="text-amber-300" />
              <span>Call Support: +91 94220 00000</span>
            </a>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-1 text-white/90">
              <MapPin size={12} className="text-amber-300" />
              <span>In Kinwat, MH</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN NAVBAR ─── */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="container-custom py-3.5">
          <div className="flex items-center justify-between gap-3 md:gap-6">
            {/* Modern Logo */}
            <Logo size="md" />

            {/* Delivering To Widget */}
            <div className="hidden xl:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-3.5 py-2 rounded-2xl cursor-pointer transition-colors flex-shrink-0">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                <MapPin size={14} className="text-[#E8272A]" />
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Delivering To</div>
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <span>Kinwat Bazar, 431804</span>
                  <ChevronDown size={12} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Optimized Search Bar with Live Suggestions */}
            <div className="flex-1 max-w-2xl hidden md:block">
              <SearchBar />
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Wishlist Icon */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-[#E8272A] hover:bg-red-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
                title="Wishlist"
              >
                <Heart size={20} />
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 bg-amber-400 text-gray-900 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  3
                </span>
              </Link>

              {/* User Account / Sign In */}
              <Link
                href={user ? '/account' : '/login'}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#E8272A] hover:bg-gray-50 rounded-xl transition-colors"
              >
                <User size={18} />
                <span className="hidden sm:inline">
                  {user ? (user.name || 'Account') : 'Sign In'}
                </span>
              </Link>

              {/* Cart Button with Total */}
              <Link
                href="/cart"
                className="flex items-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-md shadow-red-500/20 active:scale-95"
              >
                <div className="relative">
                  <ShoppingCart size={16} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-amber-400 text-gray-950 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart: ₹{cartTotal > 0 ? cartTotal : 0}</span>
              </Link>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search bar with live autocomplete */}
          <div className="mt-3 md:hidden">
            <SearchBar isMobile placeholder="Search jewellery, gifts, kurtis..." />
          </div>
        </div>

        {/* ─── 3. SUB-NAVIGATION CATEGORIES BAR ─── */}
        <div className="border-t border-gray-100 bg-white hidden md:block">
          <div className="container-custom">
            <nav className="flex items-center gap-6 overflow-x-auto py-2 text-xs font-semibold whitespace-nowrap scrollbar-hide no-scrollbar">
              {navCategories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 py-1.5 transition-colors ${
                    item.isDeal
                      ? 'text-amber-600 hover:text-amber-700 font-bold ml-auto'
                      : 'text-gray-700 hover:text-[#E8272A]'
                  }`}
                >
                  {item.isDeal && <Sparkles size={13} className="text-amber-500 fill-amber-500" />}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="bg-rose-100 text-[#E8272A] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.hasDropdown && <ChevronDown size={12} className="text-gray-400" />}
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
              <div className="border-t border-gray-100 pt-2 mt-1">
                <Link
                  href={user ? '/account' : '/login'}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 px-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-[#E8272A] flex items-center gap-2"
                >
                  <User size={16} />
                  <span>{user ? 'My Profile & Orders' : 'Sign In / Register'}</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
