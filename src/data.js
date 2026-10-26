import kaggleEvidence from './kaggle-evidence.json'

const verifiedKaggleBadges = kaggleEvidence.badges.filter((badge) => badge.status === 'awarded').map((badge) => badge.name)

// ─────────────────────────────────────────────────────────────────────────────
//  Content checked 2026-10-08 against the supplied resume, public GitHub PRs,
//  and live LeetCode, Kaggle, and Credly profiles.
//  Edit values here; the 3D + UI read from this single file.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  "name": "Ashwin Upadhyay",
  "brand": "ASHWIN",
  "role": "AI Systems & Backend Engineer",
  "location": "Pune, India",
  "phone": "+91 8329396282",
  "email": "ashwinupadhyay09@gmail.com",
  "links": {
    "github": "https://github.com/wtfashwin",
    "linkedin": "https://www.linkedin.com/in/upadhyayashwin/",
    "certifications": "https://www.linkedin.com/in/upadhyayashwin/details/certifications/",
    "leetcode": "https://leetcode.com/u/wtfashwin/",
    "kaggle": "https://www.kaggle.com/ashwinupadhyay",
    "geeksforgeeks": "https://www.geeksforgeeks.org/profile/wtfashwin",
    "credly": "https://www.credly.com/users/ashwin-upadhyay.d80bc5d2/badges/credly",
    "achievements": "https://github.com/wtfashwin/wtfashwin/blob/main/ACHIEVEMENTS.md",
    "oss": "https://github.com/wtfashwin/wtfashwin/blob/main/OPEN_SOURCE.md",
    "medium": "https://medium.com/@ashwinupadhyay",
    "hashnode": "https://hashnode.com/@wtfashwin",
    "paper": "https://www.tijer.org/paper/TIJER2505180"
  },
  "bio": "I build AI applications and the backend systems behind them: retrieval, secure APIs, data models, and reliable workflows."
}

export const profileLinks = [
  { label: 'GitHub', url: identity.links.github },
  { label: 'LinkedIn', url: identity.links.linkedin },
  { label: 'LeetCode', url: identity.links.leetcode },
  { label: 'Kaggle', url: identity.links.kaggle },
  { label: 'Credly', url: identity.links.credly },
  { label: 'GeeksforGeeks', url: identity.links.geeksforgeeks },
  { label: 'Medium', url: identity.links.medium },
]

