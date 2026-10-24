# Architectural Decision Records (ADRs)
## AICTE Rakshak AI — AI-Powered Application Validation & Regulatory Compliance Verification

This document records the key architectural choices, trade-offs, and rationale made during the design and implementation of AICTE Rakshak AI. Each record follows the standard Architecture Decision Record (ADR) structure.

---

### Index of Decisions

1. [ADR-01: Unified Next.js 14 App Router Architecture](#adr-01-unified-nextjs-14-app-router-architecture)
2. [ADR-02: File-Backed Local JSON Persistence with Seed Fallback](#adr-02-file-backed-local-json-persistence-with-seed-fallback)
3. [ADR-03: Provider-Independent AI Analysis with Deterministic Heuristic Fallback](#adr-03-provider-independent-ai-analysis-with-deterministic-heuristic-fallback)
4. [ADR-04: Strict Separation Between Deterministic Validation and Semantic AI](#adr-04-strict-separation-between-deterministic-validation-and-semantic-ai)
5. [ADR-05: Non-Autonomous Advisory Decision-Support Guardrail](#adr-05-non-autonomous-advisory-decision-support-guardrail)
6. [ADR-06: Watermarked Simulated Issuing-Authority Adapter Hub](#adr-06-watermarked-simulated-issuing-authority-adapter-hub)
7. [ADR-07: Server-Side PDF Parsing with Client-Side Tesseract OCR Fallback](#adr-07-server-side-pdf-parsing-with-client-side-tesseract-ocr-fallback)
8. [ADR-08: SHA-256 Cryptographic Fingerprinting for Integrity & Duplicate Detection](#adr-08-sha-256-cryptographic-fingerprinting-for-integrity--duplicate-detection)

---

### ADR-01: Unified Next.js 14 App Router Architecture

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
AICTE Rakshak AI requires a responsive, high-performance government dashboard interface alongside secure server-side PDF processing, cryptographic hashing, and external API coordination. Developing a segregated frontend (e.g., React SPA) and backend (e.g., Express or Flask API) introduces deployment orchestration overhead, CORS complexity, and duplicate type definitions for a hackathon prototype.

#### Decision Drivers
* Rapid, monolithic deployment with zero microservice orchestration overhead.
* Server-side execution guarantees for sensitive document parsing and API key isolation.
* Strong type safety shared across API request/response boundaries via TypeScript.
* Fast initial page load with React Server Components (RSC) and responsive client interactivity with Tailwind CSS.

#### Considered Options
1. *Decoupled Architecture:* React Single Page App (Vite) + Python FastAPI backend.
2. *Unified Fullstack Framework:* Next.js 14 with App Router (`src/app/` and `src/app/api/`).
3. *Node.js Express + Server-Side EJS/Handlebars.*

#### Decision Outcome
Selected **Option 2 (Next.js 14 App Router)**.
All application logic, data access, PDF parsing, validation routines, and API endpoints reside in a unified Next.js repository. Client components handle interactive dashboard widgets, upload forms, and review modals, while Route Handlers (`src/app/api/*`) handle document ingestion, validation execution, audit logging, and report generation.

#### Consequences
* **Positive:** Single command execution (`npm run dev` / `npm run build`), shared TypeScript interfaces (`src/types/index.ts`), zero CORS configuration issues, and zero leakage of server secrets to the client.
* **Negative:** Node.js runtime memory limits when handling multiple large PDF files concurrently in serverless environments.
* **Mitigation:** Implemented a strict 10MB per-document upload limit and streaming buffer processing.

---

### ADR-02: File-Backed Local JSON Persistence with Seed Fallback

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
The prototype must operate reliably in zero-dependency evaluation environments where external PostgreSQL or Supabase instances are not provisioned or internet connectivity is restricted, while still supporting real-time mutations (review decisions, manual overrides, audit logging).

#### Decision Drivers
* Zero external infrastructure prerequisite for local demonstration and evaluation.
* Persistence of user reviews, overrides, and audit trails across page refreshes.
* Clear migration path to an enterprise relational database (PostgreSQL / Supabase).

#### Considered Options
1. *Strict PostgreSQL / Supabase Requirement:* High setup friction for evaluators; fails offline.
2. *In-Memory Volatile Store:* Data resets on server restart or page refresh; poor demo experience.
3. *File-Backed Local JSON Store with Seed Fallback:* Self-contained filesystem persistence (`.data/db.json`) initialized automatically from deterministic seed data (`src/lib/data/seed-data.ts`).

#### Decision Outcome
Selected **Option 3 (File-Backed Local JSON Store)**.
The persistence abstraction in `src/lib/data/db.ts` checks for `.data/db.json` on disk. If absent, it automatically seeds the store with five realistic institutional applications and persists all subsequent modifications to disk with synchronous write backups.

#### Consequences
* **Positive:** Ready to demo out-of-the-box without running Docker or database setup scripts. Evaluator mutations persist across sessions.
* **Negative:** Not designed for horizontal scale or concurrent write locking across multiple server processes.
* **Mitigation:** Repository encapsulates all data access functions in `src/lib/data/db.ts` with clean repository patterns (`getApplications`, `updateApplication`, `addAuditLog`), enabling trivial swapping to a Prisma/Drizzle PostgreSQL adapter in production.

---

### ADR-03: Provider-Independent AI Analysis with Deterministic Heuristic Fallback

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
The system employs AI to extract unstructured institutional metadata, summarize anomalies, and provide natural-language reasoning. However, evaluation environments may lack active Gemini API keys (`GEMINI_API_KEY`) or face rate limits and outbound network firewalls.

#### Decision Drivers
* Prototype must remain 100% functional without active external API credentials.
* AI outputs must be reproducible and not produce hallucinated institutional identifiers.
* Clean abstraction layer permitting replacement of the underlying LLM provider.

#### Considered Options
1. *Hard Dependency on Google Gemini SDK / OpenAI SDK:* Hard failure if API key is invalid or quota exceeded.
2. *Pure Mock / Static AI Responses:* Fails to demonstrate dynamic LLM reasoning when API keys are supplied.
3. *Decoupled Provider Interface with Heuristic Fallback:* Dual-engine architecture in `src/lib/ai/gemini.ts` that dynamically probes for `GEMINI_API_KEY` and gracefully falls back to deterministic rule-based semantic extractors.

#### Decision Outcome
Selected **Option 3 (Decoupled Provider Interface with Heuristic Fallback)**.
The AI layer tests for `GEMINI_API_KEY` at runtime. When present, it executes Gemini 1.5 Flash queries via direct REST requests. When missing, network errors occur, or rate limits trigger, it transparently engages local regex and keyword heuristics, labeling results with `provider: "offline-fallback"` and `confidence: 0.70-0.85`.

#### Consequences
* **Positive:** The application never crashes due to missing keys or quota limits. Evaluators can test both offline and online modes seamlessly.
* **Negative:** Heuristic fallback cannot perform nuanced cross-document contextual interpretation beyond predefined regex patterns.
* **Mitigation:** UI clearly tags AI-assisted observations with confidence chips and provider attribution.

---

### ADR-04: Strict Separation Between Deterministic Validation and Semantic AI

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
Regulatory compliance verification for government accreditation requires high auditability, determinism, and zero tolerance for stochastic hallucinations. If an LLM directly evaluates whether an institution meets land area or faculty ratio rules, the results will vary unpredictably across runs.

#### Decision Drivers
* Legal defensibility and objective repeatability of compliance findings.
* Explainable validation logic directly citing specific clauses and submitted evidence.
* Elimination of prompt injection and stochastic hallucination risks in regulatory findings.

#### Considered Options
1. *End-to-End LLM Prompting:* Prompting an LLM with all documents to output compliance pass/fail verdicts.
2. *Rule-Engine Only:* Deterministic code without any semantic extraction or summary capabilities.
3. *Layered Hybrid:* A strictly deterministic validation engine (`src/lib/validation/engine.ts`) enforcing 8 objective rules, combined with AI solely for unstructured text extraction and natural language anomaly summarization.

#### Decision Outcome
Selected **Option 3 (Layered Hybrid Architecture)**.
All findings (`Finding` objects with `RULE_*` IDs, severity, evidence pointers, and statutory references) are generated purely by deterministic TypeScript code in `src/lib/validation/engine.ts`. AI is strictly confined to preliminary text structuring and reviewer briefing generation.

#### Consequences
* **Positive:** 100% deterministic, repeatable findings across runs. Full statutory audit trail.
* **Negative:** Additional code required to define and maintain explicit validation rule sets.
* **Mitigation:** Modular rule definitions in `src/lib/validation/rules.ts` allow adding or updating regulatory thresholds without touching parsing or UI logic.

---

### ADR-05: Non-Autonomous Advisory Decision-Support Guardrail

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
AI systems must not autonomously grant or revoke governmental institutional approvals. Misinterpreting scanned document quality as academic non-compliance could lead to severe legal and institutional disruption.

#### Decision Drivers
* Government ethical AI guidelines and legal compliance requirements.
* Protection of institutional applicants against false-positive automated rejections.
* Clear human accountability for every regulatory decision.

#### Considered Options
1. *Autonomous Regulatory Decision Engine:* System automatically updates institutional status to "Approved" or "Rejected" based on score thresholds.
2. *Advisory Decision-Support System with Mandatory Human Sign-Off:* System generates structured evidence, recommendations, and risk flags, but restricts status modifications to authorized human reviewers.

#### Decision Outcome
Selected **Option 2 (Non-Autonomous Advisory Guardrail)**.
The system is explicitly engineered as an advisory tool. The backend enforces that regulatory status transitions (e.g., `APPROVED`, `REJECTED`, `CLARIFICATION_REQUESTED`) can only occur via the authenticated Review Action API (`src/app/api/reviews/route.ts`), recording the reviewer's ID, timestamp, and mandatory rationale into the immutable audit trail.

#### Consequences
* **Positive:** Absolute regulatory safety, zero risk of autonomous erroneous rejection, full institutional transparency.
* **Negative:** Requires authorized reviewer attention for every application.
* **Mitigation:** System ranks applications by risk priority (`HIGH_RISK`, `ANOMALIES_DETECTED`, `CLEAN`), allowing officers to focus immediate effort on flagged discrepancies.

---

### ADR-06: Watermarked Simulated Issuing-Authority Adapter Hub

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
Verifying certificates requires cross-referencing external authorities (State Parivahan/Land Portals, Affiliating State Universities, BCI, PCI, CoA, and NAAC/NBA registries). In a hackathon prototype, live access to production government APIs is unavailable due to credentialing, MOU requirements, and security firewalls.

#### Decision Drivers
* Realistic demonstration of end-to-end verification workflows.
* Absolute transparency that external connections are simulated (no false representation of live government access).
* Pluggable adapter architecture ready for live REST/SOAP integration when credentials are granted.

#### Considered Options
1. *Omit Verification Step:* Limits demonstration of the core regulatory workflow.
2. *Simulated Responses Without Watermarking:* Risk of misleading users into believing real government records were queried.
3. *Watermarked Simulated Verification Adapter Hub:* Pluggable adapter (`src/lib/verification/adapter.ts`) returning realistic mock responses, explicitly watermarked with `DEMO SIMULATION`, complete with an interactive reviewer override drawer for testing edge cases.

#### Decision Outcome
Selected **Option 3 (Watermarked Simulated Adapter Hub)**.
The adapter simulates four authorities:
* `LAND_REGISTRY` (Land Ownership / Tehsildar Title Certificate)
* `AFFILIATING_UNIVERSITY` (State Technical University Affiliation NOC)
* `PROFESSIONAL_COUNCIL` (BCI / PCI / CoA Approvals)
* `ACCREDITATION_BOARD` (NAAC / NBA Accreditation Certificates)

All responses carry `status: "VERIFIED" | "MISMATCH_DETECTED" | "SOURCE_UNAVAILABLE" | "EXPIRED"`, an explicit `simulationWatermark: "DEMO SIMULATION - FOR PROTOTYPE PURPOSES ONLY"`, and simulated latency (400-800ms).

#### Consequences
* **Positive:** Demonstrates full verification lifecycle (mismatch detection, expiry alerts, manual overrides) without legal exposure or live API dependencies.
* **Negative:** Evaluators must understand responses are synthetic.
* **Mitigation:** Prominent UI badges and banner watermarks clearly designate all verification records as simulated.

---

### ADR-07: Server-Side PDF Parsing with Client-Side Tesseract OCR Fallback

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
Institutions submit both digital-native PDFs and scanned physical documents. Scanned PDFs yield zero selectable text when parsed with standard PDF extractors, causing extraction failure.

#### Decision Drivers
* Seamless handling of both searchable digital PDFs and scanned image PDFs.
* No reliance on external cloud OCR services that require paid API subscriptions.
* Strict execution boundaries between server and client to manage compute load.

#### Considered Options
1. *External Cloud OCR API (Google Cloud Vision / AWS Textract):* High setup barrier, paid credentials, fails in offline environments.
2. *Server-Side Python Tesseract Microservice:* Requires native C++ binary installations on host OS (`tesseract-ocr`), complicating Windows/Mac/Linux setup.
3. *Hybrid Architecture:* Server-side `pdf-parse` for fast text extraction of searchable PDFs, complemented by a client-side Tesseract.js / Canvas OCR adapter (`src/lib/ocr/tesseract.ts`) for browser-rendered page images when server extraction yields sparse text.

#### Decision Outcome
Selected **Option 3 (Hybrid Server/Client Extraction)**.
The primary upload pipeline (`src/app/api/documents/upload/route.ts`) executes `pdf-parse` server-side in Node.js. If the character count is below threshold (< 50 characters across pages), the document intelligence UI flags the document as scanned and invokes the local browser OCR pipeline or provides synthetic scanned extraction fallbacks.

#### Consequences
* **Positive:** Zero native OS binary dependencies; fast execution for 95% of digital applications; works offline.
* **Negative:** Client-side OCR of multi-page high-resolution PDFs can consume substantial browser memory.
* **Mitigation:** Prototype restricts OCR extraction to the first 3 pages and defaults to pre-extracted synthetic profiles for large sample files.

---

### ADR-08: SHA-256 Cryptographic Fingerprinting for Integrity & Duplicate Detection

* **Status:** Accepted
* **Date:** 2026-10-24
* **Deciders:** Technical Architecture Team

#### Context & Problem Statement
Fraudulent institutions may attempt to reuse identical building floor plans, land title deeds, or fire safety certificates across multiple distinct applications or regional branches.

#### Decision Drivers
* Immediate, un-forgeable detection of duplicate submissions across the entire application registry.
* Document tamper verification and evidentiary integrity audit logging.

#### Considered Options
1. *File Name and Size Matching:* Trivial to bypass by renaming files.
2. *Visual Document Hashing (pHash):* Computationally expensive and prone to false positives with standard government letterheads.
3. *Cryptographic SHA-256 Digest Computation:* Generating a deterministic 256-bit hash of the raw document byte buffer upon ingestion.

#### Decision Outcome
Selected **Option 3 (SHA-256 Cryptographic Fingerprinting)**.
Every uploaded document is digested via Node.js `crypto.createHash('sha256')` in `src/app/api/documents/upload/route.ts`. The resulting 64-character hexadecimal digest is stored in `Document.fileHash`. Rule `RULE_008` in `src/lib/validation/engine.ts` scans the entire persistence store for collision across different application IDs, immediately raising a `CRITICAL` anomaly flag if a duplicate document is identified.

#### Consequences
* **Positive:** O(1) mathematical guarantee of identical file detection; tamper-evident proof in audit logs.
* **Negative:** Will not detect a document that was altered by even one byte (e.g., re-saved at a different DPI).
* **Mitigation:** Paired with institutional name similarity heuristics (Levenshtein token overlap in `RULE_005`) to catch altered duplicate submissions.
