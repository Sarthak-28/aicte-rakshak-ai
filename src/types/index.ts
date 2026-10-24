export type InstitutionType = 
  | 'Engineering & Technology' 
  | 'Polytechnic Diploma' 
  | 'Management (MBA/MCA)' 
  | 'Pharmacy' 
  | 'Architecture & Planning';

export type ApplicationCategory = 
  | 'New Technical Institution' 
  | 'Extension of Approval (EoA)' 
  | 'Increase in Approved Intake' 
  | 'Introduction of New Course/Program' 
  | 'Change in Name/Site of Institution';

export type ValidationStatus = 
  | 'VALIDATED_CLEAN' 
  | 'VALIDATION_WARNINGS' 
  | 'ANOMALIES_DETECTED' 
  | 'AWAITING_VALIDATION';

export type VerificationStatus = 
  | 'ALL_VERIFIED' 
  | 'PARTIALLY_VERIFIED' 
  | 'MISMATCH_DETECTED' 
  | 'PENDING';

export type ReviewStatus = 
  | 'PENDING_SCRUTINY' 
  | 'UNDER_REVIEW' 
  | 'CLARIFICATION_REQUESTED' 
  | 'RECOMMENDED_FOR_APPROVAL' 
  | 'RECOMMENDED_FOR_PHYSICAL_INSPECTION' 
  | 'RECOMMENDED_FOR_REJECTION';

export type DocumentType = 
  | 'LAND_TITLE_DEED' 
  | 'BUILDING_PLAN_APPROVAL' 
  | 'FIRE_SAFETY_CERTIFICATE' 
  | 'STATE_GOVT_NOC' 
  | 'AFFILIATING_UNIVERSITY_NOC' 
  | 'TRUST_SOCIETY_REGISTRATION' 
  | 'FACULTY_CADRE_LIST' 
  | 'AUDITED_BALANCE_SHEET';

export interface ExtractedFieldDetail {
  value: string;
  confidence: number; // 0 to 1
  sourceQuote?: string;
  pageNumber?: number;
}

export interface ApplicationDocument {
  id: string;
  documentType: DocumentType;
  title: string;
  fileName: string;
  fileSize: number; // bytes
  mimeType: string;
  fileHash: string; // SHA-256
  uploadedAt: string; // ISO
  extractedText: string;
  extractedFields: Record<string, ExtractedFieldDetail>;
  isMandatory: boolean;
  status: 'UPLOADED' | 'EXTRACTED' | 'PARSING_FAILED' | 'VERIFIED' | 'FLAGGED';
}

export type FindingSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type FindingCategory = 
  | 'DOCUMENT_PRESENCE' 
  | 'EXPIRY' 
  | 'DATA_MISMATCH' 
  | 'DUPLICATE' 
  | 'COMPLIANCE_GAP'
  | 'DATE_SEQUENCE';

export interface FindingEvidence {
  documentId?: string;
  documentName?: string;
  fieldName?: string;
  extractedValue?: string;
  expectedValue?: string;
  excerpt?: string;
  pageNumber?: number;
  duplicateWithAppId?: string;
}

export interface ValidationFinding {
  id: string;
  ruleId: string;
  severity: FindingSeverity;
  category: FindingCategory;
  title: string;
  explanation: string;
  evidence: FindingEvidence;
  recommendedAction: string;
  timestamp: string;
  reviewStatus: 'OPEN' | 'RESOLVED' | 'WAIVED';
  reviewerNotes?: string;
}

export type AuthorityVerificationStatus = 
  | 'VERIFIED' 
  | 'MISMATCH_DETECTED' 
  | 'EXPIRED' 
  | 'PENDING' 
  | 'SOURCE_UNAVAILABLE' 
  | 'MANUAL_REVIEW_REQUIRED';

export interface VerificationRecord {
  id: string;
  documentId: string;
  documentType: DocumentType;
  issuingAuthority: string;
  referenceNumber: string;
  submittedDetails: Record<string, string>;
  verificationMethod: 'SIMULATED_API' | 'DIGITAL_SIGNATURE' | 'MANUAL_OFFICER';
  status: AuthorityVerificationStatus;
  verifiedAt: string;
  sourceResponse: {
    statusNote: string;
    registryRecordFound: boolean;
    authorizedSignatory?: string;
    validUntil?: string;
    rawPayload?: Record<string, any>;
  };
  simulationBadge: true;
}

export interface ComplianceCheckResult {
  ruleId: string;
  category: 'Land & Infrastructure' | 'Statutory NOCs' | 'Academic & Faculty' | 'Safety & Amenities';
  title: string;
  description: string;
  requiredEvidence: string;
  effectiveDate: string;
  ruleVersion: string;
  result: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL' | 'NOT_APPLICABLE' | 'PENDING_DOCUMENT';
  explanation: string;
  supportingDocumentId?: string;
  supportingQuote?: string;
}

export interface InfrastructureEvidence {
  id: string;
  title: string;
  areaType: 'Computer Center' | 'Fire Safety System' | 'Library & Reading Room' | 'Engineering Workshop' | 'Barrier-Free Ramp & Toilet';
  imageUrl: string;
  uploadedAt: string;
  detectedObjects: Array<{
    label: string;
    confidence: number;
    box?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in %
  }>;
  aiObservation: string;
  reviewerNotes?: string;
  recommendPhysicalInspection: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  remarks?: string;
}

export interface InstitutionalApplication {
  id: string;
  scenarioTag: 'scenario-1' | 'scenario-2' | 'scenario-3' | 'scenario-4' | 'scenario-5' | 'custom';
  institutionName: string;
  institutionType: InstitutionType;
  applicationCategory: ApplicationCategory;
  trustName: string;
  establishmentYear: number;
  state: string;
  district: string;
  address: string;
  pinCode: string;
  contactEmail: string;
  contactPhone: string;
  submissionDate: string;
  academicYear: string;
  validationStatus: ValidationStatus;
  verificationStatus: VerificationStatus;
  reviewStatus: ReviewStatus;
  assignedOfficer: string;
  documents: ApplicationDocument[];
  findings: ValidationFinding[];
  verificationRecords: VerificationRecord[];
  complianceChecks: ComplianceCheckResult[];
  infrastructurePhotos: InfrastructureEvidence[];
  auditTrail: AuditLogEntry[];
}

export interface DashboardMetrics {
  totalApplications: number;
  awaitingValidation: number;
  missingDocuments: number;
  potentialAnomalies: number;
  awaitingVerification: number;
  requiringManualReview: number;
  statusDistribution: {
    clean: number;
    warnings: number;
    anomalies: number;
    awaiting: number;
  };
  categoryBreakdown: Record<string, number>;
  recentActivity: Array<{
    id: string;
    applicationId: string;
    institutionName: string;
    timestamp: string;
    description: string;
    type: 'FINDING' | 'VERIFICATION' | 'STATUS_CHANGE' | 'DOCUMENT_UPLOAD';
  }>;
  highPriorityPendingActions: Array<{
    applicationId: string;
    institutionName: string;
    issueTitle: string;
    severity: FindingSeverity;
    recommendedAction: string;
  }>;
}
