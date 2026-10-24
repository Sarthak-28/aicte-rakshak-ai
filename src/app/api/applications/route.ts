import { NextRequest, NextResponse } from 'next/server';
import { getApplications, computeDashboardMetrics, resetDatabase } from '@/lib/storage/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    if (view === 'metrics') {
      const metrics = computeDashboardMetrics();
      return NextResponse.json(metrics);
    }

    let apps = getApplications();

    if (search) {
      apps = apps.filter(
        (app) =>
          app.id.toLowerCase().includes(search) ||
          app.institutionName.toLowerCase().includes(search) ||
          app.state.toLowerCase().includes(search) ||
          app.trustName.toLowerCase().includes(search)
      );
    }

    if (status && status !== 'ALL') {
      apps = apps.filter((app) => app.validationStatus === status || app.reviewStatus === status);
    }

    if (type && type !== 'ALL') {
      apps = apps.filter((app) => app.institutionType === type);
    }

    if (category && category !== 'ALL') {
      apps = apps.filter((app) => app.applicationCategory === category);
    }

    return NextResponse.json(apps);
  } catch (error) {
    console.error('[API /api/applications] Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === 'reset') {
      const resetData = resetDatabase();
      return NextResponse.json({ success: true, message: 'Database reset to demo scenarios', count: resetData.length });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
