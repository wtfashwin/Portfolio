// ─────────────────────────────────────────────────────────────────────────────
//  ALL CONTENT, sourced from ASHWIN_Upadhyay_Resume, ashwin_strong_points.md,
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
  bio: 'AI/ML Engineer building production GenAI on async FastAPI, LangGraph and Kubernetes. I ship systems that survive real load, not prototypes.',
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
  'ASHWIN', 'CAPABILITIES', 'VELOCITY', 'IRIS',
  'WORK', 'PRINCIPLES', 'PROOF', 'CONNECT',
]

// ── Scene 3, IRIS flagship metrics (verified via contributor graph & repo) ─
export const irisStats = [
  { v: '1,087', u: 'commits', l: '#1 contributor of 10, 27% of all commits, 4× the next engineer, Feb–Jul 2026.' },
  { v: '42', u: 'of last 100 PRs', l: 'Feature ownership: access governance, risk assessment, purpose tracking (22/22 slices), Shadow-IT discovery.' },
  { v: '3', u: 'languages at scale', l: 'Python, TypeScript and PLpgSQL across backend, frontend and database layers of an 87 MB codebase.' },
  { v: '3', u: 'CI pipelines', l: 'ci, nightly-integration and blue/green prod deploys on GCP Cloud Build, plus pre-commit, ruff, coverage gates.' },
]

// ── Velocity, agent-leverage proof (all verified) ──────────────────────────
export const velocity = [
  { v: '1,678', l: 'commits across five production codebases in 2026, under one work identity.' },
  { v: '8', l: 'OSS PRs merged into external projects totaling ~120,000 combined stars.' },
  { v: '189/189', l: 'sole-author commits on a production system shipped in three weeks.' },
  { v: '14-stage', l: 'gated, agent-dispatched pipeline (PSYLOC) I designed, features ship under its governance.' },
]

// ── Scene 4, Experience pipeline (funnel) ──────────────────────────────────
export const experience = [
  {
    role: 'AI Engineer',
    org: 'Sylox',
    when: 'Sep 2025 to Present',
    where: 'India',
    flagship: 'IRIS · AI-Powered Data Security Posture Management',
    blurb: 'IRIS discovers and classifies PII across GDPR, HIPAA & DPDP workflows.',
    points: [
      '#1 contributor of 10 engineers, 1,087 of ~4,000 commits (27%), 4× the next contributor, Feb–Jul 2026.',
      'Led feature areas end-to-end: access governance, risk assessment, PII-classification pattern ranking, purpose tracking (22/22 slices), Shadow-IT discovery.',
      'Owned CI/CD on GCP Cloud Build, nightly integration, blue/green prod deploys, Alembic dual-head merge resolution, Python 3.11→3.13 migration.',
      'Hardened multi-tenant SaaS: OAuth2/OIDC SSO, SCIM 2.0, per-endpoint RBAC, org-scoped queries.',
    ],
    tags: ['FastAPI', 'LangGraph', 'pgvector', 'GCP', 'Alembic', 'SCIM 2.0'],
  },
  {
    role: 'Sole Author',
    org: 'AI Privacy Verifier',
    when: 'Apr to May 2026',
    where: 'SyloxLabs',
    flagship: 'Canary-trap auditing of AI-vendor privacy claims',
    blurb: 'Cryptographic evidence chains that prove unauthorized model training.',
    points: [
      'Sole author, 189 of 189 commits, 31 of 31 PRs, production system built in three weeks.',
      'Provider-agnostic FastAPI across 7 LLM vendors: canary-trap injection, model fingerprinting, timestamped evidence packets.',
      'RFC 3161 TSA + Sigstore/Rekor tamper-evident evidence chain; Open Policy Agent (Rego) policies; Celery Beat scheduling.',
      'Deployed on AKS with Helm + workload identity; CI-gated with pre-commit and automated review.',
    ],
    tags: ['7-vendor LLM', 'RFC 3161', 'Rekor', 'Celery', 'AKS'],
  },
  {
    role: 'Creator',
    org: 'Cerevra',
    when: '2026',
    where: 'Private build, demo on request',
    flagship: 'Zero-Data-Loss RAG Engine',
    blurb: 'Deterministic, WAL-durable, namespace-isolated RAG, no vectors required.',
    points: [
      'WAL-backed crash recovery with per-mutation fsync and deterministic replay; chaos-tested truncation recovery.',
      'BM25-first retrieval with context scoring + refusal gating, cuts hallucination without GPU dependence.',
      '219 commits, v0.1.0 release, 5 CI workflows, full OSS packaging: SDK, Docker, security policy, contributor docs.',
      '2,195 tests at 80% diff coverage with chaos / property / resilience suites + Prometheus, OTel & GDPR audit.',
    ],
    tags: ['RAG', 'WAL', 'BM25', 'Chaos-tested', '2,195 tests'],
  },
  {
    role: 'Lead Author',
    org: 'SHAR',
    when: 'Jan to May 2024',
    where: 'Pune · TIJER 2025',
    flagship: 'Suspicious Activity Recognition (Vision Transformer)',
    blurb: 'Peer-reviewed real-time suspicious-activity detection system.',
    points: [
      'Fine-tuned a Vision Transformer on UCF-Crime & KTH, 92% accuracy, 92% F1 at 100 ms/frame.',
      'Real-time WebSocket + email/SMS alerting with 95% manual-audit alert precision.',
      'Usability survey of 50 users: 90% rated it "very easy to use", 85% satisfied with reliability.',
    ],
    tags: ['ViT', 'PyTorch', 'WebSocket', 'Published'],
  },
]

