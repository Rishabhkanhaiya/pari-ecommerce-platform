import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw, Clock, ShieldCheck, AlertCircle, Phone, Mail, MapPin, CheckCircle2, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Pari Gift Center',
  description:
    'Detailed return, exchange, refund, and cancellation policies for Pari Gift Center, Kinwat.',
}

export default function RefundsPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#E8272A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Refund & Cancellation Policy</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-none text-xs font-black uppercase tracking-wider mb-4">
            <RotateCcw size={14} className="text-[#E8272A]" />
            <span>Store Returns & Refunds</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mb-3">
            Cancellation, Return & Refund Policy
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            At <strong>Pari Gift Center & Fashion Hub</strong>, we aim for complete customer satisfaction. Because we operate
            a rapid 30–45 minute local delivery service across Kinwat, please review our transparent policy below regarding
            order cancellations, garment exchanges, and refund turnaround times.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500 font-medium">
            <span>Last Updated: September 2026</span>
            <span>Local Store: Kinwat Bazar, Maharashtra – 431804</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 space-y-8 text-sm sm:text-[15px] leading-relaxed text-gray-700 shadow-xs">
          {/* Section 1: Order Cancellation */}
          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">1.</span> Order Cancellation
            </h2>
            <p className="mb-3">
              Because our orders are dispatched within 10 to 15 minutes of receipt to fulfill our 30–45 minute delivery commitment:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Before Dispatch:</strong> You may cancel your order free of cost at any time while the status remains{' '}
                <span className="font-semibold text-gray-900">"Pending"</span> or{' '}
                <span className="font-semibold text-gray-900">"Confirmed"</span> by calling our Customer Helpline or managing your order in Order Tracking.
              </li>
              <li>
                <strong>After Dispatch:</strong> Once your order transitions to{' '}
                <span className="font-semibold text-amber-700">"Out for Delivery"</span>, cancellations cannot be processed
                online as our delivery rider is already en route.
              </li>
            </ul>
          </section>

          {/* Section 2: Returns and Exchanges by Category */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">2.</span> Returns & Exchanges by Product Category
            </h2>
            <div className="space-y-4">
              {/* Category A */}
              <div className="border border-gray-200 p-4 bg-gray-50/70">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                  <span>Ladies Fashion (Kurtis, Sarees, Dresses)</span>
                  <span className="bg-red-100 text-[#E8272A] text-[10px] font-black uppercase px-2 py-0.5 ml-auto">
                    24-Hr Exchange Only
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Size issues or stitching defects must be reported strictly within <strong>24 hours</strong> of delivery.
                  The garment must remain unworn, unwashed, with all original tags attached and packaging intact. Requests
                  submitted after 24 hours cannot be entertained due to live physical store inventory rotation.
                </p>
              </div>

              {/* Category B */}
              <div className="border border-gray-200 p-4 bg-gray-50/70">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                  <span>Fashion Jewellery & Bangles</span>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 ml-auto">
                    Check at Door
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Due to hygiene standards, artificial earrings, nose rings, and bangles cannot be returned once worn. Please
                  inspect the items at doorstep upon handover. If broken in transit, inform the rider immediately for an on-the-spot
                  replacement.
                </p>
              </div>

              {/* Category C */}
              <div className="border border-gray-200 p-4 bg-gray-50/70">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                  <span>Cosmetics & Personal Beauty</span>
                  <span className="bg-rose-100 text-[#E8272A] text-[10px] font-black uppercase px-2 py-0.5 ml-auto">
                    Non-Returnable
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  For sanitary and consumer safety reasons, opened cosmetics (lipsticks, kajal, creams, nail polishes) cannot be
                  returned. Replacement is provided only if a product is delivered expired or physically damaged.
                </p>
              </div>

              {/* Category D */}
              <div className="border border-gray-200 p-4 bg-gray-50/70">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
                  <span>Toys & Gift Items</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 ml-auto">
                    24-Hr Defect Replacement
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Electronic toys (RC cars, battery toys) are tested before delivery. If a manufacturing defect is discovered,
                  notify us strictly within <strong>24 hours</strong> of receipt for a direct replacement.
                </p>
              </div>
            </div>

            {/* Return Delivery Cost Notice Box */}
            <div className="mt-5 p-4 bg-amber-50/80 border border-amber-300/80">
              <h3 className="font-bold text-gray-950 text-sm mb-2 flex items-center gap-2">
                <Truck size={18} className="text-[#E8272A]" /> Return Delivery & Pickup Charges:
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-800">
                <li>
                  <strong>Doorstep Reverse Pickup Charge:</strong> For customer-initiated returns/exchanges (such as sizing change or preference), a reverse delivery charge of <strong>₹40</strong> will be applicable for our rider to collect the package from your doorstep.
                </li>
                <li>
                  <strong>FREE In-Store Counter Exchange:</strong> Customers can bring the item directly to our <strong>Pari Gift Center shop in Kinwat Bazar</strong> within 24 hours for a <strong>100% FREE exchange</strong> with zero pickup fees!
                </li>
                <li>
                  <strong>Damaged or Wrong Item Delivered:</strong> If an incorrect, broken, or damaged item was delivered by us, the reverse pickup and replacement are <strong>100% FREE</strong> with no fee charged.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Refund Process and Timelines */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">3.</span> Refund Timelines & Settlement Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Online Payments (UPI / Cards)</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Approved refunds are credited directly back to the original source account (UPI / Bank / Card) via Razorpay.
                </p>
                <div className="text-xs font-bold text-[#E8272A] flex items-center gap-1.5">
                  <Clock size={13} /> Timeline: 5 to 7 business banking days
                </div>
              </div>

              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Cash on Delivery (COD)</h3>
                <p className="text-xs text-gray-600 mb-2">
                  For cancelled or returned COD orders, refunds are issued via instant UPI transfer (Google Pay / PhonePe) or direct
                  cash handover at our Kinwat shop counter.
                </p>
                <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <Clock size={13} /> Timeline: Instant / Same-Day in Kinwat
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Contact for Returns */}
          <section className="pt-6 border-t border-gray-100 bg-gray-50 p-5 border border-gray-200">
            <h2 className="font-serif text-lg font-bold text-gray-950 mb-2">How to Request a Return or Refund</h2>
            <p className="text-xs sm:text-sm text-gray-700 mb-3">
              To initiate an exchange or report a damaged item, please have your Order Number (e.g. <code>PGC2026...</code>) ready:
            </p>
            <div className="space-y-2 text-xs font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#E8272A]" />
                <span>Customer Care Hotline: +91 94220 00000 | Email: support@parigiftcenter.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#E8272A]" />
                <span>Physical Counter: Pari Gift Center, Main Road, Kinwat Bazar, MH</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
