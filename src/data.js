// ─────────────────────────────────────────────────────────────────────────────
//  ALL CONTENT — sourced from ASHWIN_Upadhyay_Resume, ashwin_strong_points.md,
//  WHAT_I_LEARNED_BUILDING_IRIS.md and linkedin.com/in/upadhyayashwin
//  Edit values here; the 3D + UI read from this single file.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  name: 'ASHWIN UPADHYAY',
  brand: 'ASHWIN',
  role: 'AI / ML Engineer',
  location: 'Pune, India',
  phone: '+91 8329396282',
  email: 'ashwinupadhyay09@gmail.com',
  links: {
    github: 'https://github.com/wtfashwin',
    linkedin: 'https://www.linkedin.com/in/upadhyayashwin/',
    leetcode: 'https://leetcode.com/u/wtfashwin/',
    kaggle: 'https://www.kaggle.com/wtfashwin',
    medium: 'https://medium.com/@ashwinupadhyay',
    paper: 'https://www.tijer.org/paper/TIJER2505180',
  },
  bio: 'AI/ML Engineer with 2+ years building production GenAI on async FastAPI, LangGraph and Kubernetes. I ship systems that survive real load — not prototypes.',
}

// Section anchors used by nav + scroll. `at` = scroll offset 0..1 (8 scenes).
export const NAV = [
  { label: 'Capabilities', at: 1 / 7 },
  { label: 'IRIS', at: 3 / 7 },
  { label: 'Work', at: 4 / 7 },
  { label: 'Contact', at: 1 },
]

// Per-scene brand word shown in the nav as you scroll (replica idiom).
export const BRAND_WORDS = [
  'ASHWIN', 'CAPABILITIES', 'THE CORE', 'IRIS',
  'WORK', 'PRINCIPLES', 'PROOF', 'CONNECT',
]

// ── Scene 3 — IRIS flagship metrics ─────────────────────────────────────────
export const irisStats = [
  { v: '44', u: 'routers', l: '400+ async REST endpoints across 11 Postgres schemas, multi-tenant DPSM SaaS.' },
  { v: '<500', u: 'ms p95', l: 'Sustained at 80-concurrency autoscale — on 1M+ classified records.' },
  { v: '+18', u: '% accuracy', l: '7-stage LangGraph PII pipeline: regex + Presidio + spaCy NER + Claude verify.' },
  { v: '12', u: 'connectors', l: 'PostgreSQL, MySQL, Oracle, MS SQL, Snowflake, Databricks, BigQuery, Spanner, SAP HANA, S3, Drive.' },
]

// ── Scene 4 — Experience pipeline (funnel) ──────────────────────────────────
export const experience = [
  {
    role: 'AI Engineer',
    org: 'Sylox',
    when: 'Sep 2025 — Present',
    where: 'India',
    flagship: 'IRIS · AI-Powered Data Security Posture Management',
    blurb: 'IRIS discovers and classifies PII across GDPR, HIPAA & DPDP workflows.',
    points: [
      'Shipped 44 FastAPI routers + 400+ async endpoints across 11 Postgres schemas — p95 < 500 ms at 80-concurrency autoscale.',
      'Designed a 7-stage LangGraph PII pipeline (30+ India-specific regex, Presidio, spaCy NER, Claude verify, analyst override) — +18% accuracy across 1M records.',
      'Built 12 cloud-source connectors and a universal access bridge writing 53K+ permissions into one governance surface.',
      'Owned CI/CD on GCP Cloud Build — 30-gate verification, 80–90% diff coverage, 161 idempotent Alembic migrations, blue/green with auto-rollback.',
      'Hardened with OAuth2/OIDC SSO, SCIM 2.0, per-endpoint RBAC, JWT + bcrypt, org-scoped queries and CI-enforced cross-tenant isolation.',
    ],
    tags: ['FastAPI', 'LangGraph', 'pgvector', 'GCP', 'Alembic', 'SCIM 2.0'],
  },
  {
    role: 'Builder',
    org: 'AI Privacy Verifier',
    when: '2026',
    where: 'Independent',
    flagship: 'Canary-trap auditing of AI-vendor privacy claims',
    blurb: 'Cryptographic evidence chains that prove unauthorized model training.',
    points: [
      'Provider-agnostic FastAPI across 7 LLM vendors with canary-trap injection, model fingerprinting and timestamped evidence packets.',
      'Sustained 40+ endpoints at 1,200+ RPS, p99 < 180 ms, while cutting LLM spend ~38%.',
      'RFC 3161 TSA + Sigstore/Rekor tamper-evident evidence chain; ~94% test coverage.',
      'Deployed on AKS with Helm + workload identity — cut PR-to-deploy from 45 to 9 minutes.',
    ],
    tags: ['7-vendor LLM', 'RFC 3161', 'Rekor', 'Celery', 'AKS'],
  },
  {
    role: 'Creator',
    org: 'Cerevra',
    when: 'Jun 2025 — Present',
    where: 'github.com/wtfashwin/cerevra',
    flagship: 'Zero-Data-Loss RAG Engine',
    blurb: 'Deterministic, WAL-durable, namespace-isolated RAG — no vectors required.',
    points: [
      'WAL-backed crash recovery with per-mutation fsync and deterministic replay; chaos-tested truncation recovery with zero data loss.',
      'BM25-first retrieval with context scoring + refusal gating — cuts hallucination without GPU dependence.',
      'BM25 p99 < 50 ms at 500+ qps; synthesis p99 < 200 ms at 250 qps; 10K-doc indexing under 5 s.',
      'Maintained 2,195 tests at 80% diff coverage with chaos / property / resilience suites + Prometheus, OTel & GDPR audit.',
    ],
    tags: ['RAG', 'WAL', 'BM25', 'Chaos-tested', '2,195 tests'],
  },
  {
    role: 'Lead Author',
    org: 'SHAR',
    when: 'Jan 2024 — May 2024',
    where: 'Pune · TIJER 2025',
    flagship: 'Suspicious Activity Recognition (Vision Transformer)',
    blurb: 'Peer-reviewed real-time suspicious-activity detection system.',
    points: [
      'Fine-tuned a Vision Transformer on UCF-Crime & KTH — 92% accuracy, 92% F1 at 100 ms/frame.',
      'Real-time WebSocket + email/SMS alerting with 95% manual-audit alert precision.',
      'Usability survey of 50 users: 90% rated it "very easy to use", 85% satisfied with reliability.',
    ],
    tags: ['ViT', 'PyTorch', 'WebSocket', 'Published'],
  },
]

