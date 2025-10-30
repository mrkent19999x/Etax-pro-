import { NextRequest, NextResponse } from 'next/server'
import { saveDocument, serverTimestamp } from '@/lib/firebase-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mst, templateId, amount, note } = body || {}
    if (!mst || !templateId || amount == null) {
      return NextResponse.json({ error: 'Thiếu mst, templateId hoặc amount' }, { status: 400 })
    }
    const txId = `${mst}_${Date.now()}`
    await saveDocument('transactions', txId, {
      transactionId: txId,
      mst,
      templateId,
      amount,
      note: note || '',
      createdAt: serverTimestamp(),
    })
    return NextResponse.json({ success: true, transactionId: txId })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Không tạo được transaction' }, { status: 500 })
  }
}
