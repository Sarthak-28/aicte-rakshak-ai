import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication, addAuditLog } from '@/lib/storage/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve application' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const body = await request.json();
    const { reviewStatus, assignedOfficer, remarks, actor = 'Dr. V. K. Malhotra', role = 'Senior Scrutiny Officer' } = body;

    const updates: any = {};
    if (reviewStatus) {
      const prevStatus = app.reviewStatus;
      updates.reviewStatus = reviewStatus;
      addAuditLog(app.id, {
        actor,
        role,
        action: 'REVIEW_STATUS_CHANGED',
        previousValue: prevStatus,
        newValue: reviewStatus,
        remarks: remarks || `Scrutiny review status updated to ${reviewStatus}`,
      });
    }

    if (assignedOfficer) {
      updates.assignedOfficer = assignedOfficer;
    }

    const updated = updateApplication(app.id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
