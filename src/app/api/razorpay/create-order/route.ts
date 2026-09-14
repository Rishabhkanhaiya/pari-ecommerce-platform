import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: NextRequest) {
  try {
    const { amount, orderId } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const isMock = !keyId || keyId.includes('REPLACE') || !keySecret || keySecret.includes('REPLACE')

    if (isMock) {
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        is_mock: true,
      })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `pgc_${orderId.substring(0, 20)}`,
      notes: {
        db_order_id: orderId,
        shop: 'Pari Gift Center',
      },
    })

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
