export const MAX_WORKBENCH_JOBS = 12
export const MAX_WORKBENCH_EVENTS = 12
export const featureOrder = ['Time', ...Array.from({ length: 28 }, (_, index) => `V${index + 1}`), 'Amount']

export function createInitialWorkbench() {
  return {
    jobs: [], events: [], selectedId: null, playing: false, speed: 1,
    failNext: false, nextId: 1, eventSequence: 1, filter: 'all', notice: null, transition: null,
  }
}

export function validateTransaction(input = {}) {
  const id = typeof input.id === 'string' ? input.id.trim() : ''
  if (!id || id.length > 128 || !/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(id)) {
    return { ok: false, error: 'Use 1–128 characters: begin with a letter or number, then use letters, numbers, _, ., :, or -.' }
  }
  if ((typeof input.amount !== 'string' && typeof input.amount !== 'number') || String(input.amount).trim() === '' || !Number.isFinite(Number(input.amount))) {
    return { ok: false, error: 'Amount must be a finite number.' }
  }
  let features = Array(30).fill(0)
  if (input.featuresJSON && String(input.featuresJSON).trim()) {
    if (typeof input.featuresJSON !== 'string' || input.featuresJSON.length > 12000) return { ok: false, error: 'Keep the feature JSON below 12,000 characters.' }
    try { features = JSON.parse(input.featuresJSON) } catch { return { ok: false, error: 'Features must be a valid JSON array.' } }
    if (!Array.isArray(features) || features.length !== 30 || features.some(value => typeof value !== 'number' || !Number.isFinite(value))) {
      return { ok: false, error: 'Features must contain exactly 30 finite numbers, in source order.' }
    }
  }
  const amount = Number(input.amount)
  features = [...features]
  features[29] = amount
  return { ok: true, value: { id, amount, features } }
}

export function nextTransactionId(state, prefix = 'transaction') {
  let sequence = state.nextId
  let id = `${prefix}-${String(sequence).padStart(3, '0')}`
  while (state.jobs.some(job => job.id === id)) {
    sequence += 1
    id = `${prefix}-${String(sequence).padStart(3, '0')}`
  }
  return id
}

function recordEvent(state, kind, jobId, message) {
  const event = { sequence: state.eventSequence, kind, job_id: jobId, message }
  return { ...state, eventSequence: state.eventSequence + 1, events: [...state.events, event].slice(-MAX_WORKBENCH_EVENTS) }
}

function reject(state, kind, message, http = null, jobId = null) {
  return recordEvent({ ...state, notice: { kind, message, http } }, kind, jobId, message)
}

function accepted(state, value, replayOf = null) {
  const job = {
    id: value.id, amount: value.amount, features: [...value.features], status: 'PENDING',
    phase: 'queued', progress: 0, shouldFail: false, replayOf, savedResponse: null,
  }
  const message = `${job.id} accepted. Its saved explanation is PENDING.`
  return recordEvent({
    ...state, jobs: [...state.jobs, job], selectedId: job.id, nextId: state.nextId + 1,
    notice: { kind: 'accepted', http: null, message },
    transition: { sequence: state.eventSequence, route: 'dispatch', jobId: job.id },
  }, 'accepted', job.id, message)
}

export function readExplanation(job) {
  if (!job) return null
  if (job.savedResponse) return JSON.parse(JSON.stringify(job.savedResponse))
  return { http: 202, body: { transaction_id: job.id, status: 'PENDING', simulation: true, note: 'The browser worker has not saved a terminal explanation record.' } }
}

function savedResponse(job, failed) {
  const body = { transaction_id: job.id, status: failed ? 'FAILED' : 'COMPLETED', simulation: true }
  if (failed) body.error = { code: 'SIMULATED_WORKER_FAILURE', message: 'One terminal worker failure was injected in this browser session.' }
  else body.explanation = { model_executed: false, kind: 'workflow-only', note: 'The explanation lifecycle is demonstrated. No prediction, risk score, or feature contributions were computed.' }
  return { http: failed ? 503 : 200, body }
}

function processOneStep(state) {
  let index = state.jobs.findIndex(job => job.phase === 'running')
  const starting = index === -1
  if (starting) index = state.jobs.findIndex(job => job.phase === 'queued')
  if (index === -1) return state
  const previous = state.jobs[index]
  const progress = previous.progress + 25
  const finished = progress === 100
  const shouldFail = starting ? state.failNext : previous.shouldFail
  const job = {
    ...previous, progress, shouldFail,
    phase: finished ? 'saved' : 'running',
    status: finished ? shouldFail ? 'FAILED' : 'COMPLETED' : 'PENDING',
  }
  if (finished) job.savedResponse = savedResponse(job, shouldFail)
  const jobs = state.jobs.map((item, jobIndex) => jobIndex === index ? job : item)
  const message = finished
    ? `${job.id}: ${job.status} saved. Reading it returns ${job.savedResponse.http}.`
    : starting ? `${job.id} started. The saved state remains PENDING.` : `${job.id}: browser processing step ${progress / 25} of 4.`
  return recordEvent({
    ...state, jobs, failNext: starting ? false : state.failNext,
    playing: state.playing && jobs.some(item => item.status === 'PENDING'),
    notice: { kind: finished ? 'saved' : 'processing', http: finished ? job.savedResponse.http : 202, message },
    transition: starting || finished ? { sequence: state.eventSequence, route: finished ? 'save' : 'start', jobId: job.id } : state.transition,
  }, finished ? job.status.toLowerCase() : 'worker', job.id, message)
}

