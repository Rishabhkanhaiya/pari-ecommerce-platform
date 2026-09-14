// Razorpay integration utilities

export async function createRazorpayOrder(amount: number, orderId: string) {
  const response = await fetch('/api/razorpay/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, orderId }),
  })
  if (!response.ok) {
    throw new Error('Failed to create Razorpay order')
  }
  return response.json()
}

export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: {
    name: string
    contact: string
    email?: string
  }
  theme: { color: string }
  handler: (response: RazorpayResponse) => void
  modal?: {
    ondismiss?: () => void
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export async function initiatePayment(options: {
  amount: number
  orderId: string
  dbOrderId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  onSuccess: (response: RazorpayResponse) => void
  onDismiss?: () => void
}) {
  const isLoaded = await loadRazorpay()
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load. Check your internet connection.')
  }

  const razorpayOrder = await createRazorpayOrder(options.amount, options.dbOrderId)

  if (razorpayOrder.is_mock) {
    options.onSuccess({
      razorpay_payment_id: `pay_mock_${Date.now()}`,
      razorpay_order_id: razorpayOrder.id,
      razorpay_signature: 'mock_signature',
    })
    return
  }

  const paymentOptions: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency || 'INR',
    name: 'Pari Gift Center',
    description: `Order #${options.orderId}`,
    order_id: razorpayOrder.id,
    prefill: {
      name: options.customerName,
      contact: options.customerPhone,
      email: options.customerEmail,
    },
    theme: {
      color: '#E8272A',
    },
    handler: options.onSuccess,
    modal: {
      ondismiss: options.onDismiss,
    },
  }

  const razorpay = new (window as any).Razorpay(paymentOptions)
  razorpay.open()
}
