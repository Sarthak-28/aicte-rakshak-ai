# AICTE Rakshak AI — System Architecture & Technical Documentation

> **Problem Statement:** "AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification"  
> **Agency:** All India Council for Technical Education (AICTE), Ministry of Education, Government of India  
> **Role & Purpose:** Decision-support prototype assisting authorized regulatory officers in preliminary validation, anomaly detection, document extraction, issuing-authority verification, and checklist compliance.  
> **Legal Disclaimer:** *This system is an advisory decision-support prototype. It does not make final regulatory decisions or claim official integration with AICTE production infrastructure.*

---

## Architecture Diagrams Index

The architecture diagrams in this directory have been generated and formally verified using the **Archify specification standard**. Each diagram renders as a standalone, zero-dependency interactive HTML canvas with semantic zoom, search, evidence citations, and dark/light mode toggles.

| Diagram | Specification | Interactive HTML Visualization | Focus Area |
| :--- | :--- | :--- | :--- |
| **1. System Architecture** | [`system-architecture.json`](./system-architecture.json) | [**`system-architecture.html`**](./system-architecture.html) | High-level system topology, presentation tier, Next.js server services, AI & OCR abstractions, rule engine, data persistence, and simulated external authorities. |
| **2. End-to-End Workflow** | [`application-workflow.json`](./application-workflow.json) | [**`application-workflow.html`**](./application-workflow.html) | Complete lifecycle across 6 phases: Submission, Ingestion & OCR, Rule Validation, Authority Verification, Reviewer Adjudication, and Audit/Reporting. |
| **3. Validation Engine Flow** | [`validation-engine.json`](./validation-engine.json) | [**`validation-engine.html`**](./validation-engine.html) | Strict architectural decoupling between deterministic rule execution (8 rules) and semantic AI extraction, with human-in-the-loop review guardrails. |
| **4. Data Model (ERD)** | [`data-model.json`](./data-model.json) | [**`data-model.html`**](./data-model.html) | Complete relational entity model spanning Core Institutional Domain, Document Evidence Domain, Regulatory Findings Domain, and Review/Audit Domain. |

---

## Accompanying Technical Specifications

* **[Implementation Inventory (`implementation-inventory.md`)](./implementation-inventory.md)**  
  Comprehensive catalog of all implemented components, partially implemented services, simulated integrations, and planned future modules with line-level source code references and third-party dependencies.

* **[Architecture Decision Records (`architecture-decisions.md`)](./architecture-decisions.md)**  
  Formal documentation of 8 critical architectural choices, including Next.js App Router consolidation, file-backed local persistence, AI heuristic fallbacks, deterministic rule separation, advisory guardrails, and cryptographic SHA-256 fingerprinting.

---

## How to View the Interactive Diagrams

All four generated `.html` files are self-contained single-page applications. They can be opened in any modern web browser without running a local web server:

### Direct File Open (Windows PowerShell)
```powershell
# Open System Architecture Diagram
Start-Process "docs\architecture\system-architecture.html"

# Open End-to-End Workflow Diagram
Start-Process "docs\architecture\application-workflow.html"

# Open Validation Engine Flow Diagram
Start-Process "docs\architecture\validation-engine.html"

# Open Data Model ERD Diagram
Start-Process "docs\architecture\data-model.html"
```

### Viewing with a Local Static Server
If you prefer serving over HTTP:
```powershell
# From the project root
npx serve docs/architecture
```
Then navigate to `http://localhost:3000/system-architecture.html`.

---

## System Architecture Summary

```
                      +------------------------------------------+
                      |         Officer Review Dashboard         |
                      |   (Next.js 14 App Router, Tailwind CSS)   |
                      +--------------------+---------------------+
                                           |
                   +-----------------------v-----------------------+
                   |          Next.js Route Handlers               |
                   |       (/api/applications, /api/documents)     |
                   +----+-------------------+------------------+---+
                        |                   |                  |
+-----------------------v---+  +------------v------------+  +--v------------------------+
| Server-Side PDF Engine    |  |  Deterministic Engine   |  | Simulated Verification    |
| pdf-parse & Client OCR    |  |  8 Objective Rules      |  | 4 Authority Adapters      |
| SHA-256 Fingerprinting    |  |  Severity & Evidence    |  | Watermarked Mock Responses|
+-----------------------+---+  +------------+------------+  +--+------------------------+
                        |                   |                  |
                   +----v-------------------v------------------v---+
                   |         Local JSON Store / Fallback           |
                   |      (.data/db.json / seed-data.ts)           |
                   |        PostgreSQL Adapter Ready               |
                   +-----------------------------------------------+
```

### Key Architectural Tenets
1. **Zero Unverifiable AI Claims:** LLMs are never permitted to make final approval or rejection determinations. All regulatory findings are produced by deterministic, explainable TypeScript rules.
2. **Offline Evaluator Guarantee:** The application runs out of the box with zero external cloud dependencies. If Google Gemini API keys are omitted, the system seamlessly activates local regex heuristics.
3. **Cryptographic Evidentiary Chain:** Document uploads are digested with SHA-256 upon arrival, preventing tamper and duplicate document submissions across institutional applications.
4. **Transparent Simulation:** External authority verifications are prominently watermarked as `DEMO SIMULATION`, providing realistic review flows without misrepresenting live government connectivity.

---

## Archify Verification Command Receipts

All diagram specifications conform strictly to the Archify schema and passed the four-gate verification suite:

```powershell
# 1. Spec Validation Gate
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" validate docs/architecture/system-architecture.json
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" validate docs/architecture/application-workflow.json
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" validate docs/architecture/validation-engine.json
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" validate docs/architecture/data-model.json

# 2. HTML Delivery Gate
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" deliver docs/architecture/system-architecture.json docs/architecture/system-architecture.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" deliver docs/architecture/application-workflow.json docs/architecture/application-workflow.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" deliver docs/architecture/validation-engine.json docs/architecture/validation-engine.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" deliver docs/architecture/data-model.json docs/architecture/data-model.html

# 3. Post-Delivery Consistency Check Gate
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" check docs/architecture/system-architecture.json docs/architecture/system-architecture.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" check docs/architecture/application-workflow.json docs/architecture/application-workflow.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" check docs/architecture/validation-engine.json docs/architecture/validation-engine.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" check docs/architecture/data-model.json docs/architecture/data-model.html

# 4. Headless Browser Check Gate (Zero Console Errors, DOM Ready)
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" browser-check docs/architecture/system-architecture.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" browser-check docs/architecture/application-workflow.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" browser-check docs/architecture/validation-engine.html
node "C:\Users\Tamanna sayyed\.agents\skills\archify\bin\archify.mjs" browser-check docs/architecture/data-model.html
```

All 4 diagrams exited with code 0 across all verification stages.
