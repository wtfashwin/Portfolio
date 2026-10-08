import kaggleEvidence from './kaggle-evidence.json'

const verifiedKaggleBadges = kaggleEvidence.badges.filter((badge) => badge.status === 'awarded').map((badge) => badge.name)

// ─────────────────────────────────────────────────────────────────────────────
//  Content checked 2026-10-08 against the supplied resume, public GitHub PRs,
//  and live LeetCode, Kaggle, and Credly profiles.
//  Edit values here; the 3D + UI read from this single file.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  "name": "ASHWIN UPADHYAY",
  "brand": "ASHWIN",
  "role": "AI Systems & Backend Engineer",
  "location": "Pune, India",
  "phone": "+91 8329396282",
  "email": "ashwinupadhyay09@gmail.com",
  "links": {
    "github": "https://github.com/wtfashwin",
    "linkedin": "https://www.linkedin.com/in/wtfashwin/",
    "leetcode": "https://leetcode.com/u/wtfashwin/",
    "kaggle": "https://www.kaggle.com/ashwinupadhyay",
    "credly": "https://www.credly.com/users/ashwin-upadhyay.d80bc5d2/badges/credly",
    "achievements": "https://github.com/wtfashwin/wtfashwin/blob/main/ACHIEVEMENTS.md",
    "oss": "https://github.com/wtfashwin/wtfashwin/blob/main/OPEN_SOURCE.md",
    "medium": "https://medium.com/@ashwinupadhyay",
    "paper": "https://www.tijer.org/paper/TIJER2505180"
  },
  "bio": "I build AI applications and the backend systems behind them: retrieval, secure APIs, data models, and reliable workflows."
}

// Section anchors used by nav + scroll. `at` = scroll offset 0..1 (8 scenes).
export const NAV = [
  {
    "label": "Work",
    "id": "work",
    "at": 0.5714285714285714
  },
  {
    "label": "Contributions",
    "id": "proof",
    "at": 0.8571428571428571
  },
  {
    "label": "Credentials",
    "id": "credentials",
    "at": 0.8571428571428571
  },
  {
    "label": "Kaggle",
    "id": "kaggle-heading"
  },
  {
    "label": "Contact",
    "id": "contact",
    "at": 1
  }
]

// Per-scene brand word shown in the nav as you scroll (replica idiom).
export const BRAND_WORDS = [
  'ASHWIN', 'CAPABILITIES', 'VELOCITY', 'IRIS',
  'WORK', 'PRINCIPLES', 'PROOF', 'CONNECT',
]

// ── Scene 3, IRIS flagship metrics (verified via contributor graph & repo) ─
export const irisStats = [
  {
    "v": "Classification",
    "u": "Sensitive data",
    "l": "Regex, Presidio NER, checksum validation, context signals, and human review."
  },
  {
    "v": "APIs & data",
    "u": "Application delivery",
    "l": "FastAPI, React/TypeScript, PostgreSQL data modeling, and Alembic migrations."
  },
  {
    "v": "Access controls",
    "u": "Integrations",
    "l": "Microsoft 365 and Google Workspace integrations with encrypted credentials and tenant-aware authorization."
  },
  {
    "v": "System design",
    "u": "Proposed architecture",
    "l": "Customer-hosted scanning, resumable jobs, source lineage, and evidence storage. Professional work summaries; employer code is private."
  }
]

// ── Velocity, agent-leverage proof (all verified) ──────────────────────────
export const velocity = [
  {
    "v": "Retrieval",
    "l": "Ingestion, embeddings, hybrid search, reranking, and grounded answers."
  },
  {
    "v": "Backend",
    "l": "Python APIs, PostgreSQL data models, asynchronous jobs, and migrations."
  },
  {
    "v": "Authorization",
    "l": "Scoped access, encrypted credentials, read-only validation, and audit trails."
  },
  {
    "v": "Verification",
    "l": "Regression tests, integration checks, request tracing, and CI gates."
  }
]

