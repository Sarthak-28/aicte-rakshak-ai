# AICTE Rakshak AI (AICTE रक्षक AI)

**Problem Statement:** AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification  
**Target Agency:** All India Council for Technical Education (AICTE), Ministry of Education, Government of India  
**Nature of Platform:** Human-in-the-Loop Decision-Support Prototype (Advisory, Non-Autonomous)

---

## 1. Executive Summary

**AICTE Rakshak AI** is an institutional gov-tech decision-support platform designed to assist scrutiny officers and regional committees in validating technical education approval applications. The system automates the preliminary ingestion of multi-format institutional filings, server-side PDF text extraction, cryptographic SHA-256 fingerprinting for duplicate detection, deterministic cross-document validation rules, simulated issuing-authority verification, and Approval Process Handbook (APH 2026-27) regulatory compliance checking.

> **Regulatory Compliance Disclaimer:** AICTE Rakshak AI is an advisory decision-support prototype. It does not make binding statutory decisions, nor does it automatically approve or reject any application. Authorized AICTE scrutiny committees retain complete adjudicative authority. All issuing-authority verification endpoints are simulated and explicitly badged as `DEMO SIMULATION`.

---

## 2. Core Functional Modules

1. **Officer Scrutiny Dashboard (`/`)**:
   - Live KPI metric counters computed directly from application records (Total submissions, awaiting validation, missing documents, potential anomalies, awaiting source verification, manual review queue).
   - Recharts visual analytics: Status distribution breakdown and technical stream representation.
   - High-priority pending actions drawer and real-time audit activity feed.
   - 1-click launchpad for the 5 synthetic test scenarios.

2. **Application Registry (`/registry`)**:
   - Searchable and multi-filter table with live keyword search (by ID, institution name, trust, state).
   - Scenario preset filter buttons for 1-click evaluation of each hackathon archetype.
   - Computed badges for missing documents count, anomalies count, and authority verification state.

3. **Document Intelligence & PDF Extraction**:
   - Drag-and-drop PDF upload with strict file type and 10MB size validation.
   - Server-side plain-text stream extraction and cryptographic SHA-256 binary hashing.
   - Provider-independent AI interface supporting Google Gemini API with seamless offline heuristic regex fallback.
   - Structured metadata extraction with confidence indicators (0-100%) and citation excerpts.
   - Built-in 1-Click Sample PDF Library (Land Title, Expired Fire NOC, Inconsistent State NOC).

4. **Deterministic Validation Engine**:
   - 8 objective rules executing without stochastic drift:
     - `RULE_DOC_MANDATORY`: Missing mandatory statutory documents by approval category.
     - `RULE_FIELD_COMPLETENESS`: Omitted or blank regulatory fields.
     - `RULE_CERT_EXPIRY`: Lapsed validity dates (e.g. Fire Safety, Building Plan).
     - `RULE_DATE_RANGE_VALIDITY`: Post-dated anomalies or inverted issue/expiry ranges.
     - `RULE_NAME_CONSISTENCY`: Cross-document token similarity of institution title.
     - `RULE_REG_CONSISTENCY`: Cross-document sponsoring trust registration ID match.
     - `RULE_DUPLICATE_HASH`: SHA-256 cryptographic duplicate detection across the registry.
     - `RULE_CHECKLIST_EVIDENCE`: APH compliance checklist item coverage.
   - Evidence-linked finding cards displaying expected value, extracted value, excerpt quote, and officer actions ("Resolve", "Waive with Justification", "Request Clarification").

5. **Simulated Issuing-Authority Verification Hub**:
   - Multi-agency simulation: State Revenue & Land Records, Municipal Town Planning / PWD, Directorate of Fire Services, Higher Education Secretariat.
   - 6 supported statuses: `VERIFIED`, `MISMATCH_DETECTED`, `EXPIRED`, `PENDING`, `SOURCE_UNAVAILABLE`, `MANUAL_REVIEW_REQUIRED`.
   - Prominent `DEMO SIMULATION` watermarks.
   - **Evaluator Simulation Controls Panel**: Allows hackathon judges to force any verification status on demand to test all validation branches.

6. **Regulatory Compliance Assistant (APH 2026-27 Norms)**:
   - Configurable checklist items for Land Norms, Statutory NOCs, Faculty Cadre Ratios, and Life Safety Norms.
   - Direct link between compliance assertions and underlying document citation excerpts.

