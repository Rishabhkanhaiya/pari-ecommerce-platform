import Link from 'next/link'
import Logo from '@/components/common/Logo'
import { MapPin, Clock, Phone, Mail, ShieldCheck, Zap, RotateCcw, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const categories = [
    { name: 'Ladies Fashion & Kurtis', href: '/category/ladies-fashion' },
    { name: 'Bridal Jewellery & Bangles', href: '/category/jewellery' },
    { name: 'Cosmetics & Skincare', href: '/category/cosmetics-beauty' },
    { name: 'Kids Toys & Games', href: '/category/toys-games' },
    { name: 'Custom Gifts & Hampers', href: '/category/gifts-accessories' },
  ]

  const quickLinks = [
    { name: 'About Pari Gift Center', href: '/about' },
    { name: 'Contact & Store Visit', href: '/contact' },
    { name: 'Track Order', href: '/orders' },
    { name: '24-Hour Return Policy', href: '/refunds' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ]

  return (
    <footer className="bg-[#0F0E11] text-neutral-300 border-t border-neutral-800 relative z-20">
      {/* ─── 1. ARCHITECTURAL 4-PILLAR TRUST STRIP ─── */}
      <div className="border-b border-neutral-800/80 bg-[#16141A]">
        <div className="container-custom py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-none bg-[#E8272A]/10 border border-[#E8272A]/30 flex items-center justify-center text-[#E8272A] flex-shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-xs uppercase tracking-wider">30–45 Mins Delivery</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Hyperlocal drop in Kinwat</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-none bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-xs uppercase tracking-wider">100% Genuine Quality</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Direct physical shop stock</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <RotateCcw size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-xs uppercase tracking-wider">24-Hr Easy Exchange</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Free at shop or ₹40 pickup</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-none bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-xs uppercase tracking-wider">COD & Instant UPI</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Pay upon safe handover</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN FOOTER CONTENT ─── */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="mb-5">
              <Logo variant="white" size="md" />
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed max-w-sm">
              Kinwat’s premier fashion and lifestyle destination. Bringing you designer kurtis, traditional sarees, authentic bridal jewellery, cosmetics, toys and custom gift hampers with same-day express delivery.
            </p>

            {/* Refined Glassmorphic Social Badges */}
            <div className="flex items-center gap-2.5 mb-6">
              <a
                href="tel:+919422000000"
                className="w-10 h-10 rounded-none bg-neutral-900 border border-neutral-700 hover:border-[#E8272A] hover:bg-red-950/40 text-neutral-300 hover:text-[#E8272A] flex items-center justify-center transition-all shadow-xs"
                title="Call Customer Support"
              >
                <Phone size={17} />
              </a>

              <a
                href="https://instagram.com/parigiftcenter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-neutral-900 border border-neutral-700 hover:border-rose-500 hover:bg-rose-950/40 text-neutral-300 hover:text-rose-400 flex items-center justify-center transition-all shadow-xs"
                title="Follow on Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>

              <a
                href="https://facebook.com/parigiftcenter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-neutral-900 border border-neutral-700 hover:border-blue-500 hover:bg-blue-950/40 text-neutral-300 hover:text-blue-400 flex items-center justify-center transition-all shadow-xs"
                title="Connect on Facebook"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>

              <a
                href="https://maps.google.com/?q=Kinwat+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-none bg-neutral-900 border border-neutral-700 hover:border-amber-500 hover:bg-amber-950/40 text-neutral-300 hover:text-amber-400 flex items-center justify-center transition-all shadow-xs"
                title="Locate Store on Google Maps"
              >
                <MapPin size={18} />
              </a>
            </div>

            {/* Quick Admin Access Link */}
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 hover:text-amber-400 transition-colors"
              >
                <span>Store Owner Panel</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {/* Categories Column */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-widest border-l-2 border-[#E8272A] pl-2.5">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-widest border-l-2 border-[#E8272A] pl-2.5">
              Help &amp; Info
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kinwat Store Contact Column */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold mb-4 text-xs uppercase tracking-widest border-l-2 border-[#E8272A] pl-2.5">
              Kinwat Store Location
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-300">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#E8272A] mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-white block font-semibold">Pari Gift Center &amp; Fashion Hub</strong>
                  Main Road, Near Old Bus Stand, Kinwat Bazar,<br />
                  Dist. Nanded, Maharashtra – 431804
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Clock size={16} className="text-amber-400 flex-shrink-0" />
                <span>Mon–Sun: 10:00 AM – 8:30 PM IST (Fast Local Dispatch)</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone size={16} className="text-[#E8272A] flex-shrink-0" />
                <a href="tel:+919422000000" className="hover:text-white transition-colors font-medium">
                  +91 94220 00000 (Customer Support)
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail size={16} className="text-amber-400 flex-shrink-0" />
                <a
                  href="mailto:support@parigiftcenter.com"
                  className="hover:text-white transition-colors font-medium text-neutral-300"
                >
                  support@parigiftcenter.com
                </a>
              </li>
            </ul>

            {/* Express Delivery Badge Box */}
            <div className="mt-5 p-3.5 bg-neutral-900 border border-neutral-800 rounded-none flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap size={18} className="text-[#E8272A] flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-xs">30–45 Min Express Delivery</div>
                  <div className="text-neutral-400 text-[11px]">Free doorstep delivery on orders above ₹299</div>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5">
                Kinwat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. SLEEK PAYMENT CHIPS & COPYRIGHT BOTTOM BAR ─── */}
      <div className="border-t border-neutral-800/80 bg-[#0A090C]">
        <div className="container-custom py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="text-center lg:text-left">
              <p className="text-xs text-neutral-400">
                © {currentYear} Pari Gift Center &amp; Fashion Hub. All rights reserved.
              </p>
              <p className="text-[11px] text-neutral-600 mt-0.5">
                Serving Kinwat, Gokunda, Shivajinagar &amp; nearby Maharashtra regions with authentic goods.
              </p>
            </div>

            {/* Crisp High-Res Inline Payment Badges (No broken images) */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-neutral-300">
              {/* UPI */}
              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] font-bold tracking-wider text-white flex items-center gap-1.5">
                <Zap size={12} className="text-emerald-400" />
                <span>UPI</span>
              </div>

              {/* Google Pay */}
              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-neutral-200">
                GPay
              </div>

              {/* PhonePe */}
              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-purple-300">
                PhonePe
              </div>

              {/* Paytm */}
              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-sky-400">
                Paytm
              </div>

              {/* RuPay */}
              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-amber-400">
                RuPay
              </div>

              {/* Cards */}
              <div className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-neutral-200">
                Cards &amp; NetBanking
              </div>

              {/* COD */}
              <div className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-700 text-[11px] font-extrabold text-emerald-400">
                Cash on Delivery (COD)
              </div>

              {/* Razorpay Trust */}
              <div className="flex items-center gap-1.5 pl-2 text-[11px] text-neutral-400 font-medium">
                <Lock size={12} className="text-emerald-400" />
                <span>256-Bit SSL • Razorpay Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
