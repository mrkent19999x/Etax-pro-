import { NextRequest, NextResponse } from 'next/server'
import { deleteDocument } from '@/lib/firebase-service'

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const templateId = searchParams.get('templateId')
  if (!templateId) {
    return NextResponse.json({ error: 'templateId là bắt buộc' }, { status: 400 })
  }

  try {
    await deleteDocument('templates', templateId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting template:', error)
    return NextResponse.json({ error: 'Không xóa được template' }, { status: 500 })
  }
}