// Section anchors used by nav + scroll. `at` = scroll offset 0..1 (8 scenes).
export const NAV = [
  { label: 'Home', id: 'hero' },
  { label: 'Work', id: 'work' },
  { label: 'Open source', id: 'proof' },
  { label: 'Achievements', id: 'credentials' },
  { label: 'Writing', id: 'writing' },
  { label: 'Profiles', id: 'profiles' },
  { label: 'Contact', id: 'contact' },
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
    "org": "Invoice Followup",
    "kind": "public-tool",
    "id": "invoice-followup",
    "when": "Independent project",
    "where": "Public validation prototype",
    "flagship": "A free invoice queue and editable payment reminders",
    "blurb": "Free browser tool",
    "points": [
      "Review invoices, prepare a reminder draft and import or export a CSV in the browser.",
      "No account or automatic sending. Optional browser saving is unencrypted; the tool does not verify payments."
    ],
    "tags": ["JavaScript", "CSV", "Browser storage"],
    "url": "https://github.com/wtfashwin/invoice-followup",
    "liveUrl": "https://invoice-followup.zany-hippo-3715.chatgpt.site/",
    "evidence": {
      "checkedAt": "2026-10-22",
      "sourceCommit": "3ac76427da6fd60fc2199a9b24f27f49a839b98b",
      "scope": "Public browser-local validation prototype. No paying users, collection improvement, traffic or rankings are established."
    }
  },
  {
    "role": "Creator",
    "org": "CSV Reporting Example",
    "kind": "public-example",
    "id": "csv-reporting-example",
    "when": "Independent example",
    "where": "Synthetic demonstration",
    "flagship": "A synthetic campaign report from two fictional CSV files",
    "blurb": "Synthetic reporting example",
    "points": [
      "Inspect six illustrative metrics, their formulas and a JSON calculation receipt generated from fictional CSV inputs.",
      "No upload or live connector. This example does not establish customer results or a production reporting service."
    ],
    "tags": ["Python", "CSV", "HTML", "Decimal"],
    "url": "https://github.com/wtfashwin/csv-report-pilot",
    "liveUrl": "https://wtfashwin.github.io/Portfolio/reporting-example/",
    "evidence": {
      "checkedAt": "2026-10-23",
      "sourceCommit": "86065ea65e7b2e55453281e36b6fe06aa9c8fc04",
      "scope": "Synthetic reporting example using fictional CSV inputs. No upload, live connector, customer results or production reporting service is established."
    }
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
    "url": "https://github.com/wtfashwin/Customer-Support-System",
    "evidence": {
      "checkedAt": "2026-10-27",
      "sourceCommit": "60f711e7d2bec62a0fcc9bf48515027965f071ef",
      "sourceUrl": "https://github.com/wtfashwin/Customer-Support-System/tree/60f711e7d2bec62a0fcc9bf48515027965f071ef",
      "verificationLinks": [
        { "label": "Merged database setup fix", "url": "https://github.com/wtfashwin/Customer-Support-System/pull/12" },
        { "label": "CI: builds, API checks and fresh database setup", "url": "https://github.com/wtfashwin/Customer-Support-System/actions/runs/38647008014" },
        { "label": "Python tests and dry fixture evaluation", "url": "https://github.com/wtfashwin/Customer-Support-System/actions/runs/38647007939" }
      ],
      "scope": "GitHub Actions passed on 14 Oct 2026: web/API builds and checks, fresh and repeated PostgreSQL 16 setup, Python tests, and dry fixture evaluation. Deployment, external-provider, authentication and live RAG paths remain unverified."
    }
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
    "url": "https://github.com/wtfashwin/ContextDock",
    "evidence": {
      "checkedAt": "2026-10-27",
      "sourceCommit": "f20c8fb871f1a89685ffc6e3222dcc14a9eec061",
      "sourceUrl": "https://github.com/wtfashwin/ContextDock/tree/f20c8fb871f1a89685ffc6e3222dcc14a9eec061",
      "verificationLinks": [
        { "label": "Swift package build and tests", "url": "https://github.com/wtfashwin/ContextDock/actions/runs/38643769670" }
      ],
      "scope": "GitHub Actions passed shell checks, package build and tests on 14 Oct 2026 at this pull-request commit. These checks do not establish native UI behavior, external CLI compatibility or end-user runtime outcomes."
    }
  },
  {
    "role": "Creator",
    "org": "Fraud Detection",
    "when": "Independent project",
    "where": "Public source",
    "flagship": "Credit-card feature scoring and asynchronous explanations",
    "blurb": "Public project",
    "points": [
      "FastAPI accepts 30 ordered features; Celery persists model explanations through Redis and PostgreSQL.",
      "Explicit pending, completed, failed, and duplicate-ID responses, plus readiness and bounded input-drift checks.",
      "Separate historical XGBoost benchmark reports ROC AUC 0.973709 on 56,962 held-out rows; the packaged demonstration model is a different artifact."
    ],
    "tags": [
      "FastAPI",
      "Celery",
      "Redis",
      "PostgreSQL",
      "XGBoost"
    ],
    "url": "https://github.com/wtfashwin/fraud-detection",
    "evidence": {
      "checkedAt": "2026-10-16",
      "sourceCommit": "4c7cd588c607bac7b47669ca51f711c4faec2417",
      "benchmarkUrl": "https://github.com/wtfashwin/fraud-detection/blob/4c7cd588c607bac7b47669ca51f711c4faec2417/docs/benchmark-results.md",
      "apiUrl": "https://github.com/wtfashwin/fraud-detection/blob/4c7cd588c607bac7b47669ca51f711c4faec2417/api/app.py",
      "scope": "Public implementation and a separate historical benchmark. Portfolio visualization is illustrative and makes no API requests."
    }
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
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Fusion AI Agent Studio Certified Foundations Associate · Rel 1",
    "when": "May 2026",
    "summary": "Foundations for building agents with Oracle Fusion AI Agent Studio.",
    "image": "/images/oracle-fusion-ai-agent-studio-badge.png",
    "url": "https://catalog-education.oracle.com/pls/certview/sharebadge?id=32E3D22C92D717455374A138EDB6F9D13FD05BC72298FBA0430F7B64E25A92C1"
  },
  {
    "group": "professional",
    "issuer": "Securiti AI",
    "mark": "SA",
    "items": "AI Security & Governance",
    "when": "Feb 2026",
    "summary": "Generative AI risk, compliance, and responsible governance frameworks.",
    "url": "https://education.securiti.ai/verification/1451D2717-1451D2586-13EEB4DC5/"
  },
  {
    "group": "professional",
    "issuer": "Saviynt",
    "mark": "SV",
    "items": "Identity Security for AI Age",
    "when": "Dec 2025",
    "summary": "Identity security concepts for systems shaped by AI.",
    "url": "https://www.linkedin.com/in/upadhyayashwin/overlay/Certifications/1941196376/treasury/?profileId=ACoAACoEXhsBoRSy1GtJ2ZRN8QPPUEeXhcKrgNU"
  },
  {
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate",
    "when": "Dec 2025",
    "summary": "Core artificial intelligence and machine learning concepts on OCI.",
    "url": "https://catalog-education.oracle.com/pls/certview/sharebadge?id=8A67E3A33AECF97AAEB719CB796CB04A057F8BDE066F19BF1C47CE965C9A6733"
  },
  {
    "group": "professional",
    "issuer": "Calyptus",
    "mark": "CA",
    "items": "AI Fluent Tech Professional",
    "when": "Nov 2025",
    "summary": "AI fluency credential issued by Calyptus.",
    "url": "https://certificate.calyptus.co/ai-fluency/14-ashwin-upadhyay"
  },
  {
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Oracle Cloud Infrastructure 2025 Certified Developer Professional",
    "when": "Oct 2025",
    "summary": "Developing and deploying applications with Oracle Cloud Infrastructure.",
    "url": "https://catalog-education.oracle.com/pls/certview/sharebadge?id=00D3CEA936F13F2D2905235F947DED4EA6503F96C7E69973D265C93E05AD3DC5"
  },
  {
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Oracle Cloud Infrastructure 2025 Certified Architect Associate",
    "when": "Oct 2025",
    "summary": "Oracle Cloud Infrastructure architecture and cloud design fundamentals.",
    "url": "https://catalog-education.oracle.com/ords/certview/sharebadge?id=B292D02B22DF5A1C895F880AA38DAE04CFECC912C094910A7609F4C7B8AD45CF"
  },
  {
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Oracle AI Vector Search Certified Professional",
    "when": "Oct 2025",
    "summary": "Vector indexing and semantic search in Oracle Database 23ai.",
    "url": "https://catalog-education.oracle.com/ords/certview/sharebadge?id=3185B297B63CFB0C026C0932DC7862BD722B907FC3332D6BDA2A5D96C927D306"
  },
  {
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Oracle Cloud Infrastructure 2025 Certified Data Science Professional",
    "when": "Oct 2025",
    "summary": "End-to-end cloud machine learning workflows and MLOps on OCI.",
    "url": "https://catalog-education.oracle.com/pls/certview/sharebadge?id=D9C78F28D89D65279F354EEE901A5B40788333EB0F3B9E5C2B36AE2DFF6599D1"
  },
  {
    "group": "professional",
    "issuer": "Oracle",
    "mark": "OR",
    "items": "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    "when": "Oct 2025",
    "summary": "Generative AI workloads, fine-tuning, and OCI services.",
    "url": "https://catalog-education.oracle.com/ords/certview/sharebadge?id=3C89FBEBDA81EC0D06C13927A10CA75773E4117F437F99B4B06AF7356D24CC99"
  },
  {
    "group": "professional",
    "issuer": "Astronomer",
    "mark": "AS",
    "items": "Astronomer Certification for Apache Airflow 3 Fundamentals",
    "when": "Oct 2025",
    "summary": "Core concepts for authoring and operating Apache Airflow workflows.",
    "url": "https://www.credly.com/badges/ef9a1b33-9899-46b7-b25e-5a2acb979e69/linked_in_profile"
  },
  {
    "group": "professional",
    "issuer": "Astronomer",
    "mark": "AS",
    "items": "Astronomer Certification DAG Authoring for Apache Airflow 3",
    "when": "Oct 2025",
    "summary": "Building and scheduling DAGs with Apache Airflow 3.",
    "url": "https://www.credly.com/badges/863162ef-ee67-4e23-b577-82a36d96ebfa/linked_in_profile"
  },
  {
    "group": "course",
    "issuer": "OpenAI Academy",
    "mark": "OA",
    "items": "AI Foundations",
    "when": "16 Oct 2026",
    "summary": "Course completion badge, earned with AI assistance. Expires 16 Apr 2027.",
    "url": "https://oaiacademy.credential.net/3bcda655-d5ca-418f-aac2-f17724f886ad"
  },
  {
    "group": "course",
    "issuer": "Claude Academy",
    "mark": "CL",
    "items": "Claude 101",
    "when": "16 Oct 2026",
    "summary": "Course completion badge, earned with AI assistance.",
    "url": "https://academy.claude.com/verify/be08d5b205c977103968365dbf95bbc6"
  },
  {
    "group": "course",
    "issuer": "Claude Academy",
    "mark": "CL",
    "items": "AI Fluency: Framework and foundations",
    "when": "16 Oct 2026",
    "summary": "Course completion badge, earned with AI assistance.",
    "url": "https://academy.claude.com/verify/fd3decdcc20f36553c9678198ae14dcf"
  },
  {
    "group": "course",
    "issuer": "Kaggle Learn",
    "mark": "KG",
    "items": "Intermediate Machine Learning",
    "when": "16 Oct 2026",
    "summary": "Course completion certificate, earned with AI assistance.",
    "url": "https://www.kaggle.com/learn/certification/ashwinupadhyay/intermediate-machine-learning"
  },
  {
    "group": "course",
    "issuer": "Databricks",
    "mark": "DB",
    "items": "Academy Accreditation - Generative AI Fundamentals",
    "when": "Oct 2025",
    "summary": "Generative AI concepts and workloads in the Databricks platform.",
    "url": "https://credentials.databricks.com/d0424f1c-b0e0-4b02-beef-5fbbb4c6d80e"
  },
  {
    "group": "course",
    "issuer": "Databricks",
    "mark": "DB",
    "items": "Academy Accreditation - AI Agent Fundamentals",
    "when": "Oct 2025",
    "summary": "Foundations for building AI agents with Databricks tools and patterns.",
    "url": "https://credentials.databricks.com/bd8fd17f-12f6-4f9b-8da0-4c68b628ed02"
  },
  {
    "group": "course",
    "issuer": "KodeKloud",
    "mark": "KK",
    "items": "Kubernetes for Absolute Beginners",
    "when": "Oct 2025",
    "summary": "Container orchestration, deployments, services, and cluster basics.",
    "url": "https://certificates.kodekloud.com/a22750a7-822e-449c-bcb9-6e048a98f5ca/2c52f2b1-b94a-467d-89da-a6317ba68b4f/fe7d88e3-8261-42c6-86ae-707143cda34f.pdf"
  },
  {
    "group": "course",
    "issuer": "KodeKloud",
    "mark": "KK",
    "items": "RAG Crash Course",
    "when": "Oct 2025",
    "summary": "Retrieval-augmented generation concepts and implementation basics.",
    "url": "https://certificates.kodekloud.com/81da9e5d-809c-466c-a3b0-614ce677b524/74039b22-3f2e-45bc-acc7-e2aefe8e63ba/89a6ef67-6aba-4d40-983d-67112d3ce2be.pdf"
  },
  {
    "group": "course",
    "issuer": "Udemy",
    "mark": "UD",
    "items": "JavaScript 2019: JavaScript ES6 Certification Course",
    "when": "Nov 2024",
    "summary": "JavaScript ES6 language features and modern JavaScript fundamentals.",
    "url": "https://udemy-certificate.s3.amazonaws.com/pdf/UC-b337ecb9-867b-48e8-b3b2-6800d07daf62.pdf"
  },
  {
    "group": "simulation",
    "issuer": "Forage",
    "mark": "AWS",
    "items": "AWS - Solutions Architecture Job Simulation",
    "when": "Jul 2025",
    "summary": "Designed scalable Elastic Beanstalk hosting and explained its cost model.",
    "url": "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/pmnMSL4QiQ9JCgE3W/kkE9HyeNcw6rwCRGw_pmnMSL4QiQ9JCgE3W_GbrwZJ7GpEHHpCD3m_1752581762033_completion_certificate.pdf"
  },
  {
    "group": "simulation",
    "issuer": "Forage",
    "mark": "LL",
    "items": "Lloyds Banking Group - Technology Engineering Job Simulation",
    "when": "Jul 2025",
    "summary": "Designed and presented a customer-focused mortgage calculator.",
    "url": "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Zbnc2o4ok6kD2NEXx/8AFfeg9k5udSCu6r5_Zbnc2o4ok6kD2NEXx_GbrwZJ7GpEHHpCD3m_1752586634915_completion_certificate.pdf"
  },
  {
    "group": "simulation",
    "issuer": "Forage",
    "mark": "DA",
    "items": "Deloitte Australia - Data Analytics Job Simulation",
    "when": "Jul 2025",
    "summary": "Analyzed data, built a Tableau dashboard, and used Excel to draw conclusions.",
    "url": "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_GbrwZJ7GpEHHpCD3m_1752579647907_completion_certificate.pdf"
  }
]

