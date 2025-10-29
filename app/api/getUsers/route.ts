import { NextRequest, NextResponse } from 'next/server'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_URL
  || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'etax-7fbf8'}/us-central1`

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  try {
    const response = await fetch(`${FUNCTIONS_BASE}/getUsers`, {
      method: 'GET',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying getUsers:', error)
    return NextResponse.json(
      { error: 'Lỗi khi gọi API' },
      { status: 500 }
    )
  }
}

