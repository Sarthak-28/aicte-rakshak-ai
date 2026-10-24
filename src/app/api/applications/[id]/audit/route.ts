import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, addAuditLog } from '@/lib/storage/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { remarks, action = 'OFFICER_OBSERVATION_RECORDED', actor = 'Dr. V. K. Malhotra', role = 'Senior Scrutiny Officer' } = await request.json();

    if (!remarks) {
      return NextResponse.json({ error: 'Remarks or observation note is required' }, { status: 400 });
    }

    addAuditLog(app.id, {
      actor,
      role,
      action,
      remarks,
    });

    const refreshed = getApplicationById(app.id);
    return NextResponse.json({ success: true, auditTrail: refreshed?.auditTrail });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record observation' }, { status: 500 });
  }
}
