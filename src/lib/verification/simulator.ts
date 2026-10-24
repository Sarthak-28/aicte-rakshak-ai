import { AuthorityVerificationStatus, DocumentType, VerificationRecord } from '@/types';

export interface VerificationRequest {
  documentId: string;
  documentType: DocumentType;
  institutionName: string;
  referenceNumber: string;
  submittedDetails: Record<string, string>;
  forcedStatus?: AuthorityVerificationStatus; // For evaluator simulation testing
}

export async function simulateAuthorityVerification(req: VerificationRequest): Promise<VerificationRecord> {
  // Simulate network latency (400ms - 800ms) to feel authentic
  await new Promise((resolve) => setTimeout(resolve, 500));

  let authorityName = 'State Board of Technical Education';
  if (req.documentType === 'LAND_TITLE_DEED') {
    authorityName = 'Department of Revenue & Land Records (Sub-Registrar Portal)';
  } else if (req.documentType === 'BUILDING_PLAN_APPROVAL') {
    authorityName = 'Municipal Corporation / Urban Development Authority';
  } else if (req.documentType === 'FIRE_SAFETY_CERTIFICATE') {
    authorityName = 'Directorate of Fire & Emergency Services';
  } else if (req.documentType === 'STATE_GOVT_NOC') {
    authorityName = 'Department of Higher & Technical Education, State Secretariat';
  } else if (req.documentType === 'AFFILIATING_UNIVERSITY_NOC') {
    authorityName = 'State Affiliating University - Academic & Affiliation Board';
  } else if (req.documentType === 'TRUST_SOCIETY_REGISTRATION') {
    authorityName = 'Office of the Registrar of Societies / Public Trust Registration Office';
  }

  // If a forced status is provided by reviewer simulation controls, honor it
  if (req.forcedStatus) {
    return generateRecordWithStatus(req, authorityName, req.forcedStatus);
  }

  // Default heuristic status based on document context or reference number
  const ref = (req.referenceNumber || '').toUpperCase();
  const inst = (req.institutionName || '').toLowerCase();

  let determinedStatus: AuthorityVerificationStatus = 'VERIFIED';
  let note = 'Record found in central authority repository. Digital signature cryptographic seal verified.';

  if (ref.includes('EXPIRED') || inst.includes('saraswati')) {
    determinedStatus = 'EXPIRED';
    note = 'Registry entry found, but validity expired according to issuing authority record.';
  } else if (ref.includes('MISMATCH') || inst.includes('drona')) {
    determinedStatus = 'MISMATCH_DETECTED';
    note = 'Reference number exists under a different registered institution title or sponsoring trust.';
  } else if (ref.includes('UNAVAILABLE') || inst.includes('kalinga') || ref.includes('BDA')) {
    determinedStatus = 'SOURCE_UNAVAILABLE';
    note = 'Issuing authority repository endpoint returned HTTP 503 / Gateway Timeout.';
  } else if (ref.includes('MANUAL')) {
    determinedStatus = 'MANUAL_REVIEW_REQUIRED';
    note = 'Record flagged for manual gazette verification due to pending title dispute.';
  }

  return generateRecordWithStatus(req, authorityName, determinedStatus, note);
}

function generateRecordWithStatus(
  req: VerificationRequest,
  authorityName: string,
  status: AuthorityVerificationStatus,
  customNote?: string
): VerificationRecord {
  const now = new Date().toISOString();

  const statusNotes: Record<AuthorityVerificationStatus, string> = {
    VERIFIED: customNote || 'Authenticated against official state database. Digital DSC seal valid.',
    MISMATCH_DETECTED: customNote || 'Discrepancy detected: Record exists but institution or trust name does not match submitted filing.',
    EXPIRED: customNote || 'Official record indicates validity lapsed. Renewal record not found in system.',
    PENDING: 'Verification query queued in external departmental clearance batch.',
    SOURCE_UNAVAILABLE: customNote || 'Central repository connection timed out or is undergoing scheduled downtime (HTTP 503).',
    MANUAL_REVIEW_REQUIRED: customNote || 'Automated match inconclusive. Gazette notification review required by authorized officer.',
  };

  return {
    id: `VR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    documentId: req.documentId,
    documentType: req.documentType,
    issuingAuthority: authorityName,
    referenceNumber: req.referenceNumber || 'N/A',
    submittedDetails: req.submittedDetails,
    verificationMethod: 'SIMULATED_API',
    status,
    verifiedAt: now,
    sourceResponse: {
      statusNote: statusNotes[status],
      registryRecordFound: status !== 'SOURCE_UNAVAILABLE',
      authorizedSignatory: status === 'VERIFIED' ? 'Digitally Signed by Competent Authority' : undefined,
      validUntil: status === 'EXPIRED' ? 'Past Expiry Date' : '2028-06-30',
      rawPayload: {
        simulationNotice: 'DEMO SIMULATION ONLY - Decision Support Sandbox',
        endpoint: `https://api.simulation.gov.in/${encodeURIComponent(authorityName.toLowerCase().replace(/[^a-z0-9]/g, '-'))}/verify`,
        statusCode: status === 'SOURCE_UNAVAILABLE' ? 503 : (status === 'MISMATCH_DETECTED' ? 409 : 200),
      }
    },
    simulationBadge: true,
  };
}
