'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, CheckCircle2, ShieldCheck, MapPin, Clock, Phone, Globe, RotateCcw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    shop_name: 'Pari Gift Center & Fashion Hub',
    shop_phone: '+91 94220 00000',
    shop_email: 'support@parigiftcenter.com',
    shop_address: 'Main Road, Opp. Old Bus Stand, Kinwat Bazar, Maharashtra – 431804',
    shop_timings: 'Mon–Sun: 10:00 AM – 8:30 PM IST',
    gst_number: '27AABCP1234F1Z5',
    instagram_url: 'https://instagram.com/parigiftcenter',
    facebook_url: 'https://facebook.com/parigiftcenter',
    maps_url: 'https://maps.google.com/?q=Kinwat+Maharashtra',
    delivery_time_text: '30–45 Mins',
    delivery_start: '10',
    delivery_end: '20',
    free_delivery_above: '299',
    delivery_fee: '40',
    return_fee: '40',
    return_validity_hours: '24',
    announcement_bar: '30–45 Mins Express Delivery across Kinwat & nearby areas | Free delivery on orders above ₹299',
    razorpay_key_id: '',
  })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('settings').select('*').then(({ data }) => {
      if (data && data.length > 0) {
        setSettings((prev) => {
          const map = { ...prev }
          data.forEach((s: any) => {
            if (s.value !== undefined && s.value !== null) {
              map[s.key] = s.value
            }
          })
          return map
        })
      }
    })
  }, [])

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const upserts = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
      if (error) throw error
      toast.success('All settings saved successfully')
    } catch (e: any) {
      toast.error(e.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const SettingInput = ({
    label,
    settingKey,
    placeholder,
    type = 'text',
    hint,
  }: {
    label: string
    settingKey: string
    placeholder?: string
    type?: string
    hint?: string
  }) => (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{label}</label>
      <input
        type={type}
        value={settings[settingKey] || ''}
        onChange={(e) => updateSetting(settingKey, e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )

  return (
    <div className="max-w-6xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings & Configuration</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Configure Kinwat shop information, delivery charges, timings, policies & social links
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2 shadow-md shadow-red-500/20 active:scale-95"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Shop Details */}
        <div className="admin-card">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E8272A] flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Store Identity & Contact</h2>
              <p className="text-xs text-gray-400">Displayed in Header, Footer & Store Invoices</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingInput
              label="Shop Name"
              settingKey="shop_name"
              placeholder="Pari Gift Center & Fashion Hub"
            />
            <SettingInput
              label="Customer Support Phone"
              settingKey="shop_phone"
              placeholder="+91 94220 00000"
              hint="Shown in header and footer contact cards"
            />
            <SettingInput
              label="Store Support Email"
              settingKey="shop_email"
              placeholder="support@parigiftcenter.com"
              hint="Shown on customer order receipts and contact page"
            />
            <SettingInput
              label="Physical Shop Address"
              settingKey="shop_address"
              placeholder="Main Road, Opp. Old Bus Stand, Kinwat Bazar, Maharashtra – 431804"
            />
            <SettingInput
              label="Store Working Hours"
              settingKey="shop_timings"
              placeholder="Mon–Sun: 10:00 AM – 8:30 PM IST"
            />
            <SettingInput
              label="GST / Business Number"
              settingKey="gst_number"
              placeholder="27AABCP1234F1Z5"
            />
          </div>
        </div>

        {/* 2. Hyperlocal Delivery & Return Rules */}
        <div className="admin-card">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Hyperlocal Delivery & Returns</h2>
              <p className="text-xs text-gray-400">Control thresholds, delivery buffers & return charges</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingInput
              label="Delivery Time Display"
              settingKey="delivery_time_text"
              placeholder="30–45 Mins"
              hint="Shown on banners, product cards & search dropdowns"
            />
            <div className="grid grid-cols-2 gap-3">
              <SettingInput
                label="Free Delivery Above (₹)"
                settingKey="free_delivery_above"
                placeholder="299"
                type="number"
                hint="Cart above this gets free delivery"
              />
              <SettingInput
                label="Standard Delivery Fee (₹)"
                settingKey="delivery_fee"
                placeholder="40"
                type="number"
                hint="Charged if cart is under threshold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SettingInput
                label="Doorstep Return Fee (₹)"
                settingKey="return_fee"
                placeholder="40"
                type="number"
                hint="Pickup fee (Free at Kinwat shop counter)"
              />
              <SettingInput
                label="Return Validity (Hours)"
                settingKey="return_validity_hours"
                placeholder="24"
                type="number"
                hint="Maximum hours allowed for exchange requests"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SettingInput
                label="Dispatch Start Hour (24H)"
                settingKey="delivery_start"
                placeholder="10"
                type="number"
                hint="10 = 10:00 AM"
              />
              <SettingInput
                label="Dispatch End Hour (24H)"
                settingKey="delivery_end"
                placeholder="20"
                type="number"
                hint="20 = 8:00 PM"
              />
            </div>
          </div>
        </div>

        {/* 3. Social Media & Navigation */}
        <div className="admin-card">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Social Media & Map Links</h2>
              <p className="text-xs text-gray-400">Links shown in the footer and contact pages</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingInput
              label="Instagram URL"
              settingKey="instagram_url"
              placeholder="https://instagram.com/parigiftcenter"
            />
            <SettingInput
              label="Facebook URL"
              settingKey="facebook_url"
              placeholder="https://facebook.com/parigiftcenter"
            />
            <SettingInput
              label="Google Maps Location URL"
              settingKey="maps_url"
              placeholder="https://maps.google.com/?q=Pari+Gift+Center+Kinwat"
              hint="Direct link to your store on Google Maps"
            />
          </div>
        </div>

        {/* 4. Payment Gateway & Announcements */}
        <div className="admin-card">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">Gateways & Announcements</h2>
              <p className="text-xs text-gray-400">Razorpay API key & top promotional ticker</p>
            </div>
          </div>
          <div className="space-y-4">
            <SettingInput
              label="Razorpay Key ID"
              settingKey="razorpay_key_id"
              placeholder="rzp_live_XXXXXXXXXXXXXXXX"
              hint="Keep RAZORPAY_KEY_SECRET securely in .env.local file"
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Top Announcement Ticker
              </label>
              <textarea
                rows={3}
                value={settings['announcement_bar'] || ''}
                onChange={(e) => updateSetting('announcement_bar', e.target.value)}
                className="input-field resize-none text-xs"
                placeholder="30–45 Mins Express Delivery across Kinwat & nearby areas | Free delivery on orders above ₹299"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
