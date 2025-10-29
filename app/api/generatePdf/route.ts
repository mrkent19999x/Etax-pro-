import { NextRequest, NextResponse } from 'next/server'

// Demo stub: tạo PDF giả (byte buffer từ một chuỗi) để tải xuống
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mst = searchParams.get('mst')
  const templateId = searchParams.get('templateId')

  if (!mst) {
    return NextResponse.json({ error: 'Thiếu tham số MST!' }, { status: 400 })
  }

  const content = `PDF DEMO\nMST: ${mst}\nTemplate: ${templateId || 'N/A'}\nThời gian: ${new Date().toISOString()}`
  const encoder = new TextEncoder()
  const pdfBuffer = encoder.encode(content)

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Giay_nop_tien_MST_${mst}.pdf"`,
    },
  })
}

