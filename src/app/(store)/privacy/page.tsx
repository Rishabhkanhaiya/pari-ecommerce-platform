import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Lock, Eye, Database, Phone, Mail, MapPin, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | Pari Gift Center',
  description:
    'Comprehensive Privacy Policy outlining how customer data, phone numbers, and addresses are protected at Pari Gift Center, Kinwat.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="container-custom max-w-4xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#E8272A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-none text-xs font-black uppercase tracking-wider mb-4">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mb-3">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            At <strong>Pari Gift Center & Fashion Hub</strong>, we respect your privacy and are committed to safeguarding
            your personal information. This policy describes how we collect, store, utilize, and protect your information
            in compliance with the <em>Information Technology Act, 2000</em> and the{' '}
            <em>Digital Personal Data Protection Act (DPDPA), 2023</em> of India.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-xs text-gray-500 font-medium">
            <span>Effective Date: September 2026</span>
            <span>Entity: Pari Gift Center, Kinwat Bazar, Maharashtra</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white border border-gray-200 p-6 sm:p-10 space-y-8 text-sm sm:text-[15px] leading-relaxed text-gray-700 shadow-xs">
          {/* Section 1: Information We Collect */}
          <section>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">1.</span> Personal Information We Collect
            </h2>
            <p className="mb-3">
              We collect only the minimum necessary information required to process and fulfill your shopping orders and
              provide 30-minute delivery in Kinwat:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Phone Number:</strong> Used as your primary login identifier through secure SMS One-Time Passwords (OTP).
              </li>
              <li>
                <strong>Customer Profile & Delivery Address:</strong> Full name, residential or shop address, prominent Kinwat landmarks,
                and PIN code (431804).
              </li>
              <li>
                <strong>Order & Transaction Records:</strong> Item details, sizing variants, order timestamps, payment method selection
                (COD or Online), and delivery status logs.
              </li>
              <li>
                <strong>Device & Browser Metadata:</strong> IP address, basic device type, and session cookies strictly used to maintain
                active shopping cart contents and security tokens.
              </li>
            </ul>
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>We never store credit/debit card numbers, UPI PINs, or net banking passwords.</strong> All online financial transactions are handled end-to-end by our RBI-licensed payment aggregator (Razorpay).</span>
            </div>
          </section>

          {/* Section 2: How We Use Your Data */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">2.</span> How We Use Your Information
            </h2>
            <p className="mb-3">Your data is utilized strictly for legitimate retail operations:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Order Fulfillment</h3>
                <p className="text-xs text-gray-600">
                  Picking garments, jewellery, toys, or cosmetics from our Kinwat shop shelves, packing, and dispatching via our local delivery staff within 30 minutes.
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Order & SMS Notifications</h3>
                <p className="text-xs text-gray-600">
                  Sending automated order confirmation receipts, out-for-delivery status updates, and digital payment confirmations.
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Account Management</h3>
                <p className="text-xs text-gray-600">
                  Allowing you to track live delivery progress, view order invoices, and save preferred Kinwat delivery locations.
                </p>
              </div>
              <div className="border border-gray-200 p-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-1">Customer Support</h3>
                <p className="text-xs text-gray-600">
                  Assisting with sizing replacements, item inquiries, or payment reconciliations via our dedicated phone helpline.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Third Party Processors */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">3.</span> Authorized Third-Party Services
            </h2>
            <p className="mb-3">We partner with reputable enterprise service providers:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Razorpay Software Pvt. Ltd.:</strong> Operates our payment gateway for processing UPI, Debit/Credit Card, and Net Banking transactions under RBI regulations.
              </li>
              <li>
                <strong>Supabase Cloud Infrastructure:</strong> Provides encrypted PostgreSQL database storage protected by Row Level Security (RLS) policies.
              </li>
              <li>
                <strong>SMS & Dispatch Gateway:</strong> Transmits order receipts and delivery dispatch status directly to your registered mobile number.
              </li>
            </ul>
            <p className="mt-3 font-semibold text-gray-900 flex items-center gap-2 text-xs sm:text-sm">
              <ShieldAlert size={16} className="text-[#E8272A] flex-shrink-0" />
              <span>We NEVER sell, rent, trade, or share your personal telephone numbers or shopping habits with marketing telecallers or third-party advertisers.</span>
            </p>
          </section>

          {/* Section 4: Data Security */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">4.</span> Data Security & Storage Safeguards
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is secured via 256-bit Transport Layer Security (TLS / HTTPS).
              </li>
              <li>
                <strong>Row Level Security (RLS):</strong> Database records are strictly compartmentalized — customers can only view their own orders and addresses.
              </li>
              <li>
                <strong>Access Control:</strong> Administrative access is restricted to verified store personnel with authenticated role permissions.
              </li>
            </ul>
          </section>

          {/* Section 5: Customer Rights */}
          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">5.</span> Your Privacy Rights
            </h2>
            <p className="mb-2">Under Indian data protection standards, you maintain the following rights:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>The right to inspect and review your stored address and profile details.</li>
              <li>The right to update or correct inaccurate telephone or delivery information.</li>
              <li>The right to request account deactivation or deletion of stored delivery addresses by contacting our support team.</li>
            </ul>
          </section>

          {/* Section 6: Grievance Officer */}
          <section className="pt-6 border-t border-gray-100 bg-gray-50 p-5 border border-gray-200">
            <h2 className="font-serif text-lg font-bold text-gray-950 mb-2">Grievance Redressal & Contact</h2>
            <p className="text-xs sm:text-sm text-gray-700 mb-3">
              In accordance with Information Technology Rules, our designated Grievance Officer for Pari Gift Center is available at:
            </p>
            <div className="space-y-1.5 text-xs font-semibold text-gray-800">
              <div><strong>Store Name:</strong> Pari Gift Center & Fashion Hub</div>
              <div><strong>Location:</strong> Main Road, Kinwat Bazar, Dist. Nanded, Maharashtra – 431804</div>
              <div><strong>Support Telephone:</strong> +91 9422X XXXXX</div>
              <div><strong>Working Hours:</strong> Monday – Sunday, 10:00 AM – 8:00 PM IST</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
