import { NextRequest, NextResponse } from 'next/server';
import { updateFindingReview, getApplicationById } from '@/lib/storage/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { findingId, status, notes } = await request.json();
    if (!findingId || !status) {
      return NextResponse.json({ error: 'findingId and status are required' }, { status: 400 });
    }

    const finding = updateFindingReview(params.id, findingId, status, notes);
    if (!finding) {
      return NextResponse.json({ error: 'Finding not found' }, { status: 404 });
    }

    const updatedApp = getApplicationById(params.id);
    return NextResponse.json({ success: true, finding, application: updatedApp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update finding' }, { status: 500 });
  }
}
