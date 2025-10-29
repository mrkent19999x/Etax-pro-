import { NextRequest, NextResponse } from 'next/server'
import { updateDocument } from '@/lib/firebase-service'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { mst, data } = body || {}

    if (!mst || !data) {
      return NextResponse.json({ error: 'Thiếu mst hoặc data' }, { status: 400 })
    }

    await updateDocument('users', mst, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Không cập nhật được user' }, { status: 500 })
  }
}

