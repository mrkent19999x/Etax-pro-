import { NextRequest, NextResponse } from 'next/server'
import { getDocument } from '@/lib/firebase-service'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const templateId = searchParams.get('templateId')

  if (!templateId) {
    return NextResponse.json({ error: 'templateId là bắt buộc' }, { status: 400 })
  }

  try {
    const mapping = await getDocument('mappings', templateId)
    return NextResponse.json({ templateId, mapping: mapping || {} })
  } catch (error) {
    console.error('Error exporting mapping:', error)
    return NextResponse.json({ error: 'Không export được mapping' }, { status: 500 })
  }
}