// ── Scene 4, Experience pipeline (funnel) ──────────────────────────────────
export const experience = [
  {
    "role": "Founding AI Engineer",
    "org": "Sylox",
    "when": "Feb 2026 to Present",
    "where": "India",
    "flagship": "Data privacy and AI backend platforms",
    "blurb": "Professional experience",
    "points": [
      "Owned IRIS feature delivery across FastAPI, React/TypeScript, and PostgreSQL, from requirements through review and release.",
      "Rebuilt sensitive-data classification and repaired tests, migrations, and authentication failures.",
      "Built secure integrations and provider-agnostic AI verification services; proposed customer-hosted scanning architecture."
    ],
    "tags": [
      "FastAPI",
      "PostgreSQL",
      "React",
      "Data privacy"
    ]
  },
  {
    "role": "AI Engineer · Contract",
    "org": "LOPhils Inc.",
    "when": "Oct to Nov 2025",
    "where": "Contract",
    "flagship": "Legal-document RAG assistant",
    "blurb": "Professional experience",
    "points": [
      "Built ingestion, embeddings, metadata isolation, hybrid retrieval, reranking, and grounded answers.",
      "Developed asynchronous ingestion, search, and chat APIs with retries, caching, and retrieval checks."
    ],
    "tags": [
      "FastAPI",
      "LangChain",
      "Pinecone",
      "RAG"
    ]
  },
  {
    "role": "Creator",
    "org": "Customer Support System",
    "when": "Independent project",
    "where": "Public source",
    "flagship": "AI support workflows and retrieval",
    "blurb": "Public project",
    "points": [
      "FastAPI AI service with retrieval and LangGraph tool workflows, alongside a TypeScript application.",
      "Streaming responses, authorization forwarding, request correlation, and readiness checks.",
      "Public implementation and review history available on GitHub."
    ],
    "tags": [
      "LangGraph",
      "FastAPI",
      "TypeScript"
    ],
    "url": "https://github.com/wtfashwin/Customer-Support-System"
  },
  {
    "role": "Creator",
    "org": "Context Dock",
    "when": "Independent project",
    "where": "Public source",
    "flagship": "Native macOS developer tool",
    "blurb": "Public project",
    "points": [
      "Swift, SwiftUI, and AppKit interface for capturing task ideas and matching project context.",
      "Local agent events, decision journaling, and atomic note writes.",
      "Public source and setup instructions available on GitHub."
    ],
    "tags": [
      "Swift",
      "SwiftUI",
      "macOS"
    ],
    "url": "https://github.com/wtfashwin/ContextDock"
  }
]

// ── Scene 5, Engineering principles (DNA) ──────────────────────────────────
// Distilled from WHAT_I_LEARNED_BUILDING_IRIS hard-won principles.
export const principles = [
  {
    "k": "Make failures visible",
    "v": "A timeout, authorization denial, and empty result need different handling. Avoid false success."
  },
  {
    "k": "Test the real boundary",
    "v": "Check database migrations on a fresh database and verify results through the API."
  },
  {
    "k": "Keep access explicit",
    "v": "Bind operations to the user, tenant, source, and destination they are authorized to use."
  },
  {
    "k": "Design for retries",
    "v": "A repeated request should preserve correctness. Recovery is part of the design."
  },
  {
    "k": "Measure before claiming",
    "v": "Keep a prototype, a passing test, and a deployed result distinct. State what the evidence proves."
  },
  {
    "k": "Own the whole change",
    "v": "Connect requirements, data models, implementation, review, and verification."
  }
]

// ── Scene 6, Certifications + achievements (starfield constellation) ───────
export const certs = [
  {
    "issuer": "Astronomer",
    "items": "Apache Airflow 3 Fundamentals",
    "url": "https://www.credly.com/badges/ef9a1b33-9899-46b7-b25e-5a2acb979e69"
  },
  {
    "issuer": "Astronomer",
    "items": "DAG Authoring for Apache Airflow 3",
    "url": "https://www.credly.com/badges/863162ef-ee67-4e23-b577-82a36d96ebfa"
  }
]

