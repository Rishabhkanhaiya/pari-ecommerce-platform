'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem, WishlistState } from '@/lib/types'

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (newItem: WishlistItem) => {
        set((state) => {
          if (state.items.some((item) => item.productId === newItem.productId)) {
            return state
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId)
      },

      clearWishlist: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: 'pari-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