// ── Scene 5 — Engineering principles (DNA) ──────────────────────────────────
// Distilled from WHAT_I_LEARNED_BUILDING_IRIS hard-won principles.
export const principles = [
  { k: 'Idempotency is engineered', v: '“IF NOT EXISTS” is the floor. Real idempotency reflects live DB state via the Inspector — CI on fresh Postgres is the only honest test.' },
  { k: 'A red test is a question', v: 'Read production code before touching a test. I triaged 214 failures in one sweep — and caught a real $batch bug hiding in stale-test noise.' },
  { k: 'Honesty over optimism', v: 'I shipped an audit that downgraded 26 of my own “available” connectors to “planned”. Naming the gap is the first half of closing it.' },
  { k: 'Reason explicitly about concurrency', v: 'Lock the one shared step, fan out the rest. A race-free single-flight token refresh held under 50-thread load.' },
  { k: 'Externalize every constant', v: 'Provider URLs, ensemble weights, rate quotas live in YAML — accuracy and connectors ship without a redeploy.' },
  { k: 'Scale the org chart, not the hours', v: 'Built PSYLOC — a 14-stage, gated, agent-dispatched system that produces features under the same governance I designed.' },
]

// ── Scene 6 — Certifications + achievements (starfield constellation) ───────
export const certs = [
  { issuer: 'Oracle OCI', items: 'Generative AI Professional · AI Vector Search Pro · Data Science Pro · Architect Associate' },
  { issuer: 'Databricks', items: 'Developer Pro · GenAI Fundamentals · AI Agent Fundamentals' },
  { issuer: 'Astronomer', items: 'Apache Airflow 3 — Fundamentals + DAG Authoring' },
  { issuer: 'KodeKloud', items: 'Kubernetes · RAG Crash Course' },
  { issuer: 'Calyptus', items: 'AI Fluent Tech Professional — Top 5% globally' },
  { issuer: 'Securiti / Saviynt', items: 'AI Security & Governance · Identity Security for the AI Age' },
]

export const achievements = [
  { v: 'Top 10%', l: 'LeetCode — 500+ problems, 500-day streak, Annual Badge 2025, 75 Hard' },
  { v: '500 days', l: 'Kaggle streak · Annual Medal 2025' },
  { v: '4× badges', l: 'GitHub — Pull Shark ×2, Pair Extraordinaire, YOLO, Quickdraw' },
  { v: 'Published', l: 'Lead author, Vision Transformer paper (TIJER, 2025) + 2 Medium articles' },
]

