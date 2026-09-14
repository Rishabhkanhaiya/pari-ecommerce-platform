import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase service role credentials not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
    if (!validMimes.includes(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid file format: ${file.type}. Please upload JPG, PNG, or WEBP.` },
        { status: 400 }
      )
    }

    // Validate size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 8MB limit. Please choose a smaller photo.' },
        { status: 400 }
      )
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    })
  } catch (err: any) {
    console.error('Upload handler exception:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while processing image' },
      { status: 500 }
    )
  }
}
