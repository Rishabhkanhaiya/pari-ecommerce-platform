'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/common/Logo'
import {
  LayoutDashboard, ShoppingBag, Package, Tag, Users, Settings, LogOut, ChevronRight, ExternalLink
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} bg-gray-900 text-white flex flex-col transition-all duration-300 flex-shrink-0`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed ? (
          <Logo variant="white" size="sm" />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF383C] to-[#B30E12] rounded-xl flex items-center justify-center font-bold text-white shadow-sm">
            P
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Store Link & Logout */}
      <div className="p-3 border-t border-gray-700 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
          title={collapsed ? 'View Live Store' : undefined}
        >
          <ExternalLink size={18} className="flex-shrink-0" />
          {!collapsed && <span>View Live Store</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