export function summarizeJobs(jobs) {
  return {
    queued: jobs.filter(job => job.phase === 'queued').length,
    running: jobs.filter(job => job.phase === 'running').length,
    completed: jobs.filter(job => job.status === 'COMPLETED').length,
    failed: jobs.filter(job => job.status === 'FAILED').length,
  }
}

export function getFilteredJobs(state) {
  if (state.filter === 'all') return state.jobs
  return state.jobs.filter(job => state.filter === 'queued' || state.filter === 'running'
    ? job.phase === state.filter : job.status.toLowerCase() === state.filter)
}

export function createReceipt(job) {
  if (!job) return null
  return {
    simulation: true, model_executed: false,
    scope: 'In-browser queue and response lifecycle. No API or model was called.',
    transaction_id: job.id, replay_of: job.replayOf,
    input: { feature_order: [...featureOrder], features: [...job.features] },
    worker: { phase: job.phase, progress_steps: job.progress / 25, total_steps: 4 },
    terminal_record_saved: job.phase === 'saved', response: readExplanation(job),
  }
}

export function fraudWorkbenchReducer(state, action) {
  switch (action.type) {
    case 'submit': {
      const validation = validateTransaction(action.input)
      if (!validation.ok) return reject(state, 'validation', validation.error)
      if (state.jobs.some(job => job.id === validation.value.id)) return reject(state, 'duplicate', 'Duplicate transaction ID. The earlier record is unchanged; no new job was queued.', 409, validation.value.id)
      if (state.jobs.length >= MAX_WORKBENCH_JOBS) return reject(state, 'capacity', 'This browser session holds at most 12 jobs. Clear queued jobs or reset the session.')
      return accepted(state, validation.value)
    }
    case 'batch': {
      if (state.jobs.length + 3 > MAX_WORKBENCH_JOBS) return reject(state, 'capacity', 'The three-example batch needs three free slots. Nothing was submitted.')
      let next = state
      for (const amount of [12.5, 79.99, 240]) {
        const validation = validateTransaction({ id: nextTransactionId(next, 'example'), amount })
        next = accepted(next, validation.value)
      }
      return { ...next, notice: { kind: 'accepted', http: null, message: 'Three independent example transactions queued. Their values are inputs, not fraud labels.' } }
    }
    case 'step': return processOneStep(state)
    case 'tick': return state.playing ? processOneStep(state) : state
    case 'play': return { ...state, playing: Boolean(action.value) && state.jobs.some(job => job.status === 'PENDING') }
    case 'speed': return [0.5, 1, 2].includes(action.value) ? { ...state, speed: action.value } : state
    case 'select': return state.jobs.some(job => job.id === action.id) ? { ...state, selectedId: action.id } : state
    case 'filter': return ['all', 'queued', 'running', 'completed', 'failed'].includes(action.value) ? { ...state, filter: action.value } : state
    case 'read': {
      const job = state.jobs.find(item => item.id === (action.id || state.selectedId))
      if (!job) return state
      const response = readExplanation(job)
      return recordEvent({ ...state, notice: { kind: 'read', http: response.http, message: `GET /explain/${job.id} returns ${response.http} in this simulation.` } }, 'read', job.id, `Read saved explanation: ${response.http}`)
    }
    case 'inject-failure': {
      const active = state.jobs.find(job => job.phase === 'running')
      if (active?.shouldFail || (!active && state.failNext)) return state
      const jobs = active ? state.jobs.map(job => job.id === active.id ? { ...job, shouldFail: true } : job) : state.jobs
      const message = active ? `${active.id} will save one simulated terminal failure.` : 'The next worker job will save one simulated terminal failure.'
      return recordEvent({ ...state, jobs, failNext: active ? state.failNext : true, notice: { kind: 'failure-armed', http: null, message } }, 'failure-armed', active?.id || null, message)
    }
    case 'replay': {
      const original = state.jobs.find(job => job.id === action.id && job.status === 'FAILED')
      if (!original) return state
      if (state.jobs.length >= MAX_WORKBENCH_JOBS) return reject(state, 'capacity', 'Replay needs a free job slot. The failed record has been preserved.')
      return accepted(state, { ...original, id: nextTransactionId(state, 'replay') }, original.id)
    }
    case 'clear-queue': {
      const jobs = state.jobs.filter(job => job.phase !== 'queued')
      if (jobs.length === state.jobs.length) return state
      const count = state.jobs.length - jobs.length
      return recordEvent({
        ...state, jobs, failNext: false,
        selectedId: jobs.some(job => job.id === state.selectedId) ? state.selectedId : jobs.at(-1)?.id || null,
        playing: state.playing && jobs.some(job => job.phase === 'running'),
        notice: { kind: 'cleared', http: null, message: `${count} queued ${count === 1 ? 'job removed' : 'jobs removed'}. Running and terminal records are preserved.` },
      }, 'cleared', null, `${count} queued jobs removed`)
    }
    case 'reset': return createInitialWorkbench()
    default: return state
  }
}
