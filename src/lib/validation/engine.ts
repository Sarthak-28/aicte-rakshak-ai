import { InstitutionalApplication, ValidationFinding, ApplicationDocument, FindingSeverity } from '@/types';
import { loadApplications } from '../storage/db';

// Levenshtein similarity calculation for institution names
export function calculateTextSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const s2 = str2.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  // Token-based Jaccard similarity
  const tokens1 = new Set(s1.split(/\s+/));
  const tokens2 = new Set(s2.split(/\s+/));

  let intersection = 0;
  tokens1.forEach((t) => {
    if (tokens2.has(t)) intersection++;
  });

  const allTokens = new Set<string>();
  tokens1.forEach((t) => allTokens.add(t));
  tokens2.forEach((t) => allTokens.add(t));
  const union = allTokens.size;
  return union === 0 ? 0 : intersection / union;
}

export function runDeterministicValidation(
  targetApp: InstitutionalApplication, 
  allApps?: InstitutionalApplication[]
): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const applications = allApps || loadApplications();
  const now = new Date();

  // -------------------------------------------------------------------------
  // 1. RULE_DOC_MANDATORY: Check for presence of required documents
  // -------------------------------------------------------------------------
  const requiredTypesByCat: Record<string, Array<{ type: string; title: string }>> = {
    'New Technical Institution': [
      { type: 'LAND_TITLE_DEED', title: 'Registered Land Title Deed' },
      { type: 'BUILDING_PLAN_APPROVAL', title: 'Municipal Approved Building Plan' },
      { type: 'FIRE_SAFETY_CERTIFICATE', title: 'Fire & Life Safety Certificate' },
      { type: 'STATE_GOVT_NOC', title: 'State Government NOC' },
    ],
    'Extension of Approval (EoA)': [
      { type: 'LAND_TITLE_DEED', title: 'Registered Land Title Deed' },
      { type: 'BUILDING_PLAN_APPROVAL', title: 'Municipal Approved Building Plan' },
      { type: 'FIRE_SAFETY_CERTIFICATE', title: 'Fire & Life Safety Certificate' },
    ],
    'Increase in Approved Intake': [
      { type: 'LAND_TITLE_DEED', title: 'Registered Land Title Deed' },
      { type: 'FIRE_SAFETY_CERTIFICATE', title: 'Fire & Life Safety Certificate' },
      { type: 'STATE_GOVT_NOC', title: 'State Government Expansion NOC' },
    ],
    'Introduction of New Course/Program': [
      { type: 'LAND_TITLE_DEED', title: 'Registered Land Title Deed' },
      { type: 'BUILDING_PLAN_APPROVAL', title: 'Municipal Approved Building Plan' },
      { type: 'FIRE_SAFETY_CERTIFICATE', title: 'Fire & Life Safety Certificate' },
    ],
  };

  const requiredDocList = requiredTypesByCat[targetApp.applicationCategory] || requiredTypesByCat['New Technical Institution'];
  const uploadedDocTypes = new Set(targetApp.documents.map((d) => d.documentType));

  requiredDocList.forEach((req) => {
    if (!uploadedDocTypes.has(req.type as any)) {
      findings.push({
        id: `FND-${targetApp.id.replace(/[^0-9]/g, '')}-MAND-${req.type.slice(0, 4)}`,
        ruleId: 'RULE_DOC_MANDATORY',
        severity: 'CRITICAL',
        category: 'DOCUMENT_PRESENCE',
        title: `Mandatory Document Missing: ${req.title}`,
        explanation: `Under AICTE Approval Process Handbook (APH) 2026-27 norms, a ${req.title} is mandatory for '${targetApp.applicationCategory}'. This document was omitted from the submission package.`,
        evidence: {
          fieldName: req.type,
          expectedValue: `Valid ${req.title}`,
          extractedValue: 'NOT_FOUND',
          excerpt: `Submitted documents list: [${targetApp.documents.map((d) => d.title).join(', ') || 'No documents'}]`,
        },
        recommendedAction: 'Issue formal Notice for Clarification to applicant requiring document upload within 7 days.',
        timestamp: now.toISOString(),
        reviewStatus: 'OPEN',
      });
    }
  });

  // -------------------------------------------------------------------------
  // 2. RULE_CERT_EXPIRY & RULE_DATE_RANGE_VALIDITY: Check dates in documents
  // -------------------------------------------------------------------------
  targetApp.documents.forEach((doc) => {
    const expiryField = doc.extractedFields['expiryDate'] || doc.extractedFields['validUntil'];
    const issueField = doc.extractedFields['issueDate'] || doc.extractedFields['sanctionDate'];

    if (expiryField && expiryField.value) {
      const expDate = new Date(expiryField.value);
      if (!isNaN(expDate.getTime())) {
        const subDate = new Date(targetApp.submissionDate);
        if (expDate.getTime() < subDate.getTime() || expDate.getTime() < now.getTime()) {
          findings.push({
            id: `FND-${targetApp.id.replace(/[^0-9]/g, '')}-EXP-${doc.id.slice(-4)}`,
            ruleId: 'RULE_CERT_EXPIRY',
            severity: 'CRITICAL',
            category: 'EXPIRY',
            title: `Expired Statutory Document: ${doc.title}`,
            explanation: `Document '${doc.fileName}' carries an expiry date of ${expiryField.value}, which has lapsed prior to or during application scrutiny. Valid statutory clearance is strictly required.`,
            evidence: {
              documentId: doc.id,
              documentName: doc.fileName,
              fieldName: 'expiryDate',
              extractedValue: expiryField.value,
              expectedValue: `>= ${subDate.toISOString().split('T')[0]} (Unexpired)`,
              excerpt: expiryField.sourceQuote || `Document states validity lapsed on ${expiryField.value}`,
              pageNumber: expiryField.pageNumber || 1,
            },
            recommendedAction: 'Direct applicant to submit a valid certificate renewal or acknowledgment receipt from the issuing authority.',
            timestamp: now.toISOString(),
            reviewStatus: 'OPEN',
          });
        }
      }
    }

    if (issueField && issueField.value) {
      const issDate = new Date(issueField.value);
      if (!isNaN(issDate.getTime()) && issDate.getTime() > now.getTime()) {
        findings.push({
          id: `FND-${targetApp.id.replace(/[^0-9]/g, '')}-DATE-FUTURE-${doc.id.slice(-4)}`,
          ruleId: 'RULE_DATE_RANGE_VALIDITY',
          severity: 'WARNING',
          category: 'DATE_SEQUENCE',
          title: `Post-Dated Document Anomaly: ${doc.title}`,
          explanation: `Document '${doc.fileName}' carries an issue date in the future (${issueField.value}). Verify potential typographical error or document anomaly.`,
          evidence: {
            documentId: doc.id,
            documentName: doc.fileName,
            fieldName: 'issueDate',
            extractedValue: issueField.value,
            expectedValue: `<= ${now.toISOString().split('T')[0]}`,
            excerpt: issueField.sourceQuote || `Issue date: ${issueField.value}`,
          },
          recommendedAction: 'Verify original physical document stamp and issue date with issuing authority.',
          timestamp: now.toISOString(),
          reviewStatus: 'OPEN',
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 3. RULE_NAME_CONSISTENCY: Cross-document institution name consistency
  // -------------------------------------------------------------------------
  targetApp.documents.forEach((doc) => {
    const extractedInstName = doc.extractedFields['institutionName']?.value;
    if (extractedInstName) {
      const similarity = calculateTextSimilarity(targetApp.institutionName, extractedInstName);
      if (similarity < 0.65) {
        findings.push({
          id: `FND-${targetApp.id.replace(/[^0-9]/g, '')}-NAME-MISMATCH-${doc.id.slice(-4)}`,
          ruleId: 'RULE_NAME_CONSISTENCY',
          severity: 'CRITICAL',
          category: 'DATA_MISMATCH',
          title: `Institution Name Mismatch in ${doc.title}`,
          explanation: `Extracted name "${extractedInstName}" in ${doc.fileName} differs substantially from registered name "${targetApp.institutionName}" (Match similarity: ${Math.round(similarity * 100)}%).`,
          evidence: {
            documentId: doc.id,
            documentName: doc.fileName,
            fieldName: 'institutionName',
            extractedValue: extractedInstName,
            expectedValue: targetApp.institutionName,
            excerpt: doc.extractedFields['institutionName']?.sourceQuote || `Extracted: "${extractedInstName}"`,
            pageNumber: doc.extractedFields['institutionName']?.pageNumber || 1,
          },
          recommendedAction: 'Check for legal name-change notifications or request correct institution document.',
          timestamp: now.toISOString(),
          reviewStatus: 'OPEN',
        });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 4. RULE_REG_CONSISTENCY: Cross-document registration number match
  // -------------------------------------------------------------------------
  const regNumbersFound: Array<{ docId: string; docName: string; regNo: string; quote?: string }> = [];
  targetApp.documents.forEach((doc) => {
    const regField = doc.extractedFields['registrationNumber'];
    if (regField && regField.value) {
      regNumbersFound.push({
        docId: doc.id,
        docName: doc.fileName,
        regNo: regField.value,
        quote: regField.sourceQuote,
      });
    }
  });

  if (regNumbersFound.length >= 2) {
    const firstReg = regNumbersFound[0];
    for (let i = 1; i < regNumbersFound.length; i++) {
      const current = regNumbersFound[i];
      // If document types are trust/society and state NOC, their entity numbers must correlate
      const sim = calculateTextSimilarity(firstReg.regNo, current.regNo);
      if (sim < 0.3 && !firstReg.regNo.includes(current.regNo) && !current.regNo.includes(firstReg.regNo)) {
        findings.push({
          id: `FND-${targetApp.id.replace(/[^0-9]/g, '')}-REG-MISMATCH-${current.docId.slice(-4)}`,
          ruleId: 'RULE_REG_CONSISTENCY',
          severity: 'CRITICAL',
          category: 'DATA_MISMATCH',
          title: `Registration Number Mismatch Between Documents`,
          explanation: `Registration identifier "${current.regNo}" in ${current.docName} conflicts with "${firstReg.regNo}" in ${firstReg.docName}. Cross-document sponsoring trust identity conflict detected.`,
          evidence: {
            documentId: current.docId,
            documentName: current.docName,
            fieldName: 'registrationNumber',
            extractedValue: current.regNo,
            expectedValue: firstReg.regNo,
            excerpt: current.quote || `Registration: ${current.regNo}`,
          },
          recommendedAction: 'Summon applicant for legal verification before the Regional Scrutiny Committee.',
          timestamp: now.toISOString(),
          reviewStatus: 'OPEN',
        });
      }
    }
  }

  // -------------------------------------------------------------------------
  // 5. RULE_DUPLICATE_HASH: Cryptographic duplicate detection across all apps
  // -------------------------------------------------------------------------
  targetApp.documents.forEach((doc) => {
    applications.forEach((otherApp) => {
      if (otherApp.id !== targetApp.id) {
        const dupDoc = otherApp.documents.find((od) => od.fileHash === doc.fileHash);
        if (dupDoc) {
          findings.push({
            id: `FND-${targetApp.id.replace(/[^0-9]/g, '')}-DUP-HASH-${doc.id.slice(-4)}`,
            ruleId: 'RULE_DUPLICATE_HASH',
            severity: 'CRITICAL',
            category: 'DUPLICATE',
            title: `Cryptographic Duplicate Document Detected`,
            explanation: `File "${doc.fileName}" uploaded for ${targetApp.institutionName} has an identical SHA-256 hash (${doc.fileHash.slice(0, 16)}...) to document "${dupDoc.fileName}" submitted under application ${otherApp.id} (${otherApp.institutionName}).`,
            evidence: {
              documentId: doc.id,
              documentName: doc.fileName,
              fieldName: 'fileHash',
              extractedValue: doc.fileHash,
              duplicateWithAppId: otherApp.id,
              excerpt: `Matches document ${dupDoc.id} in ${otherApp.institutionName} (${otherApp.id})`,
            },
            recommendedAction: 'Flag for immediate Hearing Committee review and verify authentic ownership.',
            timestamp: now.toISOString(),
            reviewStatus: 'OPEN',
          });
        }
      }
    });
  });

  return findings;
}
