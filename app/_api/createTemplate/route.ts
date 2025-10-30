import { NextRequest, NextResponse } from 'next/server'
import { saveDocument, serverTimestamp } from '@/lib/firebase-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, name, html, isActive = true } = body || {}
    if (!templateId || !name || !html) {
      return NextResponse.json({ error: 'Thiếu templateId, name hoặc html' }, { status: 400 })
    }
    await saveDocument('templates', templateId, {
      templateId,
      name,
      html,
      isActive,
      createdAt: serverTimestamp(),
    })
    return NextResponse.json({ success: true, templateId })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json({ error: 'Không tạo được template' }, { status: 500 })
  }
}

