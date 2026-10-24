import { NextRequest, NextResponse } from 'next/server';
import { buildSyntheticPDF, SAMPLE_PRESETS } from '@/lib/pdf/sampleGenerator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preset = searchParams.get('preset') || 'validLandDeed';

    const config = SAMPLE_PRESETS[preset] || SAMPLE_PRESETS.validLandDeed;
    const buffer = buildSyntheticPDF(config);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${preset}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate sample PDF' }, { status: 500 });
  }
}
