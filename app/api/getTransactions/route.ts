import { NextRequest, NextResponse } from 'next/server'
import { getAllDocuments, queryDocuments } from '@/lib/firebase-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mst = searchParams.get('mst')
  try {
    const transactions = mst
      ? await queryDocuments('transactions', 'mst', '==', mst)
      : await getAllDocuments('transactions')
    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error getting transactions:', error)
    return NextResponse.json({ error: 'Không lấy được transactions' }, { status: 500 })
  }
}

