import { NextRequest, NextResponse } from 'next/server'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_URL
  || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'etax-7fbf8'}/us-central1`

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId là bắt buộc' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${FUNCTIONS_BASE}/deleteUser?userId=${userId}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const text = await response.text()
    try {
      const json = JSON.parse(text)
      return NextResponse.json(json, { status: response.status })
    } catch {
      return NextResponse.json({ message: text }, { status: response.status })
    }
  } catch (error) {
    console.error('Error proxying deleteUser:', error)
    return NextResponse.json(
      { error: 'Lỗi khi gọi API' },
      { status: 500 }
    )
  }
}

