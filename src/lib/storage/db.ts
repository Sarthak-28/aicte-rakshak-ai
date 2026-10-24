import fs from 'fs';
import path from 'path';
import { InstitutionalApplication, DashboardMetrics, AuditLogEntry, ValidationFinding, ApplicationDocument } from '@/types';
import { SEED_APPLICATIONS } from './seedData';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory cache to ensure speedy reads in serverless / dev environments
let memoryCache: InstitutionalApplication[] | null = null;
let isFsSupported: boolean | null = null;

function checkFsSupport(): boolean {
  if (isFsSupported !== null) return isFsSupported;
  try {
    if (typeof fs === 'undefined' || !fs.existsSync || !fs.mkdirSync) {
      isFsSupported = false;
      return false;
    }
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    isFsSupported = true;
    return true;
  } catch {
    isFsSupported = false;
    return false;
  }
}

function ensureDataDir(): void {
  try {
    if (checkFsSupport() && !fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Ignore in read-only / Cloudflare Workers environment
  }
}

export function loadApplications(): InstitutionalApplication[] {
  if (memoryCache) {
    return memoryCache;
  }

  try {
    if (checkFsSupport() && fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryCache = JSON.parse(data);
      return memoryCache!;
    }
  } catch (err) {
    console.warn('[Storage] Filesystem read unavailable, using in-memory seed data:', err);
  }

  // Seed default data
  memoryCache = JSON.parse(JSON.stringify(SEED_APPLICATIONS));
  if (checkFsSupport()) {
    saveApplications(memoryCache!);
  }
  return memoryCache!;
}

export function saveApplications(apps: InstitutionalApplication[]): void {
  memoryCache = apps;
  if (!checkFsSupport()) {
    return; // Cloudflare Workers / Edge in-memory mode
  }

  try {
    ensureDataDir();
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(apps, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.warn('[Storage] Failed to save applications to disk:', err);
  }
}

export function getApplications(): InstitutionalApplication[] {
  return loadApplications();
}

export function getApplicationById(id: string): InstitutionalApplication | undefined {
  const apps = loadApplications();
  return apps.find((app) => app.id.toUpperCase() === id.toUpperCase());
}

export function updateApplication(id: string, updates: Partial<InstitutionalApplication>): InstitutionalApplication | null {
  const apps = loadApplications();
  const index = apps.findIndex((app) => app.id.toUpperCase() === id.toUpperCase());
  if (index === -1) return null;

  apps[index] = {
    ...apps[index],
    ...updates,
  };

  saveApplications(apps);
  return apps[index];
}

export function addAuditLog(
  appId: string, 
  entry: { actor: string; role: string; action: string; previousValue?: string; newValue?: string; remarks?: string }
): void {
  const apps = loadApplications();
  const app = apps.find((a) => a.id.toUpperCase() === appId.toUpperCase());
  if (!app) return;

  const newLog: AuditLogEntry = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  app.auditTrail.unshift(newLog);
  saveApplications(apps);
}

export function addDocumentToApplication(appId: string, doc: ApplicationDocument): InstitutionalApplication | null {
  const apps = loadApplications();
  const app = apps.find((a) => a.id.toUpperCase() === appId.toUpperCase());
  if (!app) return null;

  app.documents.unshift(doc);
  addAuditLog(appId, {
    actor: 'Scrutiny Officer',
    role: 'Officer',
    action: 'DOCUMENT_UPLOADED',
    newValue: `${doc.title} (${doc.fileName})`,
    remarks: `Uploaded ${doc.documentType} file with SHA-256: ${doc.fileHash.slice(0, 10)}...`,
  });

  saveApplications(apps);
  return app;
}

export function updateFindingReview(
  appId: string,
  findingId: string,
  status: 'OPEN' | 'RESOLVED' | 'WAIVED',
  notes?: string
): ValidationFinding | null {
  const apps = loadApplications();
  const app = apps.find((a) => a.id.toUpperCase() === appId.toUpperCase());
  if (!app) return null;

  const finding = app.findings.find((f) => f.id === findingId);
  if (!finding) return null;

  const oldStatus = finding.reviewStatus;
  finding.reviewStatus = status;
  if (notes) finding.reviewerNotes = notes;

  addAuditLog(appId, {
    actor: 'Dr. V. K. Malhotra',
    role: 'Senior Scrutiny Officer',
    action: 'FINDING_STATUS_CHANGED',
    previousValue: `${finding.id} (${oldStatus})`,
    newValue: `${finding.id} (${status})`,
    remarks: notes || `Finding marked as ${status}`,
  });

  saveApplications(apps);
  return finding;
}

export function resetDatabase(): InstitutionalApplication[] {
  memoryCache = JSON.parse(JSON.stringify(SEED_APPLICATIONS));
  saveApplications(memoryCache!);
  return memoryCache!;
}

export function computeDashboardMetrics(): DashboardMetrics {
  const apps = loadApplications();

  const totalApplications = apps.length;
  let awaitingValidation = 0;
  let missingDocuments = 0;
  let potentialAnomalies = 0;
  let awaitingVerification = 0;
  let requiringManualReview = 0;

  const statusDistribution = {
    clean: 0,
    warnings: 0,
    anomalies: 0,
    awaiting: 0,
  };

  const categoryBreakdown: Record<string, number> = {};
  const highPriorityPendingActions: DashboardMetrics['highPriorityPendingActions'] = [];

  apps.forEach((app) => {
    // Status counts
    if (app.validationStatus === 'AWAITING_VALIDATION') {
      awaitingValidation++;
      statusDistribution.awaiting++;
    } else if (app.validationStatus === 'VALIDATED_CLEAN') {
      statusDistribution.clean++;
    } else if (app.validationStatus === 'VALIDATION_WARNINGS') {
      statusDistribution.warnings++;
    } else if (app.validationStatus === 'ANOMALIES_DETECTED') {
      statusDistribution.anomalies++;
    }

    // Check verification status
    if (app.verificationStatus === 'PENDING') {
      awaitingVerification++;
    }

    // Check manual review requirement
    if (app.reviewStatus === 'PENDING_SCRUTINY' || app.reviewStatus === 'UNDER_REVIEW' || app.reviewStatus === 'RECOMMENDED_FOR_PHYSICAL_INSPECTION') {
      requiringManualReview++;
    }

    // Category breakdown
    categoryBreakdown[app.institutionType] = (categoryBreakdown[app.institutionType] || 0) + 1;

    // Check findings for missing documents & anomalies
    app.findings.forEach((finding) => {
      if (finding.category === 'DOCUMENT_PRESENCE') {
        missingDocuments++;
      } else {
        potentialAnomalies++;
      }

      if (finding.severity === 'CRITICAL' && finding.reviewStatus === 'OPEN') {
        highPriorityPendingActions.push({
          applicationId: app.id,
          institutionName: app.institutionName,
          issueTitle: finding.title,
          severity: finding.severity,
          recommendedAction: finding.recommendedAction,
        });
      }
    });
  });

  // Recent activity aggregated from all audit trails
  const allLogs: DashboardMetrics['recentActivity'] = [];
  apps.forEach((app) => {
    app.auditTrail.forEach((log) => {
      let type: DashboardMetrics['recentActivity'][0]['type'] = 'STATUS_CHANGE';
      if (log.action.includes('FINDING')) type = 'FINDING';
      if (log.action.includes('VERIF')) type = 'VERIFICATION';
      if (log.action.includes('DOCUMENT')) type = 'DOCUMENT_UPLOAD';

      allLogs.push({
        id: log.id,
        applicationId: app.id,
        institutionName: app.institutionName,
        timestamp: log.timestamp,
        description: `${log.actor} (${log.role}): ${log.action} - ${log.remarks || log.newValue || ''}`,
        type,
      });
    });
  });

  allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    totalApplications,
    awaitingValidation,
    missingDocuments,
    potentialAnomalies,
    awaitingVerification,
    requiringManualReview,
    statusDistribution,
    categoryBreakdown,
    recentActivity: allLogs.slice(0, 10),
    highPriorityPendingActions: highPriorityPendingActions.slice(0, 6),
  };
}
