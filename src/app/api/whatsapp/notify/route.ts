import { NextRequest, NextResponse } from 'next/server'
import { sendOrderStatusUpdate } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const { customerPhone, orderNumber, status } = await request.json()
    await sendOrderStatusUpdate(customerPhone, orderNumber, status)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('WhatsApp notify error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
