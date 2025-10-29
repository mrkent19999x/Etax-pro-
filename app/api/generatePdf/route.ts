import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mst = searchParams.get('mst')
  const templateId = searchParams.get('templateId')
  const authHeader = request.headers.get('authorization')

  if (!mst) {
    return NextResponse.json(
      { error: 'Thiếu tham số MST!' },
      { status: 400 }
    )
  }

  try {
    // Trong production, đây sẽ forward tới Firebase Functions URL
    // Trong local development, có thể chạy emulator hoặc trỏ tới deployed Functions
    const functionsUrl = process.env.NEXT_PUBLIC_FUNCTIONS_URL
      || `http://localhost:5001/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'etax-7fbf8'}/us-central1/generatePdf`

    const params = new URLSearchParams({ mst })
    if (templateId) {
      params.append('templateId', templateId)
    }

    const response = await fetch(`${functionsUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        ...(authHeader && { Authorization: authHeader }),
        'Content-Type': 'application/pdf',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      )
    }

    const pdfBuffer = await response.arrayBuffer()
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Giay_nop_tien_MST_${mst}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error proxying PDF generation:', error)
    return NextResponse.json(
      { error: 'Không thể tạo PDF. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}

