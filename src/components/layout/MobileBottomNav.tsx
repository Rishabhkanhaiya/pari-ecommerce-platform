'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/store/wishlist'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { getTotalItems, openDrawer: openCartDrawer } = useCart()
  const { getTotalItems: getWishlistCount, openDrawer: openWishlistDrawer } = useWishlist()
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const cartCount = getTotalItems()
  const wishlistCount = getWishlistCount()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserLoggedIn(!!data?.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Hide bottom nav in admin dashboard
  if (pathname.startsWith('/admin')) {
    return null
  }

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Categories',
      href: '/category/ladies-fashion',
      icon: Grid,
      isActive: pathname.startsWith('/category'),
    },
    {
      label: 'Wishlist',
      icon: Heart,
      count: wishlistCount,
      onClick: () => openWishlistDrawer(),
      isActive: false,
    },
    {
      label: 'Bag',
      icon: ShoppingBag,
      count: cartCount,
      onClick: () => openCartDrawer(),
      isActive: pathname === '/cart',
    },
    {
      label: userLoggedIn ? 'Account' : 'Sign In',
      href: userLoggedIn ? '/account' : '/login',
      icon: User,
      isActive: pathname === '/account' || pathname === '/login',
    },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform ${item.isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`}
                />

                {/* Badge Count */}
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] bg-[#E8272A] text-white text-[9px] font-black rounded-none flex items-center justify-center px-1 shadow-xs border border-white">
                    {item.count > 99 ? '99+' : item.count}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 font-semibold tracking-tight leading-none ${
                  item.isActive ? 'font-bold text-[#E8272A]' : ''
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {item.isActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#E8272A]" />
              )}
            </>
          )

          const className = `relative flex flex-col items-center justify-center py-1 px-2.5 rounded-none transition-all duration-200 active:scale-90 ${
            item.isActive
              ? 'text-[#E8272A]'
              : 'text-gray-500 hover:text-gray-900'
          }`

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={className}
                type="button"
                aria-label={item.label}
              >
                {content}
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={className}
              aria-label={item.label}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
