import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { sendOrderNotificationToShop } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  try {

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      db_order_id,
    } = await request.json()

    const isMock = razorpay_signature === 'mock_signature' || razorpay_order_id.startsWith('order_mock_')

    if (!isMock) {
      // Verify Razorpay signature
      const body = razorpay_order_id + '|' + razorpay_payment_id
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body)
        .digest('hex')

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        )
      }
    }

    // Update payment record
    await supabase.from('payments').update({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      status: 'paid',
    }).eq('order_id', db_order_id)

    // Update order payment status
    const { data: order } = await supabase
      .from('orders')
      .update({ payment_status: 'paid', status: 'confirmed' })
      .eq('id', db_order_id)
      .select(`
        *,
        items:order_items(*)
      `)
      .single()

    // Send WhatsApp notification to shop owner
    if (order) {
      await sendOrderNotificationToShop({
        orderNumber: order.order_number,
        customerName: order.delivery_name,
        customerPhone: order.delivery_phone,
        deliveryAddress: `${order.delivery_address}, ${order.delivery_city} - ${order.delivery_pincode}`,
        items: order.items?.map((item: any) => ({
          name: item.product_name + (item.variant_name ? ` (${item.variant_name})` : ''),
          quantity: item.quantity,
          price: item.unit_price,
        })) || [],
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        discount: order.discount,
        total: order.total,
        paymentMethod: order.payment_method,
        paymentStatus: 'paid',
      })
    }

    return NextResponse.json({ success: true, order_id: db_order_id })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}
