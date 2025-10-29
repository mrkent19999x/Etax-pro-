import { NextRequest, NextResponse } from 'next/server'
import { deleteDocument } from '@/lib/firebase-service'

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId là bắt buộc' }, { status: 400 })
  }

  try {
    await deleteDocument('users', userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Không xóa được user' }, { status: 500 })
  }
}