7. **Infrastructure Evidence Review (Computer Vision)**:
   - Dual-mode image asset analyzer (Gemini Vision or offline bounding box detector).
   - Detects computer workstations, fire extinguishers, ramps, and laboratory apparatus.
   - **Critical Guardrail:** Built-in disclaimer preventing non-compliance conclusions solely because an item is not visible in a photo; provides an instant toggle to recommend on-site physical inspection.

8. **Immutable Audit Trail & Review Workflow**:
   - Chronological event stream logging actor, role, action, previous value, new value, and officer remarks.
   - Scrutiny Officer comment form for logging formal observations and clarification requests.

9. **Official Validation Report (`/applications/[id]/report`)**:
   - Printable and downloadable executive summary report with institutional header, complete document inventory, findings summary, verification outcomes, and officer signature blocks.
   - JSON export for external archival.

---

## 3. The 5 Pre-Configured Synthetic Scenarios

| Scenario ID | Institution Name | Category | Test Archetype | Injected Anomaly / Behavior |
|---|---|---|---|---|
| **APP-2026-ENG-8491** | Aryabhatta Institute of Technology & Management (Jaipur, RJ) | New Approval | **Scenario 1: Clean Passing** | 5 complete documents, unencumbered 10.2 acres land, valid 2028 Fire NOC, 100% verified. |
| **APP-2026-ENG-3042** | Vidyapeeth Polytechnic College (Gwalior, MP) | Extension of Approval | **Scenario 2: Missing Mandatory Doc** | Land Title Deed omitted. Flagged with critical missing document finding and clarification prompt. |
| **APP-2026-ENG-9182** | Saraswati College of Engineering & Research (Pune, MH) | Intake Expansion | **Scenario 3: Expired Fire Certificate** | Fire Safety NOC expired on 15-Jan-2026. Date validator halts intake expansion pending renewal. |
| **APP-2026-ENG-5120** | Drona Academy of Applied Sciences (Bengaluru, KA) | New Approval | **Scenario 4: Name & Reg Mismatches** | Trust Deed cites "Drona Educational Trust (DET-4491)", while State NOC cites "Drona Vidya Samiti (DVS-9912)". |
| **APP-2026-ENG-7731** | Kalinga Institute of Advanced Computing (Bhubaneswar, OD) | New Program | **Scenario 5: Duplicate Hash & Outage** | Building Plan has exact SHA-256 hash matching Aryabhatta Institute; Municipal verification returns HTTP 503. |

---

## 4. Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- npm (v9+)

### Installation & Execution
```bash
# Clone and enter workspace
cd AICTE

# Install dependencies (already installed in workspace)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional Environment Variables (`.env.local`)
The application works **100% offline with zero external keys**. To enable live AI models or database connections:
```env
# Optional: Google Gemini API Key for live AI extraction and vision analysis
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Remote PostgreSQL / Supabase connection
DATABASE_URL=postgresql://user:password@host:port/dbname
```

---

## 5. Technology Stack
- **Framework:** Next.js 14 (App Router, Server-Side API Handlers)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS (Government-grade institutional theme: Navy Blue `#0f2942`, Teal `#0d9488`, Amber, Rose)
- **Visualizations:** Recharts (Bar & Pie responsive charts)
- **Icons:** Lucide React
- **Persistence:** Atomic File-Backed Local JSON Store (`.data/db.json`) with in-memory caching and 1-click Reset button
- **PDF Engine:** Pure TypeScript binary generator and server-side layout stream parser with SHA-256 cryptographic hashing

---

## 6. Verification and Testing Instructions for Judges
1. **Officer Dashboard (`/`)**: View computed metrics and launch any of the 5 scenarios.
2. **Test Scenario 2 (Missing Document)**: Open `APP-2026-ENG-3042`, switch to *Document Intelligence*, and click `+ Land Deed (Clean)` to upload the missing document. Observe the validation engine automatically resolve the missing document finding!
3. **Test Scenario 3 (Expired Certificate)**: Open `APP-2026-ENG-9182`, examine the critical finding for Fire Safety NOC expired on 15-Jan-2026, click *Waive with Justification* and enter an officer executive note.
4. **Test Scenario 5 (Duplicate Hash & Outage)**: Open `APP-2026-ENG-7731`, examine the SHA-256 duplicate alert matching `APP-2026-ENG-8491`. Go to *Authority Verification* and use the *Evaluator Simulation Controls* to toggle between `VERIFIED`, `MISMATCH_DETECTED`, and `SOURCE_UNAVAILABLE`.
5. **Print Scrutiny Report**: Switch to the *Scrutiny Report* tab or open `/applications/APP-2026-ENG-8491/report` and click *Print / Save as PDF*.
