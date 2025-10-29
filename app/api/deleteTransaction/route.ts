import { NextRequest, NextResponse } from 'next/server'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_URL
  || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'anhbao-373f3'}/us-central1`

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const searchParams = request.nextUrl.searchParams
  const transactionId = searchParams.get('transactionId')

  if (!transactionId) {
    return NextResponse.json({ error: 'transactionId là bắt buộc' }, { status: 400 })
  }

  try {
    const response = await fetch(`${FUNCTIONS_BASE}/deleteTransaction?transactionId=${transactionId}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const text = await response.text()
    try {
      return NextResponse.json(JSON.parse(text), { status: response.status })
    } catch {
      return NextResponse.json({ message: text }, { status: response.status })
    }
  } catch (error) {
    console.error('Error proxying deleteTransaction:', error)
    return NextResponse.json({ error: 'Lỗi khi gọi API' }, { status: 500 })
  }
}

