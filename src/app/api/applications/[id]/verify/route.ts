import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication, addAuditLog } from '@/lib/storage/db';
import { simulateAuthorityVerification } from '@/lib/verification/simulator';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const app = getApplicationById(params.id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { documentId, forcedStatus, actor = 'Officer Verification Bot' } = await request.json();
    const doc = app.documents.find((d) => d.id === documentId);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const verificationRecord = await simulateAuthorityVerification({
      documentId: doc.id,
      documentType: doc.documentType,
      institutionName: app.institutionName,
      referenceNumber: doc.extractedFields['referenceNumber']?.value || 'N/A',
      submittedDetails: {
        documentName: doc.title,
        hash: doc.fileHash.slice(0, 12),
        claimedInstitution: app.institutionName,
      },
      forcedStatus,
    });

    // Update document status
    if (verificationRecord.status === 'VERIFIED') {
      doc.status = 'VERIFIED';
    } else if (verificationRecord.status === 'MISMATCH_DETECTED' || verificationRecord.status === 'EXPIRED') {
      doc.status = 'FLAGGED';
    }

    // Add or replace verification record
    const existingIndex = app.verificationRecords.findIndex((vr) => vr.documentId === documentId);
    if (existingIndex >= 0) {
      app.verificationRecords[existingIndex] = verificationRecord;
    } else {
      app.verificationRecords.unshift(verificationRecord);
    }

    // Recalculate app overall verification status
    const allRecords = app.verificationRecords;
    if (allRecords.some((r) => r.status === 'MISMATCH_DETECTED' || r.status === 'EXPIRED')) {
      app.verificationStatus = 'MISMATCH_DETECTED';
    } else if (allRecords.length >= app.documents.length && allRecords.every((r) => r.status === 'VERIFIED')) {
      app.verificationStatus = 'ALL_VERIFIED';
    } else {
      app.verificationStatus = 'PARTIALLY_VERIFIED';
    }

    addAuditLog(app.id, {
      actor,
      role: 'Verification Authority Simulator',
      action: 'AUTHORITY_VERIFICATION_COMPLETED',
      newValue: `${doc.title}: ${verificationRecord.status}`,
      remarks: `Simulated query to ${verificationRecord.issuingAuthority}: ${verificationRecord.sourceResponse.statusNote}`,
    });

    const updated = updateApplication(app.id, {
      documents: app.documents,
      verificationRecords: app.verificationRecords,
      verificationStatus: app.verificationStatus,
    });

    return NextResponse.json({ success: true, verificationRecord, application: updated });
  } catch (error) {
    console.error('[API /api/applications/[id]/verify] Error:', error);
    return NextResponse.json({ error: 'Failed to verify document' }, { status: 500 });
  }
}
