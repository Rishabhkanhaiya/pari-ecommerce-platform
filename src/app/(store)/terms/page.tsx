import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Clock, FileText, AlertCircle, Phone, Mail, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | Pari Gift Center',
  description:
    'Terms and Conditions for purchasing ladies fashion, jewellery, cosmetics, toys and gifts from Pari Gift Center, Kinwat.',
}

export default function TermsPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#E8272A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200/80 text-[#E8272A] px-3 py-1 rounded-none text-xs font-black uppercase tracking-wider mb-4">
            <FileText size={14} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mb-3">
            Terms of Service & User Agreement
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Welcome to <strong>Pari Gift Center</strong>. These Terms and Conditions govern your use of our website (
            <strong>http://localhost:3000</strong> or official domain) and purchase of goods offered across our
            Kinwat retail store and digital ordering channels.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500 font-medium">
            <span>Last Updated: September 2026</span>
            <span>Applicable Location: Kinwat, Maharashtra, India</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 space-y-8 text-sm sm:text-[15px] leading-relaxed text-gray-700 shadow-xs">
          {/* Section 1 */}
          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">1.</span> Operating Entity & Acceptance
            </h2>
            <p className="mb-3">
              This digital platform is owned and operated by <strong>Pari Gift Center & Fashion Hub</strong>, based in
              Kinwat Bazar, District Nanded, Maharashtra – 431804.
            </p>
            <p>
              By accessing our store, creating an account via Phone OTP, adding items to your cart, or placing an order,
              you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service,
              our Privacy Policy, and our Refund & Cancellation Policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">2.</span> Account Registration & Authentication
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Phone Authentication:</strong> Customers log in using a verified Indian Mobile Number (+91)
                via One-Time Password (OTP). You are solely responsible for all activities and orders placed under your
                authenticated session.
              </li>
              <li>
                <strong>Accurate Address Information:</strong> You agree to provide accurate, complete, and verifiable delivery
                information including house/shop number, street name, Kinwat landmark, recipient name, and active mobile number.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">3.</span> 30–45 Minutes Express Delivery Policy
            </h2>
            <div className="bg-amber-50/60 border border-amber-200 p-4 mb-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Clock size={16} className="text-[#E8272A]" />
                <span>Express Local Delivery Service Commitment</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                Our 30–45 minute express delivery commitment applies strictly within <strong>Kinwat town and immediate peripheral localities (5–10 km radius)</strong> during active operational hours (10:00 AM to 8:00 PM IST). Under normal conditions, orders are typically delivered within 30 minutes.
              </p>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Free Delivery Threshold:</strong> All orders with a cart value equal to or exceeding{' '}
                <strong>₹299</strong> qualify for complimentary delivery.
              </li>
              <li>
                <strong>Standard Delivery Fee:</strong> Orders below ₹299 are subject to a nominal delivery convenience
                fee of <strong>₹40</strong>.
              </li>
              <li>
                <strong>Exceptions &amp; Safe Buffer:</strong> While our staff dispatches orders rapidly within 10–15 minutes,
                delivery times may occasionally take up to 45 minutes due to heavy monsoon rains, roadblocks, religious festival
                processions, counter rush, or incomplete contact details. In any such situation, our store team proactively contacts
                you via telephone call or SMS.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">4.</span> Pricing, Inventory & Product Descriptions
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Pricing:</strong> All listed prices are in Indian Rupees (INR ₹) inclusive of applicable taxes.
                Prices and discounts are subject to change without prior notice.
              </li>
              <li>
                <strong>Live Inventory:</strong> Products are backed by real inventory from our physical shops in Kinwat.
                In the rare instance that an item ordered simultaneously sells out in the brick-and-mortar store, our team
                will contact you immediately via telephone to offer an immediate substitute or instant refund.
              </li>
              <li>
                <strong>Colour Representation:</strong> We make every reasonable effort to display accurate photographs of our
                textiles, sarees, kurtis, and artificial jewellery. Minor variations in shade may occur depending on screen
                calibration and ambient lighting.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">5.</span> Payment Modes & Security
            </h2>
            <p className="mb-3">We provide flexible and secure payment solutions for Kinwat residents:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Online Payments (Razorpay)</h3>
                <p className="text-xs text-gray-600">
                  Payments made via UPI (PhonePe, Google Pay, Paytm, BHIM), Credit/Debit Cards, and Net Banking are securely
                  processed via Razorpay Payment Gateway conforming to PCI-DSS Level 1 compliance.
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Cash On Delivery (COD)</h3>
                <p className="text-xs text-gray-600">
                  You may pay in cash or via on-the-spot UPI QR code upon physical doorstep handover in Kinwat. Customers
                  must keep exact or approximate change ready.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">6.</span> Discount Coupons & Promotions
            </h2>
            <p>
              Promotional codes and festive coupons are non-transferable and can be applied only once per customer unless
              explicitly stated. Coupons cannot be redeemed for liquid cash or combined in violation of coupon terms.
            </p>
          </section>

          {/* Section 7 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">7.</span> 24-Hour Return & Exchange Window and Delivery Charges
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>24-Hour Time Limit:</strong> Return or exchange requests for eligible ladies garments or defective toys must be submitted strictly within <strong>24 hours</strong> of order delivery. No claims will be entertained after 24 hours.
              </li>
              <li>
                <strong>Return Delivery Charge:</strong> Customer-initiated doorstep exchanges or returns incur a return delivery fee of <strong>₹40</strong> to compensate local delivery personnel.
              </li>
              <li>
                <strong>Free Counter Exchange:</strong> Exchanging an item directly at our physical store counter in Kinwat Bazar is always <strong>100% FREE</strong> with zero return delivery charges.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">8.</span> Limitation of Liability & Dispute Jurisdiction
            </h2>
            <p className="mb-3">
              Pari Gift Center shall not be liable for any indirect, incidental, or consequential damages arising from the use
              or inability to use our website. In all events, our total cumulative liability shall not exceed the amount paid by
              you for the specific order under question.
            </p>
            <p>
              Any disputes, controversies, or claims arising out of or related to these Terms shall be subject to the exclusive
              jurisdiction of the competent courts in <strong>Kinwat / Nanded, Maharashtra</strong>.
            </p>
          </section>

          {/* Contact Section */}
          <section className="pt-6 border-t border-gray-100 bg-red-50/40 p-5 border border-red-100">
            <h2 className="font-serif text-lg font-bold text-gray-950 mb-2">Questions or Clarifications?</h2>
            <p className="text-xs sm:text-sm text-gray-700 mb-3">
              If you have any questions regarding our terms, feel free to visit our Kinwat store or contact our store support:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-gray-800">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#E8272A]" />
                <span>Pari Gift Center, Kinwat Bazar, Maharashtra – 431804</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#E8272A]" />
                <span>Customer Helpline: +91 94220 00000 | Email: support@parigiftcenter.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