export const achievements = [
  {
    "v": "923 problems",
    "l": "LeetCode: 155 hard, contest rating 1,752, and 32 badges.",
    "url": "https://leetcode.com/u/wtfashwin/"
  },
  {
    "v": "ML experiments",
    "l": `Kaggle: measured ML experiments, a public benchmark dataset, and ${verifiedKaggleBadges.length} confirmed badges.`,
    "url": "https://www.kaggle.com/ashwinupadhyay"
  },
  {
    "v": "2 verified credentials",
    "l": "Astronomer: Airflow 3 Fundamentals and DAG Authoring, verified through Credly.",
    "url": "https://www.credly.com/users/ashwin-upadhyay.d80bc5d2/badges/credly"
  }
]

// ── Open-source contributions, meaningful, merged, across the ecosystem ─────
// Real PRs/issues into notable AI, security, data & infra projects.
export const openSource = [
  {
    "repo": "PrefectHQ/prefect",
    "num": "#22035",
    "title": "Fix Azure blob result storage to overwrite on rewrite (#19411)",
    "note": "Allow cached task results in Azure Blob Storage to be overwritten on reruns.",
    "domain": "Reliable storage",
    "url": "https://github.com/PrefectHQ/prefect/pull/22035"
  },
  {
    "repo": "dlt-hub/dlt",
    "num": "#3947",
    "title": "fix(mssql): ingest parquet row-groups individually to bound ADBC driver   memory",
    "note": "Load Parquet row groups individually to limit SQL Server ingestion memory.",
    "domain": "Bounded memory",
    "url": "https://github.com/dlt-hub/dlt/pull/3947"
  },
  {
    "repo": "VictoriaMetrics/VictoriaMetrics",
    "num": "#10974",
    "title": "app/vmselect/promql: stop integrate() from extrapolating past series end",
    "note": "Stop integrate() from adding data beyond the end of a metric series.",
    "domain": "Correct calculations",
    "url": "https://github.com/VictoriaMetrics/VictoriaMetrics/pull/10974"
  },
  {
    "repo": "unslothai/unsloth",
    "num": "#5551",
    "title": "studio/chat: release stuck IME flag when compositionend never fires",
    "note": "Release a stuck IME typing state so users can send their messages.",
    "domain": "Input handling",
    "url": "https://github.com/unslothai/unsloth/pull/5551"
  },
  {
    "repo": "langfuse/langfuse-python",
    "num": "#1664",
    "title": "fix(deps): support wrapt 2.x (closes #1561)",
    "note": "Support installation with wrapt 2.x.",
    "domain": "Compatibility",
    "url": "https://github.com/langfuse/langfuse-python/pull/1664"
  },
  {
    "repo": "TracecatHQ/tracecat",
    "num": "#2715",
    "title": "feat(elastic_security): add _source field filter to list_detection_signals",
    "note": "Request only the Elastic alert fields a workflow needs.",
    "domain": "Security workflows",
    "url": "https://github.com/TracecatHQ/tracecat/pull/2715"
  },
  {
    "repo": "ParisNeo/lollms-webui",
    "num": "#690",
    "title": "security: harden sanitize_path regex against #641 traversal class + regression tests",
    "note": "Harden path sanitization with traversal regression tests.",
    "domain": "Path safety",
    "url": "https://github.com/ParisNeo/lollms-webui/pull/690"
  }
]

// ── Skills (used in Capabilities scene chips) ───────────────────────────────
export const skills = {
  "AI applications": [
    "RAG",
    "LangGraph",
    "LangChain",
    "Embeddings",
    "Reranking",
    "Retrieval evaluation"
  ],
  "Backend": [
    "Python",
    "FastAPI",
    "SQLAlchemy",
    "Celery",
    "Redis",
    "REST APIs"
  ],
  "Data": [
    "SQL",
    "PostgreSQL",
    "Alembic",
    "Parquet",
    "Data modeling"
  ],
  "Applications": [
    "React",
    "TypeScript",
    "Swift",
    "SwiftUI"
  ],
  "Delivery": [
    "Docker",
    "GitHub Actions",
    "pytest",
    "OpenTelemetry"
  ],
  "Security": [
    "RBAC",
    "OAuth / JWT",
    "Tenant isolation",
    "Credential encryption",
    "Mutation auditing"
  ]
}

