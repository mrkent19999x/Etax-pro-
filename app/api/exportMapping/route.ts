import { NextRequest, NextResponse } from 'next/server'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_URL
  || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'etax-7fbf8'}/us-central1`

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const searchParams = request.nextUrl.searchParams
  const templateId = searchParams.get('templateId')

  if (!templateId) {
    return NextResponse.json({ error: 'templateId là bắt buộc' }, { status: 400 })
  }

  try {
    const response = await fetch(`${FUNCTIONS_BASE}/exportMapping?templateId=${templateId}`, {
      method: 'GET',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    return NextResponse.json(await response.json(), { status: response.status })
  } catch (error) {
    console.error('Error proxying exportMapping:', error)
    return NextResponse.json({ error: 'Lỗi khi gọi API' }, { status: 500 })
  }
}