// ── Scene 5, Engineering principles (DNA) ──────────────────────────────────
// Distilled from WHAT_I_LEARNED_BUILDING_IRIS hard-won principles.
export const principles = [
  { k: 'Idempotency is engineered', v: '“IF NOT EXISTS” is the floor. Real idempotency reflects live DB state via the Inspector, CI on fresh Postgres is the only honest test.' },
  { k: 'A red test is a question', v: 'Read production code before touching a test. I triaged 214 failures in one sweep, and caught a real $batch bug hiding in stale-test noise.' },
  { k: 'Honesty over optimism', v: 'I shipped an audit that downgraded 26 of my own “available” connectors to “planned”. Naming the gap is the first half of closing it.' },
  { k: 'Reason explicitly about concurrency', v: 'Lock the one shared step, fan out the rest. A race-free single-flight token refresh held under 50-thread load.' },
  { k: 'Externalize every constant', v: 'Provider URLs, ensemble weights, rate quotas live in YAML, accuracy and connectors ship without a redeploy.' },
  { k: 'Scale the org chart, not the hours', v: 'Built PSYLOC, a 14-stage, gated, agent-dispatched system that produces features under the same governance I designed.' },
]

// ── Scene 6, Certifications + achievements (starfield constellation) ───────
export const certs = [
  { issuer: 'Oracle OCI', items: 'Generative AI Professional · AI Vector Search Pro · Data Science Pro · Architect Associate' },
  { issuer: 'Databricks', items: 'Developer Pro · GenAI Fundamentals · AI Agent Fundamentals' },
  { issuer: 'Astronomer', items: 'Apache Airflow 3, Fundamentals + DAG Authoring' },
  { issuer: 'KodeKloud', items: 'Kubernetes · RAG Crash Course' },
  { issuer: 'Calyptus', items: 'AI Fluent Tech Professional, Top 5% globally' },
  { issuer: 'Securiti / Saviynt', items: 'AI Security & Governance · Identity Security for the AI Age' },
]

export const achievements = [
  { v: 'Top 10%', l: 'LeetCode, 500+ problems, 500-day streak, Annual Badge 2025, 75 Hard' },
  { v: '500 days', l: 'Kaggle streak · Annual Medal 2025' },
  { v: '4× badges', l: 'GitHub, Pull Shark ×2, Pair Extraordinaire, YOLO, Quickdraw' },
  { v: 'Published', l: 'Lead author, Vision Transformer paper (TIJER, 2025) + 2 Medium articles' },
]