// ── Open-source contributions — meaningful, merged, across the ecosystem ─────
// Real PRs/issues into notable AI, security, data & infra projects.
export const openSource = [
  {
    repo: 'langfuse/langfuse-python',
    num: '#1664',
    title: 'fix(deps): support wrapt 2.x',
    note: 'Unblocked the LLM-observability SDK on wrapt 2.x — closes #1561.',
    domain: 'LLM Observability',
    url: 'https://github.com/langfuse/langfuse-python/pull/1664',
  },
  {
    repo: 'dlt-hub/dlt',
    num: '#3947',
    title: 'fix(mssql): ingest parquet row-groups individually to bound ADBC memory',
    note: 'Found the OOM (#3915), then fixed it — parquet→MSSQL loads now memory-bounded.',
    domain: 'Data Loading',
    url: 'https://github.com/dlt-hub/dlt/pull/3947',
  },
  {
    repo: 'VictoriaMetrics/VictoriaMetrics',
    num: '#10974',
    title: 'promql: stop integrate() extrapolating past series end',
    note: 'Correctness fix in the query engine of a major time-series database.',
    domain: 'Observability / TSDB',
    url: 'https://github.com/VictoriaMetrics/VictoriaMetrics/pull/10974',
  },
  {
    repo: 'unslothai/unsloth',
    num: '#5651',
    title: 'studio/chat: hide non-matching threads in chat search',
    note: 'UX fix in the popular LLM fine-tuning toolkit — closes #5572.',
    domain: 'LLM Fine-tuning',
    url: 'https://github.com/unslothai/unsloth/pull/5651',
  },
  {
    repo: 'TracecatHQ/tracecat',
    num: '#2715',
    title: 'feat(elastic_security): _source field filter for list_detection_signals',
    note: 'Added a real capability to a security-automation platform.',
    domain: 'Security Automation',
    url: 'https://github.com/TracecatHQ/tracecat/pull/2715',
  },
]

// ── Skills (used in Capabilities scene chips) ───────────────────────────────
export const skills = {
  'GenAI / LLM': ['LangGraph', 'LangChain', 'LlamaIndex', 'Claude Agent SDK', 'OpenAI SDK', 'Azure OpenAI', 'AWS Bedrock', 'Presidio', 'RAG'],
  'ML / DL': ['Vision Transformer', 'CNN', 'RNN / LSTM', 'Transformers', 'PyTorch', 'TensorFlow', 'scikit-learn'],
  'Backend': ['Python 3.12', 'FastAPI', 'Pydantic v2', 'Celery', 'SQLAlchemy 2.0', 'asyncpg', 'Alembic'],
  'Cloud / DevOps': ['Kubernetes (AKS/EKS/GKE)', 'Docker', 'Helm', 'Terraform', 'Azure', 'AWS', 'GCP', 'Airflow 3'],
  'Data': ['PostgreSQL', 'pgvector', 'Snowflake', 'BigQuery', 'Databricks', 'Cloud Spanner', 'MongoDB'],
  'Security': ['OAuth 2.0', 'OIDC SSO', 'SCIM 2.0', 'JWT', 'RBAC', 'RFC 3161', 'Workload Identity'],
}

// ── Scene copy (headlines mirror the reference flow, content is real) ────────
export const scenes = {
  hero: {
    kicker: '01 — The Pull of Results',
    h: 'Everything I build revolves around one thing — real impact',
    sub: 'Production GenAI engineer — RAG, agentic LangGraph pipelines and async FastAPI at scale. I ship systems that survive real load, not slideware.',
  },
  capabilities: {
    kicker: '02 — A Universe of Capabilities',
    h: 'A universe of capabilities — already in production',
    sub: 'Not one tool, but a living system: multi-tenant SaaS, agentic pipelines and hybrid vector search, all orbiting one goal — AI that holds up under real load.',
  },
  core: {
    kicker: '03 — The Core',
    h: 'Every system pulled toward one focused point: production',
    sub: 'I learned to engineer the things around the code — the migrations, the CI, the gates — as carefully as the code itself.',
  },
  iris: {
    kicker: '04 — Flagship',
    h: 'IRIS — Data Security Posture Management, at scale',
    sub: 'An AI-powered DPSM platform discovering and classifying PII across GDPR, HIPAA and DPDP — shipped, gated and observable.',
  },
  work: {
    kicker: '05 — The Work',
    h: 'Four systems. Shipped under load.',
    sub: 'From a peer-reviewed Vision Transformer to a zero-data-loss RAG engine and a 7-vendor privacy auditor.',
  },
  principles: {
    kicker: '06 — Principles',
    h: 'Hard-won principles, earned in red CI',
    sub: 'Across 383 commits and two production codebases — what I learned to trust, and what I learned to distrust.',
  },
  proof: {
    kicker: '07 — Open Source & Proof',
    h: 'I ship into other people’s codebases too',
    sub: 'Meaningful, merged contributions across Langfuse, dlt, VictoriaMetrics, Unsloth & Tracecat — plus certifications, rankings, and a test obsession.',
  },
  contact: {
    kicker: '08 — Connect',
    h: "Let's build something that survives production",
    sub: 'Open to AI/ML Engineer, GenAI Engineer and Backend AI Platform roles. B.E. Information Technology · SPPU · 8.53 CGPA.',
  },
}
