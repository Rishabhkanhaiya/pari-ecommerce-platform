'use client'

import { useState } from 'react'
import { MapPin, Clock, Phone, Mail, Send, CheckCircle2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number')
      return
    }

    setSubmitted(true)
    toast.success('Inquiry submitted successfully! Our team will contact you shortly.')
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 sm:py-14">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-8 sm:p-12 mb-8 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#E8272A] bg-rose-50 border border-rose-200 px-3 py-1 inline-block mb-3">
            Customer Support &amp; Local Store
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-950 mb-3">
            Contact Pari Gift Center &amp; Fashion Hub
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Have questions about products, dress sizes, celebration gift hampers, or delivery timelines? Our Kinwat store team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Store Location */}
            <div className="bg-white border border-gray-200 p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 text-[#E8272A] flex items-center justify-center flex-shrink-0 border border-red-200">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Store Address</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Pari Gift Center &amp; Fashion Hub</strong><br />
                    Main Road, Near Old Bus Stand,<br />
                    Kinwat Bazar, Dist. Nanded,<br />
                    Maharashtra – 431804
                  </p>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="bg-white border border-gray-200 p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Working Hours</h3>
                  <p className="text-xs text-gray-600">
                    Monday to Sunday<br />
                    <strong>10:00 AM – 8:30 PM IST</strong><br />
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1 mt-1"><Zap size={13} /> Active 30–45 Min Dispatch</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Phone & Email */}
            <div className="bg-white border border-gray-200 p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-200">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Direct Hotline</h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Phone: <a href="tel:+919422000000" className="font-bold text-gray-900 hover:text-[#E8272A]">+91 94220 00000</a>
                  </p>
                  <a
                    href="mailto:support@parigiftcenter.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-colors"
                  >
                    <Mail size={13} className="text-amber-400" />
                    <span>Email Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
                Send an Inquiry or Message
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill this form and our Kinwat store team will contact you directly on your mobile number.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-600" />
                  <h3 className="font-bold text-base">Inquiry Submitted!</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    Thank you {form.name}! Our store counter has received your inquiry and will reach out to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setForm({ name: '', phone: '', message: '' })
                    }}
                    className="mt-4 text-xs font-bold text-emerald-800 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Message / Inquiry Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what product or assistance you need..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-field text-xs resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#E8272A] hover:bg-[#CC1A1D] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
                  >
                    <Send size={14} />
                    <span>Send Message to Store</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