export const credentialGroups = [
  { id: 'professional', title: 'Professional certifications', items: certs.filter((cert) => cert.group === 'professional') },
  { id: 'course-simulation', title: 'Course certificates & job simulations', items: certs.filter((cert) => cert.group !== 'professional') },
]

export const achievements = [
  {
    "v": "923 problems",
    "l": "LeetCode: 155 hard, contest rating 1,752, and 32 badges.",
    "url": "https://leetcode.com/u/wtfashwin/"
  },
  {
    "v": `${verifiedKaggleBadges.length} Kaggle badges`,
    "l": "Badges across coding, competitions, notebooks, and datasets.",
    "url": identity.links.kaggle
  },
  {
    "v": "20 credentials",
    "l": "Oracle, Astronomer, Databricks, AI security, GenAI, and job simulations.",
    "cta": "View credentials ↓",
    "url": "#certifications-list"
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
    "note": "Clarify path sanitization and add traversal regression tests.",
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
    "h": "Tools I work with",
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
    "h": "Experience & projects",
    "sub": "Professional experience alongside public projects. Project cards link directly to source code."
  },
  "principles": {
    "kicker": "Engineering approach",
    "h": "Correctness, access, and recovery",
    "sub": "The questions I bring to implementation and review."
  },
  "proof": {
    "kicker": "Open source & achievements",
    "h": "Open-source contributions",
    "sub": "11 merged PRs across seven projects, covering memory use, calculation correctness, safer defaults, and compatibility."
  },
  "contact": {
    "kicker": "Contact",
    "h": "Get in touch",
    "sub": "Open to AI systems and backend engineering roles. B.E. Information Technology, SPPU, 8.53 CGPA."
  }
}

export const achievementGroups = [
  {
    "title": "Kaggle badges",
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
