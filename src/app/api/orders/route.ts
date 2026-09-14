import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderNotificationToShop } from '@/lib/whatsapp'

// POST /api/orders — create a new order
export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    const body = await request.json()
    const {
      userId,
      addressId,
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      deliveryCity,
      deliveryPincode,
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode,
      couponId,
      paymentMethod,
      notes,
    } = body

    // Validate items and check stock
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock, name')
        .eq('id', item.productId)
        .single()

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` },
          { status: 400 }
        )
      }
    }

    // Generate order number
    const { data: orderNumData } = await supabase.rpc('generate_order_number')
    const orderNumber = orderNumData || `PGC${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        address_id: addressId,
        delivery_name: deliveryName,
        delivery_phone: deliveryPhone,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_pincode: deliveryPincode,
        subtotal,
        discount,
        delivery_fee: deliveryFee,
        total,
        coupon_code: couponCode,
        coupon_id: couponId,
        payment_method: paymentMethod,
        payment_status: 'pending',
        status: 'pending',
        notes,
        estimated_delivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      product_name: item.name,
      variant_name: item.variantName || null,
      product_image: item.image || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    await supabase.from('order_items').insert(orderItems)

    // Create payment record
    await supabase.from('payments').insert({
      order_id: order.id,
      amount: total,
      currency: 'INR',
      status: 'pending',
    })

    // Decrement stock for each item
    for (const item of items) {
      if (item.variantId) {
        await supabase.rpc('decrement_variant_stock', {
          v_id: item.variantId,
          qty: item.quantity,
        })
      } else {
        await supabase.rpc('decrement_product_stock', {
          p_id: item.productId,
          qty: item.quantity,
        })
      }
    }

    // Update coupon usage count
    if (couponId) {
      await supabase
        .from('coupons')
        .update({ used_count: supabase.rpc('increment', { row_id: couponId }) })
        .eq('id', couponId)
    }

    // For COD orders, notify store
    if (paymentMethod === 'cod') {
      try {
        await sendOrderNotificationToShop({
          orderNumber,
          customerName: deliveryName,
          customerPhone: deliveryPhone,
          deliveryAddress: `${deliveryAddress}, ${deliveryCity} - ${deliveryPincode}`,
          items: items.map((item: any) => ({
            name: item.name + (item.variantName ? ` (${item.variantName})` : ''),
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          deliveryFee,
          discount,
          total,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'pending',
        })
      } catch (notifyErr) {
        console.warn('Dispatch notification skipped:', notifyErr)
      }
    }

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
