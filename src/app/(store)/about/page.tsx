import Link from 'next/link'
import { MapPin, Clock, Phone, MessageCircle, Sparkles, Heart, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-14">
      <div className="container-custom max-w-4xl">
        {/* Header Hero */}
        <div className="bg-white border border-gray-200 p-8 sm:p-12 mb-8 shadow-xs">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-[#E8272A] px-3 py-1 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles size={13} />
            <span>Kinwat's Trusted Heritage</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mb-4">
            About Pari Gift Center &amp; Fashion Hub
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Welcome to <strong>Pari Gift Center &amp; Fashion Hub</strong> — Kinwat’s premier shopping destination for ladies ethnic wear, bridal and everyday fashion jewellery, branded cosmetics, children's toys, and customized celebration gifts.
          </p>
        </div>

        {/* Story & Philosophy */}
        <div className="bg-white border border-gray-200 p-8 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 shadow-xs mb-8">
          <section>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">1.</span> Rooted in Kinwat, Maharashtra
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Serving the families of Kinwat Bazar, Gokunda, Shivajinagar, and surrounding towns, Pari Gift Center was established with one timeless mission: to bring the finest festive attire, royal jewellery, and thoughtful gifts right to your local neighborhood with personalized care.
            </p>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">2.</span> Why We Built Hyperlocal Express Delivery
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Major e-commerce apps take 3 to 5 business days to ship packages to Kinwat from distant warehouses. We believe that when you have an urgent family gathering, an impromptu wedding celebration, or a child's birthday party, you shouldn't have to wait days.
            </p>
            <div className="bg-amber-50/70 border border-amber-200 p-5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                <Zap size={16} className="text-[#E8272A]" />
                <span>30–45 Mins Doorstep Delivery</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700">
                Every order placed on our platform is hand-picked directly from our active Kinwat store shelves, professionally packaged, and dispatched immediately via local riders so you get it in 30 to 45 minutes.
              </p>
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-[#E8272A] font-sans">3.</span> Our Core Commitments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 bg-gray-50/60">
                <div className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>100% Genuine Handpicked Stock</span>
                </div>
                <p className="text-xs text-gray-500">
                  Every saree, kurti, lipstick, and toy is verified for fabric quality, durability, and authenticity.
                </p>
              </div>

              <div className="p-4 border border-gray-200 bg-gray-50/60">
                <div className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                  <Heart size={16} className="text-[#E8272A]" />
                  <span>Complimentary Gift Wrapping</span>
                </div>
                <p className="text-xs text-gray-500">
                  Celebrate birthdays and anniversaries with elegant gift boxes and decorative wrapping ribbons.
                </p>
              </div>

              <div className="p-4 border border-gray-200 bg-gray-50/60">
                <div className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <span>Inspect Before You Pay</span>
                </div>
                <p className="text-xs text-gray-500">
                  Cash on delivery and UPI at doorstep give you complete peace of mind.
                </p>
              </div>

              <div className="p-4 border border-gray-200 bg-gray-50/60">
                <div className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  <span>24-Hour Fair Exchange Policy</span>
                </div>
                <p className="text-xs text-gray-500">
                  Free size exchange at our Kinwat counter within 24 hours (or ₹40 doorstep pickup).
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Store Location Card */}
        <div className="bg-neutral-900 text-white p-6 sm:p-8 border border-neutral-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Visit Us In Person</div>
            <div className="text-xl font-serif font-bold">Kinwat Bazar Physical Store</div>
            <p className="text-xs text-neutral-400 mt-1">Main Road, Near Old Bus Stand, Kinwat, Maharashtra – 431804</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="tel:+919422000000"
              className="px-5 py-3 border border-neutral-700 hover:border-white text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Phone size={15} className="text-[#E8272A]" />
              <span>Call Store</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
