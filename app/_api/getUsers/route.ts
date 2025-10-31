import { NextRequest, NextResponse } from 'next/server'
import { getAllDocuments } from '@/lib/firebase-service'

export async function GET(_request: NextRequest) {
  try {
    const users = await getAllDocuments('users')
    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error getting users:', error)
    return NextResponse.json({ error: 'Không lấy được danh sách users' }, { status: 500 })
  }
}

