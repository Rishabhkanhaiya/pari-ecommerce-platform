// WhatsApp notification helper using WATI API
// Sends order notifications to shop owner's WhatsApp

interface OrderNotificationPayload {
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  paymentMethod: string
  paymentStatus: string
}

export async function sendOrderNotificationToShop(payload: OrderNotificationPayload) {
  const shopWhatsApp = process.env.WHATSAPP_SHOP_NUMBER
  if (!shopWhatsApp) {
    console.warn('WhatsApp shop number not configured')
    return
  }

  const itemsList = payload.items
    .map((item) => `• ${item.name} x${item.quantity} = ₹${(item.price * item.quantity).toFixed(0)}`)
    .join('\n')

  const message = `*NEW ORDER - Pari Gift Center*

Order #${payload.orderNumber}
Customer: ${payload.customerName}
Phone: ${payload.customerPhone}

*Delivery Address:*
${payload.deliveryAddress}

*Items Ordered:*
${itemsList}

*Bill Summary:*
Subtotal: ₹${payload.subtotal.toFixed(0)}
${payload.discount > 0 ? `Discount: -₹${payload.discount.toFixed(0)}\n` : ''}Delivery: ${payload.deliveryFee === 0 ? 'FREE' : `₹${payload.deliveryFee.toFixed(0)}`}
*Total: ₹${payload.total.toFixed(0)}*

Payment: ${payload.paymentMethod.toUpperCase()} - ${payload.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}

Target: Confirm & dispatch for 30–45 min delivery!`

  try {
    // Try WATI API first
    if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_ACCESS_TOKEN) {
      const response = await fetch(
        `${process.env.WHATSAPP_API_URL}/sendSessionMessage/${shopWhatsApp}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({ messageText: message }),
        }
      )

      if (response.ok) {
        return { success: true }
      }
    }

    // Fallback: log to console (for development)
    console.log('WhatsApp Notification (Dev Mode):\n', message)
    return { success: true, dev: true }
  } catch (error) {
    console.error('WhatsApp notification failed:', error)
    return { success: false, error }
  }
}

export async function sendOrderStatusUpdate(
  customerPhone: string,
  orderNumber: string,
  status: string
) {
  const statusMessages: Record<string, string> = {
    confirmed: `Your order #${orderNumber} has been confirmed. We are preparing it now.`,
    packed: `Your order #${orderNumber} is packed and ready for dispatch.`,
    out_for_delivery: `Your order #${orderNumber} is out for delivery with our Kinwat rider. Expected in 15-30 minutes.`,
    delivered: `Your order #${orderNumber} has been delivered. Thank you for shopping at Pari Gift Center.`,
    cancelled: `Your order #${orderNumber} has been cancelled. Contact our support team for any queries.`,
  }

  const message = statusMessages[status]
  if (!message) return

  const whatsappLink = `https://api.whatsapp.com/send?phone=${customerPhone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`
  console.log('Customer WhatsApp update link:', whatsappLink)

  // If WATI configured, send directly
  if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_ACCESS_TOKEN) {
    try {
      await fetch(
        `${process.env.WHATSAPP_API_URL}/sendSessionMessage/${customerPhone.replace(/\D/g, '')}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({ messageText: message }),
        }
      )
    } catch (error) {
      console.error('Failed to send customer WhatsApp update:', error)
    }
  }
}
