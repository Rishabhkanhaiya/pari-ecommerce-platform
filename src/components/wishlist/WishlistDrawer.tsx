'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react'
import { useWishlist } from '@/store/wishlist'
import { useCart } from '@/store/cart'
import toast from 'react-hot-toast'

export default function WishlistDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    clearWishlist,
    getTotalItems,
  } = useWishlist()

  const { addItem, openDrawer: openCartDrawer } = useCart()
  const totalItems = getTotalItems()

  // Close on Escape key
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

  const handleMoveToCart = (item: (typeof items)[0]) => {
    if (item.stock === 0) {
      toast.error('Item is currently out of stock')
      return
    }

    addItem({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: 1,
      stock: item.stock,
      slug: item.slug,
    })

    removeItem(item.productId)
    closeDrawer()
    openCartDrawer()
    toast.success(`${item.name} moved to bag`)
  }

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
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] mb-0.5">
                    Saved For Later
                  </div>
                  <h2 className="font-bold text-gray-950 text-base sm:text-lg flex items-center gap-2">
                    <span>My Wishlist</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 font-mono font-bold">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearWishlist}
                      className="text-[11px] font-semibold text-gray-400 hover:text-red-600 transition-colors mr-2"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={closeDrawer}
                    className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors"
                    aria-label="Close wishlist"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 border border-gray-200 flex items-center justify-center mb-4 text-gray-300">
                      <Heart size={28} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">Your wishlist is empty</h3>
                    <p className="text-xs text-gray-500 max-w-xs mb-6">
                      Click the heart icon on any product to save your favorite kurtis, jewellery, and gifts.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="px-6 py-3 bg-gray-950 hover:bg-[#E8272A] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Explore Catalog
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-3.5">
                      {/* Thumbnail */}
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="w-20 h-20 bg-gray-50 border border-gray-200 flex-shrink-0 overflow-hidden block relative"
                      >
                        <img
                          src={item.image || '/images/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.jpg'
                          }}
                        />
                        {item.stock === 0 && (
                          <span className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold uppercase flex items-center justify-center">
                            Sold Out
                          </span>
                        )}
                      </Link>

                      {/* Info & Actions */}
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
                              onClick={() => removeItem(item.productId)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1 -mr-1"
                              title="Remove from wishlist"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {item.categoryName && (
                            <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">
                              {item.categoryName}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-gray-950 font-mono">
                              ₹{item.price.toLocaleString('en-IN')}
                            </span>
                            {item.mrp && item.mrp > item.price && (
                              <span className="text-[11px] text-gray-400 line-through font-mono">
                                ₹{item.mrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Move to Bag Button */}
                        <div className="mt-2.5">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={item.stock === 0}
                            className="w-full py-2 px-3 border border-gray-900 hover:bg-[#E8272A] hover:border-[#E8272A] hover:text-white text-gray-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={13} />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer CTA */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
                  <button
                    onClick={closeDrawer}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#E8272A] uppercase tracking-wider"
                  >
                    <span>Continue Browsing Kinwat Store</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