// ── Open-source contributions, meaningful, merged, across the ecosystem ─────
// Real PRs/issues into notable AI, security, data & infra projects.
export const openSource = [
  {
    repo: 'VictoriaMetrics/VictoriaMetrics',
    num: '#10974',
    title: 'promql: stop integrate() extrapolating past series end',
    note: 'Correctness fix inside the query engine of a 17k-star TSDB, 15 commits, 5 review rounds.',
    domain: 'Observability / TSDB',
    url: 'https://github.com/VictoriaMetrics/VictoriaMetrics/pull/10974',
  },
  {
    repo: 'dlt-hub/dlt',
    num: '#3947',
    title: 'fix(mssql): ingest parquet row-groups individually to bound ADBC memory',
    note: 'Found the OOM (#3915), then fixed it, parquet→MSSQL loads now memory-bounded.',
    domain: 'Data Loading',
    url: 'https://github.com/dlt-hub/dlt/pull/3947',
  },
  {
    repo: 'unslothai/unsloth',
    num: '#5551',
    title: 'fix stuck IME flag when compositionend never fires',
    note: '+415/−7 across 4 files, merged by the founder of the 68k-star fine-tuning toolkit.',
    domain: 'LLM Fine-tuning',
    url: 'https://github.com/unslothai/unsloth/pull/5551',
  },
  {
    repo: 'PrefectHQ/prefect',
    num: '#22035',
    title: 'fix Azure blob result storage overwrite on rewrite',
    note: 'Bug fix in a 23k-star orchestration platform, merged by a core maintainer.',
    domain: 'Orchestration',
    url: 'https://github.com/PrefectHQ/prefect/pull/22035',
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
    kicker: '01 · The Pull of Results',
    h: 'Everything I build revolves around one thing, real impact',
    sub: 'Production GenAI engineer, RAG, agentic LangGraph pipelines and async FastAPI at scale. I ship systems that survive real load, not slideware.',
  },
  capabilities: {
    kicker: '02 · A Universe of Capabilities',
    h: 'A universe of capabilities, already in production',
    sub: 'Not one tool, but a living system: multi-tenant SaaS, agentic pipelines and hybrid vector search, all orbiting one goal, AI that holds up under real load.',
  },
  core: {
    kicker: '03 · Velocity',
    h: 'Spinning so fast it reads as still',
    sub: 'A wheel at full speed looks static, that is what mastered tooling feels like. An agent-driven build loop I designed turns effort into output that just appears.',
  },
  iris: {
    kicker: '04 · Flagship',
    h: 'IRIS: Data Security Posture Management, at scale',
    sub: 'An AI-powered DPSM platform discovering and classifying PII across GDPR, HIPAA and DPDP, shipped, gated and observable.',
  },
  work: {
    kicker: '05 · The Work',
    h: 'Four systems. Shipped under load.',
    sub: 'From a peer-reviewed Vision Transformer to a zero-data-loss RAG engine and a 7-vendor privacy auditor.',
  },
  principles: {
    kicker: '06 · Principles',
    h: 'Hard-won principles, earned in red CI',
    sub: 'Across 1,600+ commits and five production codebases, what I learned to trust, and what I learned to distrust.',
  },
  proof: {
    kicker: '07 · Open Source & Proof',
    h: 'I ship into other people’s codebases too',
    sub: 'Eight merged contributions across VictoriaMetrics, dlt, Unsloth, Prefect & Tracecat, repos totaling ~120,000 stars. Every one is one click from proof.',
  },
  contact: {
    kicker: '08 · Connect',
    h: "Let's build something that survives production",
    sub: 'Open to AI/ML Engineer, GenAI Engineer and Backend AI Platform roles. B.E. Information Technology · SPPU · 8.53 CGPA.',
  },
}
