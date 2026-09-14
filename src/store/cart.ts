'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/lib/types'

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (newItem: CartItem, openDrawer = true) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          )

          let updatedItems: CartItem[]
          if (existingIndex >= 0) {
            updatedItems = [...state.items]
            const existing = updatedItems[existingIndex]
            const newQty = Math.min(existing.quantity + newItem.quantity, existing.stock)
            updatedItems[existingIndex] = { ...existing, quantity: newQty }
          } else {
            updatedItems = [...state.items, newItem]
          }

          return {
            items: updatedItems,
            isDrawerOpen: openDrawer ? true : state.isDrawerOpen,
          }
        })
      },

      removeItem: (productId: string, variantId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }))
      },

      updateQuantity: (productId: string, quantity: number, variantId?: string) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(item.productId === productId && item.variantId === variantId)
              ),
            }
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId && item.variantId === variantId
                ? { ...item, quantity: Math.min(quantity, item.stock) }
                : item
            ),
          }
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'pari-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
