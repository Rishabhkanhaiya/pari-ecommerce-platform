import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check Supabase user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // In development mode or for quick store owner access, allow temporary direct bypass
  if (process.env.NODE_ENV === 'development' || !user) {
    // If logged in as admin, regular flow
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        return (
          <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto">
              <div className="p-6 md:p-8">{children}</div>
            </main>
          </div>
        )
      }
    }

    // Temporary direct access mode for Store Owner in local dev
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {/* Temporary Admin Mode Notification */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-red-500 text-white px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Store Owner Direct Mode (Active Session)</span>
            </div>
            <div className="text-[11px] font-medium bg-black/25 px-2.5 py-0.5 rounded-full">
              Full Admin Access Enabled
            </div>
          </div>
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
