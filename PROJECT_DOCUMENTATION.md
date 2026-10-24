# AICTE Rakshak AI (AICTE रक्षक AI)
## AI-Powered Application Validation, Document Authentication & Regulatory Compliance Verification
### Official Prototype Technical & System Documentation for Submission

---

> **Problem Statement:** AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification  
> **Agency:** All India Council for Technical Education (AICTE), Ministry of Education, Government of India  
> **Classification:** Institutional GovTech Decision-Support Prototype (Advisory, Human-in-the-Loop)  
> **Repository:** `aicte-rakshak-ai`  
> **Release Version:** 1.0.0 (Hackathon Final Submission)  
> **Date of Documentation:** October 2026  

---

## Table of Contents

1. [Executive Summary & Background](#1-executive-summary--background)
2. [Problem Statement & Project Goals](#2-problem-statement--project-goals)
3. [System Architecture & Technology Stack](#3-system-architecture--technology-stack)
4. [Functional Modules & Core Capabilities](#4-functional-modules--core-capabilities)
   - [4.1 Officer Scrutiny Dashboard](#41-officer-scrutiny-dashboard)
   - [4.2 Application Registry](#42-application-registry)
   - [4.3 Application Deep-Dive Dossier](#43-application-deep-dive-dossier)
   - [4.4 Document Intelligence & Ingestion Pipeline](#44-document-intelligence--ingestion-pipeline)
   - [4.5 Deterministic Validation Engine](#45-deterministic-validation-engine)
   - [4.6 Simulated Issuing-Authority Verification Hub](#46-simulated-issuing-authority-verification-hub)
   - [4.7 Regulatory Compliance Assistant (APH 2026-27)](#47-regulatory-compliance-assistant-aph-2026-27)
   - [4.8 Computer Vision Infrastructure Review](#48-computer-vision-infrastructure-review)
   - [4.9 Immutable Audit Trail & Reviewer Workflow](#49-immutable-audit-trail--reviewer-workflow)
   - [4.10 Official Scrutiny Report Generator](#410-official-scrutiny-report-generator)
5. [Deterministic Validation Rule Catalog](#5-deterministic-validation-rule-catalog)
6. [Data Model & Entity Specifications](#6-data-model--entity-specifications)
7. [Evaluator Test Scenarios & Walkthrough Guide](#7-evaluator-test-scenarios--walkthrough-guide)
8. [Archify Architecture Specifications & Visualizations](#8-archify-architecture-specifications--visualizations)
9. [Ethical AI, Legal Governance & Security Guardrails](#9-ethical-ai-legal-governance--security-guardrails)
10. [Setup, Installation & Execution Instructions](#10-setup-installation--execution-instructions)
11. [Production Roadmap & Scalability Strategy](#11-production-roadmap--scalability-strategy)

---

## 1. Executive Summary & Background

### 1.1 The Regulatory Context
The **All India Council for Technical Education (AICTE)**, established under the Ministry of Education, Government of India, is the statutory body responsible for proper planning and coordinated development of technical and management education throughout India. Each year, over 10,000 technical institutes apply for:
- Establishment of New Technical Institutions
- Extension of Approval (EoA)
- Increase in Approved Intake / Addition of New Courses
- Introduction of Supernumerary Quotas (e.g., TFW, PMSSS, OCI)
- Change of Site / Location or Conversion of Diploma to Degree

Under the statutory **AICTE Approval Process Handbook (APH)**, applicant institutions submit voluminous dossiers consisting of registered land deeds, building approval plans, fire safety NOCs, state government permissions, affiliating university letters, faculty cadres, and financial certificates.

### 1.2 The Scrutiny Bottleneck
Scrutiny of these applications is traditionally conducted by Scrutiny Committees, Hearing Committees, and Standing Appellate Committees. Reviewing tens of thousands of pages manually creates significant bottlenecks:
- **Human Fatigue & Inconsistent Verification:** Critical details such as lapsed fire certificates, misspelled trust titles, or post-dated affidavits can be overlooked during peak approval cycles.
- **Cross-Document Inconsistencies:** Information submitted in one document (e.g., land parcel size in an affidavit) frequently conflicts with values in another (e.g., municipal building completion plans).
- **Certificate Forgery & Recycling:** Entities have historically attempted to recycle identical building plans or NOCs across different regional applications.
- **External Verification Delays:** Cross-referencing issuing authorities (Tehsildar offices, state fire departments, municipal town planning authorities) is fragmented and unstandardized.

### 1.3 The Solution: AICTE Rakshak AI
**AICTE Rakshak AI (AICTE रक्षक AI)** is an AI-powered, human-in-the-loop decision-support platform engineered specifically to solve this challenge. It automates preliminary document extraction, cryptographic integrity verification, deterministic cross-document validation, and issuing-authority cross-checking, presenting scrutiny officers with an instant, auditable, evidence-backed evaluation dossier.

> **Statutory Disclaimer:** AICTE Rakshak AI is an **advisory decision-support prototype**. It does not possess autonomous regulatory authority to approve or reject applications. It equips authorized government officials with verified evidence and explainable findings, leaving ultimate adjudicative responsibility with the human committee.

---

## 2. Problem Statement & Project Goals

### 2.1 Problem Statement
> *"AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification for AICTE, Ministry of Education, Government of India."*

### 2.2 Primary Project Goals
1. **Accelerate Preliminary Scrutiny:** Reduce the time required for initial application triage from several hours to under 30 seconds per application.
2. **Zero Stochastic Drift:** Ensure that statutory compliance checks are 100% deterministic, explainable, and repeatable across runs, eliminating the risk of LLM hallucinations in regulatory decisions.
3. **Cryptographic Anti-Fraud:** Detect forged, altered, or recycled documents across distinct institutions using cryptographic SHA-256 fingerprinting.
4. **Resilient "Zero-Fail" Architecture:** Guarantee that the platform runs 100% reliably in offline, sandboxed, or zero-cloud-credential environments via deterministic fallback extractors.
5. **Comprehensive Evidentiary Audit Trail:** Every finding, verification status, and reviewer action must link directly to source document excerpts, statutory clauses, and immutable timestamps.

---

## 3. System Architecture & Technology Stack

### 3.1 Architectural Philosophy
The system adopts a **modular, monolithic fullstack architecture** built on Next.js 14. This structure guarantees:
- Single-command zero-orchestration deployment.
- Strict server-side security boundaries preventing API key leakage or unparsed document exposure.
- Unified TypeScript data models shared across client UI and backend Route Handlers.

```
+-------------------------------------------------------------------------------+
|                       Officer Scrutiny Web Dashboard                          |
|             (Next.js 14 App Router, React Server Components, Tailwind CSS)    |
+---------------------------------------+---------------------------------------+
                                        | HTTPS / JSON
+---------------------------------------v---------------------------------------+
|                    Next.js Server-Side Route Handlers                         |
|      (/api/applications, /api/documents, /api/validate, /api/verify)          |
+-------------------+-------------------+-------------------+-------------------+
                    |                   |                   |
+-------------------v---+  +------------v------------+  +--v--------------------+
| Document Intelligence |  | Deterministic Engine    |  | Authority Verification|
| - pdf-parse text stream|  | - 8 Objective Rules     |  | - 4 Simulated Adapters|
| - SHA-256 binary hash |  | - Clause & Excerpt Map  |  | - Realistic Latency   |
| - Gemini 1.5 / Regex  |  | - Severity Calculation  |  | - Override Drawer     |
+-------------------+---+  +------------+------------+  +--+--------------------+
                    |                   |                   |
+-------------------v-------------------v-------------------v-------------------+
|                         Data Persistence Layer                                |
|        - File-Backed Local JSON Store (.data/db.json) with Synchronous Flush   |
|        - In-Memory Memory Cache & Automatic Seed Initializer                   |
|        - Pluggable PostgreSQL / Supabase Migration Interface                  |
+-------------------------------------------------------------------------------+
```

### 3.2 Technology Stack

| Layer | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `14.2.15` | Unified React Server Components, server-side PDF parsing, and zero-CORS API route handlers. |
| **Language** | TypeScript | `5.x` | Strict type safety across document extraction, rule schemas, and persistence operations. |
| **Styling** | Tailwind CSS | `3.4.1` | Professional government-technology palette (Deep Navy `#0f2942`, Emerald, Amber, Rose). |
| **Icons** | Lucide React | `0.446.0` | Accessible, consistent iconography for status indicators, evidence links, and alerts. |
| **Visualizations** | Recharts | `2.12.7` | Responsive SVG charts for application status breakdowns and technical stream distributions. |
| **PDF Extraction** | `pdf-parse` & `pdf-lib` | `1.1.1` / `1.17.1` | Native Node.js buffer stream parsing for digital-native PDFs with zero OS binary dependencies. |
| **OCR Adapter** | `tesseract.js` (Canvas) | `5.1.1` | Client-side/worker optical character recognition for scanned image-based affidavits. |
| **AI LLM Engine** | Google Gemini 1.5 Flash | REST API | High-speed semantic extraction of unstructured text and anomaly summarization. |
| **Offline Heuristic** | Custom Deterministic Regex | Native TS | Fallback extraction engine ensuring zero failure when `GEMINI_API_KEY` is not present. |
| **Hashing Engine** | Node.js `crypto` | Native | SHA-256 cryptographic hashing of raw document buffers for tamper and duplicate detection. |
| **Persistence** | File-Backed JSON Store | Custom DB | Atomic file persistence (`.data/db.json`) allowing standalone local demo without database setup. |
| **Architecture Verification** | Archify Skill | `v1.0` | Formal specification validation, delivery, and headless browser testing of all architecture diagrams. |

---

## 4. Functional Modules & Core Capabilities

### 4.1 Officer Scrutiny Dashboard (`/`)
The primary landing view for authorized scrutiny officers:
- **Live Metric Aggregation:** Automatically calculates total applications, applications awaiting validation, missing documents count, potential anomalies, awaiting source verification, and cases requiring manual review. All counters are derived dynamically from the persistence store.
- **Visual Analytics:** Interactive Recharts graphs displaying application status distributions and institutional category breakdowns.
- **High-Priority Queue:** Direct shortcut cards highlighting applications flagged with `CRITICAL` or `HIGH` severity findings.
- **1-Click Test Scenario Launchpad:** Direct access to five pre-configured institutional test archetypes.

### 4.2 Application Registry (`/registry`)
A tabular registry supporting institutional discovery and search:
- **Instant Search:** Debounced full-text search across Application ID, Institution Name, Sponsoring Trust, City, and State.
- **Multi-Filter Facets:** Filter by Academic Stream (Engineering, Management, Pharmacy, Architecture, Polytechnic), Application Category (New Approval, EoA, Intake Expansion), and Validation Status.
- **Computed Status Badges:** Visual chips displaying missing documents count, anomaly severity count, and authority verification state.

### 4.3 Application Deep-Dive Dossier (`/applications/[id]`)
The core workspace where officers evaluate submitted applications:
- **Institution Profile Card:** Displays AICTE Permanent ID, legal trust name, land holding details, and geographical classification (Urban vs. Rural).
- **Tabbed Interface:** Organized into *Document Intelligence*, *Validation Findings*, *Authority Verification*, *APH Compliance*, *Computer Vision*, *Audit Trail*, and *Scrutiny Report*.
- **Reviewer Action Dialog:** Allows officers to record adjudicative decisions (`APPROVED`, `REJECTED`, `CLARIFICATION_REQUESTED`) with mandatory justification remarks.

### 4.4 Document Intelligence & Ingestion Pipeline
- **Drag-and-Drop Ingestion:** Accepts PDF documents with validation for MIME type (`application/pdf`) and maximum file size (10MB).
- **Server-Side Stream Parsing:** Uses `pdf-parse` to extract plain text and structural metadata.
- **SHA-256 Cryptographic Digest:** Generates an immutable 64-character hash of the raw byte buffer upon ingestion.
- **Field Extraction with Confidence:** Extracts key fields:
  - Institution Name
  - Registration / Reference Number
  - Issuing Authority
  - Issue Date & Expiry Date
  - Land Area (Acres) / Built-Up Area (sq.m)
  - Each extracted field includes an evidentiary confidence score (0–100%) and citation snippet.
- **Built-in Sample PDF Library:** Features 1-click test file injection (Clean Land Deed, Expired Fire NOC, Inconsistent State NOC).

### 4.5 Deterministic Validation Engine
- Enforces 8 objective statutory rules without stochastic variance.
- Evaluates submitted documents against Approval Process Handbook criteria.
- Generates structured `ValidationFinding` objects detailing Rule ID, Severity, Category, Explanation, Extracted Value, Expected Value, Citation Excerpt, and Recommended Action.
- Officers can resolve findings, request applicant clarifications, or waive findings with recorded executive justification.

### 4.6 Simulated Issuing-Authority Verification Hub
Simulates external government authority databases:
- **Agencies Simulated:**
  1. *State Revenue & Land Records Directorate* (Land Title & Ownership)
  2. *State Fire Prevention Services* (Fire Safety NOC)
  3. *Affiliating State Technical University* (University Affiliation NOC)
  4. *Municipal Town Planning / PWD* (Building Approval Plan)
- **Supported Statuses:** `VERIFIED`, `MISMATCH_DETECTED`, `EXPIRED`, `PENDING`, `SOURCE_UNAVAILABLE`, `MANUAL_REVIEW_REQUIRED`.
- **Transparency Safeguard:** Every response is explicitly badged with `"DEMO SIMULATION"`.
- **Evaluator Control Drawer:** Allows judges to force any verification state to test application behavior under network failure or data mismatch conditions.

### 4.7 Regulatory Compliance Assistant (APH 2026-27)
- Translates statutory clauses into an interactive verification checklist:
  - *Land & Building Norms:* Unencumbered title, minimum contiguous acreage by location.
  - *Mandatory NOCs:* State Government NOC, Affiliating University NOC, Fire Safety Clearance.
  - *Cadre & Faculty Ratios:* 1:20 teacher-to-student ratio, Cadre ratio of 1:2:6 (Professor : Assoc. Professor : Asst. Professor).
  - *Life Safety & Accessibility:* Barrier-free ramps, fire exits, and all-weather approach roads.

### 4.8 Computer Vision Infrastructure Review
- Supports visual inspection of laboratory equipment, fire safety gear, computer centers, and ramps.
- **Non-Discrimination Guardrail:** Explicitly prevents automated non-compliance conclusions if an item is not clearly visible in an uploaded photograph, prompting the officer to schedule a physical on-site committee visit.

### 4.9 Immutable Audit Trail & Reviewer Workflow
- Chronological timeline capturing every interaction:
  - Timestamp (ISO 8601)
  - Actor & Assigned Role (e.g., `Scrutiny Officer - Central Committee`)
  - Action Category (`STATUS_CHANGE`, `FINDING_RESOLVED`, `DOC_UPLOADED`, `VERIFICATION_OVERRIDE`)
  - Previous Value & New Value
  - Officer Remarks & Justification

### 4.10 Official Scrutiny Report Generator (`/applications/[id]/report`)
- Generates a formal, printable executive scrutiny report.
- Features institutional watermarks, complete document inventories, findings summaries, verification outcomes, and official signature blocks.
- Supports native browser printing (`window.print()`) and JSON export for national data warehousing.

---

## 5. Deterministic Validation Rule Catalog

All statutory checks in AICTE Rakshak AI are executed by the deterministic validation engine located at `src/lib/validation/engine.ts`. The rules are defined as follows:

| Rule ID | Rule Name | Severity | Description & Statutory Trigger | Statutory Source |
| :--- | :--- | :--- | :--- | :--- |
| `RULE_001` | `RULE_DOC_MANDATORY` | **CRITICAL** | Flags missing mandatory documents based on application category (e.g., Land Deed for New Approval; University NOC for EoA). | APH 2026-27 Clause 2.3 |
| `RULE_002` | `RULE_CERT_EXPIRY` | **CRITICAL** | Flags certificates whose expiry date is prior to the application filing date or current scrutiny cycle. | APH 2026-27 Clause 3.1 |
| `RULE_003` | `RULE_DATE_RANGE_VALIDITY`| **HIGH** | Detects inverted date ranges (Issue Date > Expiry Date) or anomalous post-dated certificates. | General Statutory Law |
| `RULE_004` | `RULE_FIELD_COMPLETENESS` | **MEDIUM** | Identifies blank, unpopulated, or non-extractable mandatory fields in submitted applications. | APH Application Norms |
| `RULE_005` | `RULE_NAME_CONSISTENCY` | **HIGH** | Calculates Levenshtein token similarity between institution names across documents; flags similarity < 85%. | APH 2026-27 Clause 2.1 |
| `RULE_006` | `RULE_REG_CONSISTENCY` | **CRITICAL** | Cross-checks Sponsoring Trust / Society Registration Number across all uploaded filings; flags exact mismatches. | Societies Reg. Act 1860 |
| `RULE_007` | `RULE_CHECKLIST_EVIDENCE`| **HIGH** | Verifies that all mandatory APH compliance checklist items cite at least one verified document reference. | APH Scrutiny Norms |
| `RULE_008` | `RULE_DUPLICATE_HASH` | **CRITICAL** | Computes SHA-256 digest of uploaded files and scans global registry for collisions; flags duplicate filings across institutions. | Anti-Fraud Framework |

---

## 6. Data Model & Entity Specifications

The data architecture is strictly typed in TypeScript (`src/types/index.ts`). Below is the entity relational model:

```
+--------------------+        1:N         +--------------------+
|    Institution     |------------------->|    Application     |
+--------------------+                    +--------------------+
| id (PK)            |                    | id (PK)            |
| name               |                    | institutionId (FK) |
| address, city, state|                   | category           |
| pinCode            |                    | academicYear       |
| institutionType    |                    | validationStatus   |
| trustName          |                    | overallRiskScore   |
| trustRegNumber     |                    | submissionDate     |
+--------------------+                    +---------+----------+
                                                    |
            +-------------------+-------------------+-------------------+
            | 1:N               | 1:N               | 1:N               | 1:N
            v                   v                   v                   v
+--------------------+  +--------------------+  +--------------------+  +--------------------+
|      Document      |  | ValidationFinding  |  | VerificationRecord |  |   AuditLogEntry    |
+--------------------+  +--------------------+  +--------------------+  +--------------------+
| id (PK)            |  | id (PK)            |  | id (PK)            |  | id (PK)            |
| applicationId (FK) |  | applicationId (FK) |  | applicationId (FK) |  | applicationId (FK) |
| docType            |  | ruleId (FK)        |  | documentId (FK)    |  | timestamp          |
| fileName           |  | severity           |  | authorityType      |  | actorId, actorRole |
| fileHash (SHA-256) |  | category           |  | verificationStatus |  | actionType         |
| uploadDate         |  | explanation        |  | verificationDate   |  | details            |
| status             |  | citationExcerpt    |  | simulatedWatermark |  | remarks            |
| extractedFields[]  |  | reviewStatus       |  | rawResponse        |  +--------------------+
+--------------------+  +--------------------+  +--------------------+
```

### 6.1 Key Interface Definitions

```typescript
export interface Application {
  id: string;
  institutionId: string;
  category: 'NEW_APPROVAL' | 'EOA' | 'INTAKE_EXPANSION' | 'NEW_PROGRAM';
  academicYear: string;
  submissionDate: string;
  validationStatus: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'ANOMALIES_DETECTED' | 'REJECTED';
  overallRiskScore: number; // 0 (Clean) to 100 (Severe Risk)
  missingDocsCount: number;
  anomaliesCount: number;
  reviewerNotes?: string;
}

export interface Document {
  id: string;
  applicationId: string;
  docType: DocumentType;
  fileName: string;
  fileSize: number;
  fileHash: string; // SHA-256 digest
  extractedFields: ExtractedField[];
  status: 'PENDING' | 'EXTRACTED' | 'FAILED';
}

export interface ValidationFinding {
  id: string;
  applicationId: string;
  ruleId: string;
  ruleName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  extractedValue?: string;
  expectedValue?: string;
  citationExcerpt?: string;
  recommendedAction: string;
  reviewStatus: 'UNREVIEWED' | 'CONFIRMED' | 'RESOLVED' | 'WAIVED';
  waiverJustification?: string;
}
```

---

## 7. Evaluator Test Scenarios & Walkthrough Guide

The prototype includes five pre-configured synthetic institutional applications designed to showcase every feature and validation branch:

```
+------------------------------------------------------------------------------------------------------+
|                                 5 Pre-Configured Test Archetypes                                     |
+-----------------------+-----------------------+------------------+-----------------------------------+
| Application ID        | Institution Name      | Category         | Test Condition / Injected Anomaly |
+-----------------------+-----------------------+------------------+-----------------------------------+
| APP-2026-ENG-8491     | Aryabhatta Institute  | New Approval     | Scenario 1: Clean Passing Profile |
| APP-2026-ENG-3042     | Vidyapeeth Polytech   | Extension (EoA)  | Scenario 2: Missing Mandatory Doc |
| APP-2026-ENG-9182     | Saraswati College     | Intake Expansion | Scenario 3: Expired Fire Safety   |
| APP-2026-ENG-5120     | Drona Academy         | New Approval     | Scenario 4: Name & Reg Mismatches |
| APP-2026-ENG-7731     | Kalinga Institute     | New Program      | Scenario 5: SHA-256 Collision     |
+-----------------------+-----------------------+------------------+-----------------------------------+
```

### Detailed Evaluation Steps:

#### Scenario 1: Clean Compliant Profile (`APP-2026-ENG-8491`)
1. Open the **Officer Scrutiny Dashboard** and select **Aryabhatta Institute of Technology**.
2. Observe that all 5 required documents (Land Title, Building Plan, Fire NOC, State NOC, Affiliation Letter) are present.
3. Check the **Findings Tab**: Zero anomalies detected; Risk score is 0/100.
4. Check **Authority Verification**: All 4 external agencies return `VERIFIED`.

#### Scenario 2: Missing Mandatory Document (`APP-2026-ENG-3042`)
1. Navigate to **Vidyapeeth Polytechnic College**.
2. The dashboard immediately alerts: `Missing Mandatory Document: Land Title Deed`.
3. Open the **Document Intelligence Tab**: Use the built-in sample injection button to upload the missing Land Title Deed.
4. Click **Run Re-Validation**: Watch the engine re-evaluate and automatically clear the missing document finding in real time.

#### Scenario 3: Expired Certificate (`APP-2026-ENG-9182`)
1. Navigate to **Saraswati College of Engineering**.
2. Notice the `CRITICAL` finding generated by `RULE_002`: Fire Safety NOC expired on January 15, 2026.
3. Test the Reviewer Workflow: Click **Waive with Justification**, enter an executive note (e.g., *"Provisional renewal receipt verified under file #FS-2026-991"*), and observe the status transition to `WAIVED` while updating the immutable audit trail.

#### Scenario 4: Cross-Document Token & Registration Mismatches (`APP-2026-ENG-5120`)
1. Navigate to **Drona Academy of Applied Sciences**.
2. Observe two simultaneous findings:
   - `RULE_005`: Institution name mismatch between Land Title (*"Drona Institute of Tech"*) and University NOC (*"Drona Academy of Applied Sciences"*).
   - `RULE_006`: Sponsoring Trust ID mismatch between Society Deed (`DET-4491`) and State NOC (`DVS-9912`).
3. Click the citation excerpts to compare the conflicting text snippets directly.

#### Scenario 5: Duplicate SHA-256 Hash & Authority Outage (`APP-2026-ENG-7731`)
1. Navigate to **Kalinga Institute of Advanced Computing**.
2. Observe the `CRITICAL` finding from `RULE_008`: The submitted Building Plan has an identical SHA-256 hash to a plan previously submitted by Aryabhatta Institute (`APP-2026-ENG-8491`).
3. Switch to **Authority Verification**: Notice that the Municipal Town Planning authority returns `SOURCE_UNAVAILABLE (HTTP 503)`.
4. Open the **Evaluator Control Drawer**: Force the status to `VERIFIED` or `MANUAL_REVIEW_REQUIRED` to test system recovery.

---

## 8. Archify Architecture Specifications & Visualizations

The technical architecture of AICTE Rakshak AI has been formally verified using the **Archify specification standard**. The generated interactive HTML diagrams are located in `docs/architecture/`:

| Diagram | Source Specification | Interactive Visualization | Verification Gates Passed |
| :--- | :--- | :--- | :--- |
| **System Architecture** | [`docs/architecture/system-architecture.json`](./docs/architecture/system-architecture.json) | [**`system-architecture.html`**](./docs/architecture/system-architecture.html) | `validate` ✅ `deliver` ✅ `check` ✅ `browser-check` ✅ |
| **End-to-End Workflow** | [`docs/architecture/application-workflow.json`](./docs/architecture/application-workflow.json) | [**`application-workflow.html`**](./docs/architecture/application-workflow.html) | `validate` ✅ `deliver` ✅ `check` ✅ `browser-check` ✅ |
| **Validation Engine Flow** | [`docs/architecture/validation-engine.json`](./docs/architecture/validation-engine.json) | [**`validation-engine.html`**](./docs/architecture/validation-engine.html) | `validate` ✅ `deliver` ✅ `check` ✅ `browser-check` ✅ |
| **Data Model (ERD)** | [`docs/architecture/data-model.json`](./docs/architecture/data-model.json) | [**`data-model.html`**](./docs/architecture/data-model.html) | `validate` ✅ `deliver` ✅ `check` ✅ `browser-check` ✅ |

### Instructions to Open the Diagrams:
The diagrams are standalone single-page HTML files with semantic zooming, dark mode, and search:
```powershell
# Open any diagram directly in your browser
Start-Process "docs\architecture\system-architecture.html"
Start-Process "docs\architecture\application-workflow.html"
Start-Process "docs\architecture\validation-engine.html"
Start-Process "docs\architecture\data-model.html"
```

---

## 9. Ethical AI, Legal Governance & Security Guardrails

AICTE Rakshak AI is built with foundational ethical and governance principles required for high-stakes public sector digital infrastructure:

1. **Mandatory Human-in-the-Loop:** The system is architecturally constrained to an advisory role. The application database strictly prohibits automated status transitions to `APPROVED` or `REJECTED`. Only authenticated officers can finalize regulatory decisions.
2. **Deterministic Adjudication:** To prevent arbitrary or biased outcomes, statutory rules (`RULE_001` through `RULE_008`) execute using deterministic logic rather than generative language model inference.
3. **No False Accusations of Fraud:** The system categorizes discrepancies as *"Potential Anomalies"* or *"Verification Mismatches"*, never as definitive fraud. The platform recognizes that scanning defects, typographical errors, and genuine renewal lags can occur.
4. **Watermarked Simulations:** All issuing authority responses carry unambiguous `DEMO SIMULATION` headers to prevent any misrepresentation of live government integration during demonstrations.
5. **Zero Secret Leakage:** All API keys (`GEMINI_API_KEY`, `DATABASE_URL`) are isolated to server-side Route Handlers and are never transmitted to client bundles.

---

## 10. Setup, Installation & Execution Instructions

### 10.1 Prerequisites
- **Node.js:** Version `18.17.0` or `>= 20.0.0`
- **Package Manager:** `npm` (v9+) or `pnpm`
- **Operating System:** Windows 10/11, macOS, or Linux

### 10.2 Installation Steps
```bash
# 1. Clone repository and navigate to workspace
cd AICTE

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

### 10.3 Production Build Verification
To verify production optimization and TypeScript compilation:
```bash
npm run build
npm run start
```
The application compiles cleanly into static and server-rendered dynamic routes with zero TypeScript or linting errors.

### 10.4 Optional Configuration (`.env.local`)
The application is pre-configured to run **100% offline with zero external dependencies**. To enable live cloud features:
```env
# Optional: Google Gemini API key for live LLM extraction
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: PostgreSQL / Supabase connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/aicte_rakshak
```

---

## 11. Production Roadmap & Scalability Strategy

```
+----------------------------------------------------------------------------------------------------+
|                                    Production Deployment Roadmap                                   |
+------------------------------------+------------------------------------+--------------------------+
| Phase 1: Near-Term (Months 1-3)    | Phase 2: Medium-Term (Months 4-6)  | Phase 3: Long-Term       |
+------------------------------------+------------------------------------+--------------------------+
| - DigiLocker / API Setu G2G Auth   | - Bhu-Naksha GIS Land Mapping      | - Edge Model Inference   |
| - Regional OCR (Hindi, Marathi)    | - Supabase / Postgres DB Cluster   | - National APH Analytics |
| - SSO with AICTE Central Portal    | - Automated Scrutiny Minutes Gen   | - Inter-Ministry Sharing |
+------------------------------------+------------------------------------+--------------------------+
```

1. **Direct G2G Integration via API Setu & DigiLocker:** Transition the simulated verification hub to authenticated Government-to-Government (G2G) REST APIs for real-time land record, municipal plan, and affiliation verification.
2. **Geospatial GIS Land Verification:** Integrate with state GIS land title mapping (Bhu-Naksha) to match institution geo-coordinates with registered land survey numbers.
3. **Multilingual Regional OCR:** Extend the extraction pipeline to support regional language affidavits and court orders using localized OCR models.
4. **Enterprise Scalability:** Transition the local file-backed store to a fault-tolerant PostgreSQL cluster hosted on National Informatics Centre (NIC) cloud infrastructure.

---

*AICTE Rakshak AI — Empowering Scrutiny Committees with Intelligent, Explainable, and Legally Defensible Regulatory Decision Support.*
