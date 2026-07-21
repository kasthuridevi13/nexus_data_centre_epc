# NEXUS — AI Intelligence Platform for Data Centre EPC Project Delivery

Built for: **Theme 4 — AI Intelligence Platform for Data Centre EPC Project Delivery**

## The core idea

Most teams building this brief will ship 5 separate agent demos. NEXUS is built around one
architectural bet instead: **all 5 agents read and write from a single shared project
intelligence layer**, not 5 silos.

- Every spec, submittal, RFI, and change order is ingested **once** into a shared
  chunk + retrieval index (`DocumentChunk`).
- The **Compliance Agent** and the **RFI Copilot** both query that same index — a
  compliance finding can be traced to the exact clause, and an RFI answer can cite it.
- The **Schedule Risk Engine** doesn't run in isolation — it pulls live signals from the
  Compliance Agent (open deviations) and the Supply Chain Agent (delayed equipment) to
  compute per-activity risk. That's the "multi-agent system" the brief asks for,
  implemented as cross-agent signal aggregation rather than isolated dashboards.
- A compliance **deviation auto-drafts an RFI**, closing the loop the brief describes
  (deviation → risk → RFI → resolution) instead of leaving it as a static report.
- Every AI decision across all 5 agents writes to an **Audit Trail** with the evidence
  it used — because Tier III/IV commissioning sign-off requires exactly that kind of
  record, not just a chat log.

## Architecture

```
epc-ai-platform/
├── backend/                 Node.js + Express + MongoDB (Mongoose)
│   └── src/
│       ├── models/          Document, DocumentChunk, ComplianceCheck, ScheduleRisk,
│       │                    SupplyChainItem, CommissioningChecklist, RFI, AuditLog
│       ├── services/
│       │   ├── rag/         ragService.js — shared ingestion + retrieval (TF-weighted
│       │   │                cosine similarity, no external embedding API required)
│       │   ├── complianceService.js      DWG-01 agent
│       │   ├── scheduleRiskService.js    DWG-02 agent (cross-agent signal aggregation)
│       │   ├── supplyChainService.js     DWG-03 agent
│       │   ├── commissioningService.js   DWG-04 agent
│       │   ├── rfiService.js             DWG-05 agent (RAG chat + dedup detection)
│       │   ├── claudeClient.js           single shared Anthropic API wrapper
│       │   └── auditService.js           writes every agent decision to AuditLog
│       ├── controllers/, routes/         REST API (see below)
│       └── data/seed.js                  demo data incl. a deliberate spec/submittal
│                                          mismatch for the Compliance Agent to catch
└── frontend/                 React (Vite) + Tailwind
    └── src/
        ├── pages/            one page per agent (DWG-00 through DWG-06)
        ├── components/       Sidebar, TitleBlock (construction-drawing-style header),
        │                     RiskBadge, StatCard
        └── services/api.js   typed API client
```

### Design language
The UI borrows from construction-drawing conventions on purpose: each page has a
**title block** (sheet number, module name, revision) like an actual drawing sheet, and
the sidebar reads like a drawing index (DWG-00 … DWG-06). Dark "blueprint" palette,
monospace for all technical data (clause refs, IDs, timestamps).

## Why TF-weighted retrieval instead of an embeddings API

To keep this runnable with **zero external API keys beyond your Anthropic key**, the RAG
layer (`ragService.js` + `utils/similarity.js`) uses term-frequency vectors and cosine
similarity instead of calling an embeddings endpoint. It's a legitimate, explainable
retrieval method and is enough to demo real clause-level matching. For production, swap
`buildTermVector` for a real embedding call (OpenAI `text-embedding-3-small`, Voyage, or
Claude + a vector DB like Pinecone/pgvector) — the rest of the pipeline doesn't change.

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI (local mongod or Atlas) and ANTHROPIC_API_KEY
npm install
npm run seed     # loads demo documents, schedule activities, supply chain items, checklists
npm run dev       # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

## Demo script (for judges)

1. **Command Deck** — show the unified stats pulled from all 5 agents at once.
2. **Compliance Agent** — run a check on the seeded "PowerGuard PG-800E UPS Submittal."
   It's deliberately non-compliant against Section 26.30 (N+1 vs required 2N redundancy,
   10 min vs 12 min runtime, 95.2% vs 96% efficiency, reduced test coverage) — the agent
   should flag it as a **deviation** with clause-level citations, and auto-open an RFI.
3. **RFI Copilot** — see the auto-generated RFI, and ask a free-text question like
   *"What is the required UPS battery runtime?"* — watch it cite Section 26.30 directly.
4. **Schedule Risk Engine** — click "Recompute" and show the UPS install activity's risk
   score rising because of the linked deviation — this is the cross-agent signal in action.
5. **Supply Chain** — show the switchgear shipment flagged "delayed," and note it's the
   same signal type the Schedule Risk Engine also consumes.
6. **Commissioning QA** — fail a test item, show the AI-generated flagged-issue narrative
   referencing the acceptance standard.
7. **Audit Trail** — show every one of the above actions logged with its evidence — the
   artifact an auditor or Tier III certifier would actually want.

## Extending for the next round

- Swap TF-vector retrieval for real embeddings + a vector DB for larger document corpora.
- Add authentication/roles (GC, subcontractor, owner's rep) and per-role views.
- Replace mock lat/lng supply chain tracking with a real freight-tracking API integration.
- Add a true CPM (critical path method) engine instead of the current heuristic scorer.
- Add real file storage (S3) instead of storing extracted text only.
