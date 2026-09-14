'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Phone, ArrowRight, Shield, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Suspense } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits.startsWith('91') ? '+' + digits : digits.length === 10 ? '+91' + digits : digits
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    const formattedPhone = formatPhone(phone)
    if (formattedPhone.length < 12) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      })
      if (error) throw error
      setStep('otp')
      toast.success('OTP sent to your mobile number')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const formattedPhone = formatPhone(phone)
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms',
      })
      if (error) throw error
      toast.success('Welcome to Pari Gift Center')
      router.push(redirect)
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-primary">
              <span className="text-white font-bold text-3xl font-display">P</span>
            </div>
            <div className="font-display font-bold text-2xl text-gray-900">Pari Gift Center</div>
            <div className="text-sm text-gray-500 mt-1">Kinwat's favourite online store</div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card-hover p-8">
          {step === 'phone' ? (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Login / Register</h1>
              <p className="text-sm text-gray-500 mb-6">Enter your mobile number to continue</p>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-bold uppercase tracking-wider">
                      +91 (IN)
                    </div>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="input-field flex-1"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Phone size={18} />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Verify OTP</h1>
              <p className="text-sm text-gray-500 mb-2">
                Enter the 6-digit code sent to{' '}
                <span className="font-medium text-gray-900">+91 {phone}</span>
              </p>
              <button
                onClick={() => { setStep('phone'); setOtp('') }}
                className="text-xs text-primary-500 hover:underline mb-6 block"
              >
                ← Change number
              </button>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl font-bold tracking-widest"
                  maxLength={6}
                  autoFocus
                  required
                />

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      Verify & Login <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full text-sm text-gray-500 hover:text-primary-500 transition-colors"
                >
                  Didn't receive? Resend OTP
                </button>
              </form>
            </>
          )}

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
            <Shield size={12} />
            <span>Your data is safe and encrypted</span>
          </div>

          {/* Store Owner Quick Admin Access */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Store Owner Access
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
            >
              <span>Enter Admin Panel (Direct Access)</span>
              <ArrowRight size={14} className="text-amber-400" />
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-primary-500 hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
