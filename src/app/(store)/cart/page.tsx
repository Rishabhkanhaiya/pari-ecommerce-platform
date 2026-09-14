'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X, Zap, RotateCcw, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const FREE_DELIVERY_ABOVE = parseInt(process.env.NEXT_PUBLIC_FREE_DELIVERY_ABOVE || '299')
const DELIVERY_FEE = 40

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.min(
          (subtotal * appliedCoupon.value) / 100,
          appliedCoupon.max_discount || Infinity
        )
      : appliedCoupon.value
    : 0
  const total = Math.max(0, subtotal + deliveryFee - discount)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const supabase = createClient()
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .single()

      if (!coupon) {
        toast.error('Invalid coupon code')
        return
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast.error('This coupon has expired')
        return
      }

      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        toast.error('This coupon has reached its usage limit')
        return
      }

      if (subtotal < coupon.min_order_amount) {
        toast.error(`Minimum order amount ₹${coupon.min_order_amount} required for this coupon`)
        return
      }

      setAppliedCoupon(coupon)
      toast.success(`Coupon "${coupon.code}" applied successfully`)
    } catch {
      toast.error('Failed to apply coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    toast.success('Coupon removed')
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add products to your cart and proceed to checkout.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2 rounded-none">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="container-custom max-w-5xl">
        <h1 className="font-serif text-3xl font-bold text-gray-950 mb-2">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mb-6">
          Dispatched in 10–15 mins for 30–45 min doorstep delivery across Kinwat
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="bg-white border border-gray-200 p-4 rounded-none flex gap-4 shadow-2xs"
              >
                {/* Image */}
                <Link href={`/product/${item.slug}`}>
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
                    <img
                      src={item.image || '/images/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-none"
                      onError={(e) => (e.currentTarget.src = '/images/placeholder-product.jpg')}
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="font-bold text-gray-950 text-sm leading-snug hover:text-[#E8272A] transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    {item.variantName && (
                      <p className="text-[11px] text-gray-500 font-medium mt-0.5">Option: {item.variantName}</p>
                    )}
                    <p className="text-[#E8272A] font-black text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                        className="w-7 h-7 rounded-none border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold text-gray-900 text-xs w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                        disabled={item.quantity >= item.stock}
                        className="w-7 h-7 rounded-none border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-gray-950 text-sm">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => {
                          removeItem(item.productId, item.variantId)
                          toast.success('Item removed from cart')
                        }}
                        className="text-gray-400 hover:text-[#E8272A] transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  clearCart()
                  toast.success('Cart cleared')
                }}
                className="text-xs text-gray-400 hover:text-[#E8272A] transition-colors flex items-center gap-1 font-semibold"
              >
                <Trash2 size={13} />
                Clear cart
              </button>

              <Link
                href="/"
                className="text-xs font-bold text-[#E8272A] hover:underline"
              >
                + Add More Items
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Free Delivery Bar */}
            <div className="bg-white border border-gray-200 p-4 rounded-none shadow-2xs">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-gray-900">
                  {subtotal >= FREE_DELIVERY_ABOVE ? 'Free Express Delivery Qualified' : `Add ₹${FREE_DELIVERY_ABOVE - subtotal} for Free Delivery`}
                </span>
                <span className="text-[#E8272A]">{Math.min(100, Math.round((subtotal / FREE_DELIVERY_ABOVE) * 100))}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-none overflow-hidden">
                <div
                  className="bg-[#E8272A] h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_ABOVE) * 100)}%` }}
                />
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white border border-gray-200 p-5 rounded-none shadow-2xs">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag size={15} className="text-[#E8272A]" />
                Apply Promo Code
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-none">
                  <div>
                    <span className="font-black text-emerald-800 text-xs tracking-wider uppercase">{appliedCoupon.code}</span>
                    <p className="text-[11px] text-emerald-700 mt-0.5">₹{discount.toFixed(0)} discount applied!</p>
                  </div>
                  <button onClick={removeCoupon} className="text-emerald-700 hover:text-[#E8272A]">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="E.g. WELCOME50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    className="input-field flex-1 uppercase rounded-none text-xs"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="bg-white border border-gray-200 p-5 rounded-none shadow-2xs">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4">
                Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery (Kinwat Express)</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-700 font-black uppercase' : 'font-semibold text-gray-900'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-gray-950 text-base">
                  <span>Total Amount</span>
                  <span className="text-[#E8272A]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href={`/checkout?${appliedCoupon ? `coupon=${appliedCoupon.id}&couponCode=${appliedCoupon.code}&discount=${discount}` : ''}`}
                className="w-full mt-5 bg-[#E8272A] hover:bg-[#CC1A1D] text-white py-3.5 text-xs font-black uppercase tracking-wider rounded-none flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                Proceed to Checkout <ArrowRight size={15} />
              </Link>

              {/* Trust Strip */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#E8272A] flex-shrink-0" />
                  <span>Direct Kinwat Store Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-emerald-700 flex-shrink-0" />
                  <span>24-Hour Exchange Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-blue-700 flex-shrink-0" />
                  <span>Cash or UPI on Handover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
