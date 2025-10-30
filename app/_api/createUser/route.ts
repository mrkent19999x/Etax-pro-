import { NextRequest, NextResponse } from 'next/server'
import { saveDocument, serverTimestamp } from '@/lib/firebase-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mst, password, name, role = 'user', mstList = [] } = body || {}

    if (!mst || !password || !name) {
      return NextResponse.json({ error: 'Thiếu trường bắt buộc (mst, password, name)' }, { status: 400 })
    }

    const userId = mst
    await saveDocument('users', userId, {
      userId,
      mst,
      password,
      name,
      role,
      mstList,
      createdAt: serverTimestamp(),
    })

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Không tạo được user' }, { status: 500 })
  }
}

