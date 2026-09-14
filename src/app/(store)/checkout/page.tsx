'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { MapPin, CreditCard, Truck, Clock, CheckCircle2, Plus, ShieldCheck, Lock, ArrowRight, Phone } from 'lucide-react'
import { useCart } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import { initiatePayment } from '@/lib/razorpay'
import type { Address } from '@/lib/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

const FREE_DELIVERY_ABOVE = parseInt(process.env.NEXT_PUBLIC_FREE_DELIVERY_ABOVE || '299')
const DELIVERY_FEE = 40

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCart()

  const couponId = searchParams.get('coupon')
  const couponCode = searchParams.get('couponCode')
  const couponDiscount = parseFloat(searchParams.get('discount') || '0')

  const [user, setUser] = useState<any>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod')
  const [isNewAddress, setIsNewAddress] = useState(true)
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    pincode: '431804',
  })
  const [loading, setLoading] = useState(false)

  const subtotal = getSubtotal()
  const deliveryFee = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        setUser(data.user)

        // Fetch addresses
        const { data: addrs } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', data.user.id)
          .order('is_default', { ascending: false })

        if (addrs && addrs.length > 0) {
          setAddresses(addrs)
          const def = addrs.find((a: Address) => a.is_default) || addrs[0]
          if (def) {
            setSelectedAddress(def)
            setIsNewAddress(false)
          }
        } else {
          setIsNewAddress(true)
        }
      } else {
        setIsNewAddress(true)
      }
    })
  }, [])

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add dresses, jewellery, or gifts to proceed</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-none transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  const handleSaveAddress = async () => {
    if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.address_line1.trim()) {
      toast.error('Please enter your Name, Phone and House/Street Address')
      return
    }

    if (user) {
      const supabase = createClient()
      const { data: addr, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          name: newAddress.name.trim(),
          phone: newAddress.phone.trim(),
          address_line1: newAddress.address_line1.trim(),
          address_line2: newAddress.address_line2.trim() || null,
          landmark: newAddress.landmark.trim() || null,
          city: 'Kinwat',
          pincode: newAddress.pincode.trim() || '431804',
          is_default: addresses.length === 0,
        })
        .select()
        .single()

      if (error) {
        toast.error('Failed to save address')
        return
      }
      setAddresses([...addresses, addr])
      setSelectedAddress(addr)
      setIsNewAddress(false)
      toast.success('Address saved!')
    } else {
      const guestAddr: Address = {
        id: 'guest_' + Date.now(),
        user_id: 'guest',
        name: newAddress.name.trim(),
        phone: newAddress.phone.trim(),
        address_line1: newAddress.address_line1.trim(),
        address_line2: newAddress.address_line2.trim() || '',
        landmark: newAddress.landmark.trim() || '',
        city: 'Kinwat',
        pincode: newAddress.pincode.trim() || '431804',
        is_default: true,
        created_at: new Date().toISOString(),
      }
      setAddresses([guestAddr])
      setSelectedAddress(guestAddr)
      setIsNewAddress(false)
      toast.success('Delivery address confirmed')
    }
  }

  const handlePlaceOrder = async () => {
    let finalAddress = selectedAddress

    // If typing new address and haven't clicked save
    if (!finalAddress || isNewAddress) {
      if (!newAddress.name.trim() || !newAddress.phone.trim() || !newAddress.address_line1.trim()) {
        toast.error('Please enter your full Name, Phone, and Delivery Address')
        return
      }
      finalAddress = {
        id: 'guest_' + Date.now(),
        user_id: user?.id || 'guest',
        name: newAddress.name.trim(),
        phone: newAddress.phone.trim(),
        address_line1: newAddress.address_line1.trim(),
        address_line2: newAddress.address_line2.trim() || '',
        landmark: newAddress.landmark.trim() || '',
        city: 'Kinwat',
        pincode: newAddress.pincode.trim() || '431804',
        is_default: true,
        created_at: new Date().toISOString(),
      }
      setSelectedAddress(finalAddress)
    }

    setLoading(true)

    try {
      const orderPayload = {
        userId: user?.id || null,
        addressId: finalAddress.id?.startsWith('guest') ? null : finalAddress.id,
        deliveryName: finalAddress.name,
        deliveryPhone: finalAddress.phone,
        deliveryAddress: `${finalAddress.address_line1}${finalAddress.address_line2 ? ', ' + finalAddress.address_line2 : ''}${finalAddress.landmark ? ', Near ' + finalAddress.landmark : ''}`,
        deliveryCity: finalAddress.city || 'Kinwat',
        deliveryPincode: finalAddress.pincode || '431804',
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId || null,
          name: item.name,
          variantName: item.variantName || null,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        discount: couponDiscount,
        deliveryFee,
        total,
        couponCode: couponCode || null,
        couponId: couponId || null,
        paymentMethod,
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      const { order, error } = await res.json()
      if (error) throw new Error(error)

      if (paymentMethod === 'cod') {
        clearCart()
        router.push(`/orders/${order.id}?success=true`)
        return
      }

      // Razorpay payment
      await initiatePayment({
        amount: total,
        orderId: order.order_number,
        dbOrderId: order.id,
        customerName: finalAddress.name,
        customerPhone: finalAddress.phone,
        onSuccess: async (response) => {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              db_order_id: order.id,
            }),
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            clearCart()
            router.push(`/orders/${order.id}?success=true`)
          } else {
            toast.error('Payment verification failed. Contact support.')
          }
        },
        onDismiss: () => {
          toast.error('Payment cancelled. Your order is recorded — try again from your orders page.')
          router.push(`/orders/${order.id}`)
          setLoading(false)
        },
      })
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order')
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="container-custom max-w-6xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-950">Secure Checkout</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Hyperlocal delivery direct from Pari Gift Center, Kinwat Bazar
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold">
            <Lock size={13} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Address & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Address Card */}
            <div className="bg-white border border-gray-200 rounded-none p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-950 text-base flex items-center gap-2">
                  <MapPin size={18} className="text-[#E8272A]" />
                  <span>1. Delivery Address in Kinwat</span>
                </h2>
                {addresses.length > 0 && !isNewAddress && (
                  <button
                    onClick={() => {
                      setIsNewAddress(true)
                      setSelectedAddress(null)
                    }}
                    className="text-xs font-bold text-[#E8272A] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Add Another Address</span>
                  </button>
                )}
              </div>

              {/* Saved Addresses List (if logged in) */}
              {addresses.length > 0 && !isNewAddress && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 border rounded-none cursor-pointer transition-colors ${
                        selectedAddress?.id === addr.id
                          ? 'border-[#E8272A] bg-rose-50/40'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => {
                          setSelectedAddress(addr)
                          setIsNewAddress(false)
                        }}
                        className="mt-1 accent-[#E8272A]"
                      />
                      <div className="text-xs sm:text-sm">
                        <div className="font-bold text-gray-900">{addr.name}</div>
                        <div className="text-gray-600 mt-0.5">
                          {addr.address_line1}
                          {addr.address_line2 ? `, ${addr.address_line2}` : ''}
                          {addr.landmark ? `, Near ${addr.landmark}` : ''}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          Kinwat, Maharashtra — {addr.pincode}
                        </div>
                        <div className="text-gray-700 font-medium text-xs mt-1 flex items-center gap-1.5">
                          <Phone size={12} className="text-gray-400" />
                          <span>{addr.phone}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Address Form (for guest or adding new) */}
              {isNewAddress && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        placeholder="e.g. Ramesh Patil"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="input-field text-xs rounded-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        10-Digit Phone Number *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          })
                        }
                        className="input-field text-xs rounded-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      House / Shop No., Building, Street Address *
                    </label>
                    <input
                      placeholder="e.g. Near Old Bus Stand, Kinwat Bazar"
                      value={newAddress.address_line1}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, address_line1: e.target.value })
                      }
                      className="input-field text-xs rounded-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        placeholder="e.g. Opp. State Bank, Near Gandhi Chowk"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, landmark: e.target.value })
                        }
                        className="input-field text-xs rounded-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Pincode (Kinwat)
                      </label>
                      <input
                        placeholder="431804"
                        value={newAddress.pincode}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, pincode: e.target.value })
                        }
                        className="input-field text-xs rounded-none font-mono"
                      />
                    </div>
                  </div>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewAddress(false)
                        setSelectedAddress(addresses[0])
                      }}
                      className="text-xs text-gray-500 hover:text-gray-900 underline pt-1"
                    >
                      Cancel and use saved address
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white border border-gray-200 rounded-none p-6 shadow-xs">
              <h2 className="font-bold text-gray-950 text-base mb-4 pb-3 border-b border-gray-100 flex items-center gap-2">
                <CreditCard size={18} className="text-[#E8272A]" />
                <span>2. Select Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-none cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#E8272A] bg-rose-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#E8272A]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-950 text-sm">
                      Cash on Delivery (COD) / Pay on Handover
                    </div>
                    <div className="text-xs text-gray-500">
                      Inspect your package and pay cash or UPI scanner to rider upon delivery
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5">
                    Recommended
                  </span>
                </label>

                {/* Online Payment */}
                <label
                  className={`flex items-center gap-3 p-4 border rounded-none cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#E8272A] bg-rose-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-[#E8272A]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-950 text-sm">
                      Instant Online Payment (Razorpay)
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay instantly via Google Pay, PhonePe, Paytm UPI, Debit/Credit Cards
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                    <span className="bg-gray-100 px-1.5 py-0.5">UPI</span>
                    <span className="bg-gray-100 px-1.5 py-0.5">GPay</span>
                    <span className="bg-gray-100 px-1.5 py-0.5">Cards</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Hyperlocal Express Delivery Info */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 flex items-center gap-3 rounded-none">
              <Clock size={20} className="text-[#E8272A] flex-shrink-0" />
              <div className="text-xs text-gray-700">
                <strong className="text-gray-950 font-bold block text-sm">
                  30–45 Mins Express Delivery
                </strong>
                Directly packed from Pari Gift Center shelves and dispatched across Kinwat (10:00 AM – 8:00 PM).
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-none p-6 shadow-xs sticky top-24">
              <h3 className="font-bold text-gray-950 text-base mb-4 pb-3 border-b border-gray-100">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items preview list */}
              <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-gray-100 mb-5 pr-1">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 pt-3 first:pt-0">
                    <div className="w-12 h-12 bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/images/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">{item.name}</div>
                      <div className="text-[11px] text-gray-500">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-gray-100 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount {couponCode ? `(${couponCode})` : ''}</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 text-base">
                  <span className="font-bold text-gray-950">Grand Total</span>
                  <span className="font-black text-xl text-[#E8272A]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 py-4 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-black text-xs uppercase tracking-widest rounded-none transition-all shadow-md shadow-red-500/30 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Place Order</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Guaranteed Delivery by Pari Gift Center</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-custom py-20 text-center text-gray-400">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
