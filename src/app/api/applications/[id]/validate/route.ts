import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication, addAuditLog, getApplications } from '@/lib/storage/db';
import { runDeterministicValidation } from '@/lib/validation/engine';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const allApps = getApplications();
    const newFindings = runDeterministicValidation(app, allApps);

    // Merge new findings while preserving reviewer resolved/waived status for existing IDs
    const mergedFindings = newFindings.map((nf) => {
      const existing = app.findings.find((f) => f.ruleId === nf.ruleId && f.evidence.fieldName === nf.evidence.fieldName);
      if (existing && existing.reviewStatus !== 'OPEN') {
        return {
          ...nf,
          reviewStatus: existing.reviewStatus,
          reviewerNotes: existing.reviewerNotes,
        };
      }
      return nf;
    });

    let newValidationStatus = 'VALIDATED_CLEAN';
    if (mergedFindings.some((f) => f.severity === 'CRITICAL' && f.reviewStatus === 'OPEN')) {
      newValidationStatus = 'ANOMALIES_DETECTED';
    } else if (mergedFindings.some((f) => f.severity === 'WARNING' && f.reviewStatus === 'OPEN')) {
      newValidationStatus = 'VALIDATION_WARNINGS';
    }

    addAuditLog(app.id, {
      actor: 'Rakshak Validation Engine',
      role: 'Automated Rule Engine',
      action: 'DETERMINISTIC_RULES_EVALUATED',
      previousValue: app.validationStatus,
      newValue: newValidationStatus,
      remarks: `Evaluated 8 rules. Generated ${mergedFindings.length} findings (${mergedFindings.filter(f => f.severity === 'CRITICAL').length} critical).`,
    });

    const updated = updateApplication(app.id, {
      findings: mergedFindings,
      validationStatus: newValidationStatus as any,
    });

    return NextResponse.json({ success: true, findings: mergedFindings, application: updated });
  } catch (error) {
    console.error('[API /api/applications/[id]/validate] Error:', error);
    return NextResponse.json({ error: 'Failed to run validation' }, { status: 500 });
  }
}
