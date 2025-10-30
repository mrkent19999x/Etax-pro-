import { NextRequest, NextResponse } from 'next/server'
import { saveDocument } from '@/lib/firebase-service'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, mapping } = body || {}
    if (!templateId || !mapping) {
      return NextResponse.json({ error: 'Thiếu templateId hoặc mapping' }, { status: 400 })
    }
    await saveDocument('mappings', templateId, mapping)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating mapping:', error)
    return NextResponse.json({ error: 'Không cập nhật được mapping' }, { status: 500 })
  }
}

