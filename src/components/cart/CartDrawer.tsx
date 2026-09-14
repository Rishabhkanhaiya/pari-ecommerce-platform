'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Zap, CheckCircle2, Clock } from 'lucide-react'
import { useCart } from '@/store/cart'

export default function CartDrawer() {
  const router = useRouter()
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCart()

  const subtotal = getSubtotal()
  const totalItems = getTotalItems()
  const freeDeliveryThreshold = 299
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal)
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 40
  const finalTotal = subtotal + deliveryFee

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-over Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-gray-200 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] mb-0.5">
                    Express Kinwat Bag
                  </div>
                  <h2 className="font-bold text-gray-950 text-base sm:text-lg flex items-center gap-2">
                    <span>Shopping Cart</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 font-mono font-bold">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Free Delivery Progress Bar Meter */}
              <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 sm:px-5 py-3 text-xs">
                {amountNeededForFree > 0 ? (
                  <div>
                    <div className="flex items-center justify-between font-bold text-amber-950 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Zap size={13} className="text-[#E8272A]" />
                        <span>Add <strong>₹{amountNeededForFree}</strong> more for FREE delivery</span>
                      </span>
                      <span>{freeDeliveryProgress}%</span>
                    </div>
                    <div className="w-full bg-amber-200/70 h-1.5 rounded-none overflow-hidden">
                      <div
                        className="bg-[#E8272A] h-full transition-all duration-300"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>You have unlocked FREE 30-45m Express Delivery in Kinwat!</span>
                  </div>
                )}
              </div>

              {/* Items List (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mb-4 text-gray-300">
                      <ShoppingBag size={28} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Your cart is empty</h3>
                    <p className="text-xs text-gray-500 max-w-xs mb-6">
                      Explore bridal kurtis, fashion jewellery, toys, and luxury gift hampers in Kinwat.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="px-6 py-3 bg-gray-950 hover:bg-[#E8272A] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || 'base'}`} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                      {/* Item Thumbnail */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="w-20 h-20 bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden block"
                      >
                        <img
                          src={item.image || '/images/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg'
                          }}
                        />
                      </Link>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/product/${item.slug}`}
                              onClick={closeDrawer}
                              className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 hover:text-[#E8272A] transition-colors"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1 -mr-1"
                              title="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {item.variantName && (
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              Variant: <span className="font-semibold text-gray-700">{item.variantName}</span>
                            </div>
                          )}
                          <div className="text-xs font-bold text-gray-900 mt-1">
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* Quantity Stepper & Line Total */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                          <div className="flex items-center border border-gray-200">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                              disabled={item.quantity >= item.stock}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <div className="text-xs font-black text-gray-950 font-mono">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Sticky Footer Checkout Bar (Only when items exist) */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 bg-white p-4 sm:p-5 space-y-3 shadow-lg">
                  {/* Summary Rows */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-mono font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery (Kinwat Express)</span>
                      <span className="font-bold">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-600 uppercase tracking-wider">FREE</span>
                        ) : (
                          <span className="font-mono text-gray-900">₹{deliveryFee}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-100">
                      <span>Estimated Total</span>
                      <span className="font-mono text-[#E8272A] text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => {
                      closeDrawer()
                      router.push('/checkout')
                    }}
                    className="w-full py-3.5 px-4 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/20 active:scale-98"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={15} />
                  </button>

                  {/* View Full Cart Page link */}
                  <div className="flex items-center justify-between text-[11px] pt-1 text-gray-500">
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="hover:text-gray-900 underline font-medium"
                    >
                      View full cart details & coupons
                    </Link>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Clock size={11} /> 30-45m Kinwat
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
