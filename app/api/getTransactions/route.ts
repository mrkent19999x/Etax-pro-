import { NextRequest, NextResponse } from 'next/server'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_URL
  || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'etax-7fbf8'}/us-central1`

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const searchParams = request.nextUrl.searchParams
  const queryString = searchParams.toString()

  try {
    const url = queryString 
      ? `${FUNCTIONS_BASE}/getTransactions?${queryString}`
      : `${FUNCTIONS_BASE}/getTransactions`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    return NextResponse.json(await response.json(), { status: response.status })
  } catch (error) {
    console.error('Error proxying getTransactions:', error)
    return NextResponse.json({ error: 'Lỗi khi gọi API' }, { status: 500 })
  }
}

