import { NextRequest, NextResponse } from 'next/server'

const FUNCTIONS_BASE = process.env.NEXT_PUBLIC_FUNCTIONS_URL
  || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'etax-7fbf8'}/us-central1`

async function proxyRequest(request: NextRequest, endpoint: string) {
  const authHeader = request.headers.get('authorization')
  const body = await request.json()

  try {
    const response = await fetch(`${FUNCTIONS_BASE}${endpoint}`, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const text = await response.text()
    try {
      const json = JSON.parse(text)
      return NextResponse.json(json, { status: response.status })
    } catch {
      return NextResponse.json({ message: text }, { status: response.status })
    }
  } catch (error) {
    console.error(`Error proxying ${endpoint}:`, error)
    return NextResponse.json(
      { error: 'Lỗi khi gọi API' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/createUser')
}

