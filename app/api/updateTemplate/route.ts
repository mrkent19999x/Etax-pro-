import { NextRequest, NextResponse } from 'next/server'
import { updateDocument } from '@/lib/firebase-service'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, data } = body || {}
    if (!templateId || !data) {
      return NextResponse.json({ error: 'Thiếu templateId hoặc data' }, { status: 400 })
    }
    await updateDocument('templates', templateId, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json({ error: 'Không cập nhật được template' }, { status: 500 })
  }
}

