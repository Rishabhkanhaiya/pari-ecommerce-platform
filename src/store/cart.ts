'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/lib/types'

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          )

          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            const existing = updatedItems[existingIndex]
            const newQty = Math.min(existing.quantity + newItem.quantity, existing.stock)
            updatedItems[existingIndex] = { ...existing, quantity: newQty }
            return { items: updatedItems }
          }

          return { items: [...state.items, newItem] }
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
    }
  )
)