// ── Scene copy (headlines mirror the reference flow, content is real) ────────
export const scenes = {
  "hero": {
    "kicker": "AI systems & backend engineering",
    "h": "Ashwin Upadhyay",
    "sub": "I build AI applications and the backend systems behind them: retrieval, secure APIs, data models, and reliable workflows. Founding AI Engineer at Sylox."
  },
  "capabilities": {
    "kicker": "Capabilities",
    "h": "From model output to a working application",
    "sub": "Python services, retrieval, application interfaces, and the data and access controls that connect them."
  },
  "core": {
    "kicker": "Engineering focus",
    "h": "What I build",
    "sub": "AI applications need more than a model. My work covers the services, data, controls, and checks around it."
  },
  "iris": {
    "kicker": "Professional work",
    "h": "IRIS: sensitive-data discovery and classification",
    "sub": "At Sylox, I work across application delivery, classification, secure integrations, and system design."
  },
  "work": {
    "kicker": "Experience & projects",
    "h": "Work you can understand and inspect",
    "sub": "Professional experience alongside public projects. Project cards link directly to source code."
  },
  "principles": {
    "kicker": "Engineering approach",
    "h": "Correctness, access, and recovery",
    "sub": "The questions I bring to implementation and review."
  },
  "proof": {
    "kicker": "Open source & achievements",
    "h": "Fixes accepted by upstream maintainers",
    "sub": "11 merged PRs across seven projects. Selected fixes below cover memory use, calculation correctness, safer defaults, and compatibility."
  },
  "contact": {
    "kicker": "Contact",
    "h": "Let’s build reliable AI systems",
    "sub": "Open to AI systems and backend engineering roles. B.E. Information Technology, SPPU, 8.53 CGPA."
  }
}

export const achievementGroups = [
  {
    "title": `Kaggle · ${verifiedKaggleBadges.length} confirmed badges`,
    "items": verifiedKaggleBadges
  },
  {
    "title": "LeetCode · 32 earned badges",
    "items": [
      "500 Days Badge — awarded 2026-02-05",
      "365 Days Badge — awarded 2025-09-17",
      "200 Days Badge 2026 — awarded 2026-08-09",
      "100 Days Badge 2026 — awarded 2026-04-22",
      "50 Days Badge 2026 — awarded 2026-02-21",
      "Annual Badge 2025 — awarded 2025-11-08",
      "200 Days Badge 2025 — awarded 2025-07-30",
      "100 Days Badge 2025 — awarded 2025-04-19",
      "50 Days Badge 2025 — awarded 2025-02-26",
      "100 Days Badge 2024 — awarded 2024-12-13",
      "50 Days Badge 2024 — awarded 2024-10-18",
      "Jun Badge — awarded 2026-09-14",
      "Aug Badge — awarded 2026-09-14",
      "Jul Badge — awarded 2026-07-31",
      "Feb Badge — awarded 2026-02-28",
      "Nov Badge — awarded 2025-11-30",
      "Oct Badge — awarded 2025-10-31",
      "Sep Badge — awarded 2025-09-30",
      "Aug Badge — awarded 2025-09-01",
      "Jan Badge — awarded 2025-09-01",
      "Dec Badge — awarded 2025-09-01",
      "Jul Badge — awarded 2025-07-31",
      "Feb Badge — awarded 2025-07-01",
      "Mar Badge — awarded 2025-07-01",
      "Jun Badge — awarded 2025-06-30",
      "Apr Badge — awarded 2025-06-07",
      "May Badge — awarded 2025-06-07",
      "Nov Badge — awarded 2024-11-30",
      "Oct Badge — awarded 2024-10-31",
      "LeetCode 75 — awarded 2024-11-05",
      "Introduction to Pandas — awarded 2024-10-06",
      "Top SQL 50 — awarded 2024-09-29"
    ]
  }
]
