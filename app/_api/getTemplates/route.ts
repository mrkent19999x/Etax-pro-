import { NextRequest, NextResponse } from 'next/server'
import { getAllDocuments } from '@/lib/firebase-service'

export async function GET(_request: NextRequest) {
  try {
    const templates = await getAllDocuments('templates')
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error getting templates:', error)
    return NextResponse.json({ error: 'Không lấy được templates' }, { status: 500 })
  }
}

