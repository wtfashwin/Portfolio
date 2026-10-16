import { useEffect, useId, useMemo, useReducer, useRef, useState } from 'react'
import {
  MAX_WORKBENCH_JOBS, createInitialWorkbench, createReceipt, featureOrder,
  fraudWorkbenchReducer, getFilteredJobs, nextTransactionId, readExplanation,
  summarizeJobs, validateTransaction,
} from './fraud-workbench.js'
import './fraud-visual.css'

const sourceURL = 'https://github.com/wtfashwin/fraud-detection/blob/4c7cd588c607bac7b47669ca51f711c4faec2417/api/app.py'
const filters = [['all', 'All jobs'], ['queued', 'Queued'], ['running', 'Running'], ['completed', 'Completed'], ['failed', 'Failed']]

function usePlaybackVisibility(container, dispatch) {
  const [inView, setInView] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const preference = () => {
      setReduced(media.matches)
      if (media.matches) dispatch({ type: 'play', value: false })
    }
    const visibility = () => setTabVisible(!document.hidden)
    preference()
    visibility()
    media.addEventListener('change', preference)
    document.addEventListener('visibilitychange', visibility)
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      setInView(entries.some(entry => entry.isIntersecting))
    }, { threshold: 0.05 }) : null
    if (observer && container.current) observer.observe(container.current)
    else setInView(true)
    return () => {
      media.removeEventListener('change', preference)
      document.removeEventListener('visibilitychange', visibility)
      observer?.disconnect()
    }
  }, [container, dispatch])
  return { inView, tabVisible, reduced }
}

function JobBadge({ job }) {
  return <span className={`fv-job-badge fv-status-${job.status.toLowerCase()}`}>{job.status}</span>
}

export default function FraudVisual() {
  const [state, dispatch] = useReducer(fraudWorkbenchReducer, undefined, createInitialWorkbench)
  const [transactionId, setTransactionId] = useState('transaction-001')
  const [amount, setAmount] = useState('24.50')
  const [featuresJSON, setFeaturesJSON] = useState('')
  const [inspection, setInspection] = useState('response')
  const [workspaceView, setWorkspaceView] = useState('queue')
  const [feedback, setFeedback] = useState('')
  const [packet, setPacket] = useState(null)
  const lastPacket = useRef(0)
  const container = useRef(null)
  const id = useId()
  const { inView, tabVisible, reduced } = usePlaybackVisibility(container, dispatch)
  const counts = summarizeJobs(state.jobs)
  const selected = state.jobs.find(job => job.id === state.selectedId) || null
  const worker = state.jobs.find(job => job.phase === 'running')
  const pending = counts.queued + counts.running
  const jobs = getFilteredJobs(state)
  const readout = readExplanation(selected)
  const failureArmed = state.failNext || Boolean(worker?.shouldFail)
  const playbackActive = state.playing && pending > 0 && !reduced && inView && tabVisible
  const receipt = useMemo(() => selected ? JSON.stringify(createReceipt(selected), null, 2) : '', [selected])
  const inspected = inspection === 'events' ? state.events : inspection === 'input' && selected
    ? { feature_order: featureOrder, features: selected.features } : readout

  useEffect(() => {
    if (!playbackActive) return undefined
    const timer = window.setTimeout(() => dispatch({ type: 'tick' }), 900 / state.speed)
    return () => window.clearTimeout(timer)
  }, [playbackActive, state.speed, state.jobs])

  useEffect(() => {
    const sequence = state.transition?.sequence || 0
    if (!inView || !tabVisible || reduced) {
      lastPacket.current = sequence
      setPacket(null)
      return
    }
    if (sequence && sequence !== lastPacket.current) {
      lastPacket.current = sequence
      setPacket(state.transition)
    }
  }, [state.transition, inView, tabVisible, reduced])

  const submit = event => {
    event.preventDefault()
    setFeedback('')
    dispatch({ type: 'submit', input: { id: transactionId, amount, featuresJSON } })
  }
  const copyReceipt = async () => {
    if (!receipt) return
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(receipt)
      setFeedback('Simulation receipt copied.')
    } catch { setFeedback('Clipboard unavailable here. Use Download receipt instead.') }
  }
  const downloadReceipt = () => {
    if (!receipt || !selected) return
    const anchor = document.createElement('a')
    anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(receipt)}`
    anchor.download = `simulation-${selected.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80)}.json`
    anchor.click()
    setFeedback('Simulation receipt download requested.')
  }
  const resetSession = () => {
    dispatch({ type: 'reset' })
    setTransactionId('transaction-001')
    setAmount('24.50')
    setFeaturesJSON('')
    setInspection('response')
    setWorkspaceView('queue')
    setFeedback('Browser session reset. No external data was changed.')
    setPacket(null)
    lastPacket.current = 0
  }
  const validation = state.notice?.kind === 'validation'
  const workerLabel = !pending ? 'Idle' : reduced ? 'Manual mode' : state.playing ? playbackActive ? 'Playing' : 'Suspended' : 'Paused'

  const notice = <div className={`fv-notice${validation ? ' is-error' : ''}`} role="status" aria-live="polite" aria-atomic="true"><span className="fv-notice-code">{state.notice?.http ? `HTTP ${state.notice.http}` : validation ? 'Input error' : 'Simulation'}</span><p>{state.notice && <span className="fv-last-action">Last action: </span>}{state.notice?.message || 'Your queue is empty. Submit one job or add a batch of three.'}</p></div>

  return <figure className="pv-visual fv-visual fv-workbench" ref={container} aria-label="Interactive fraud API browser simulation">
    <figcaption className="pv-heading fv-heading">
      <span className="pv-heading-label"><span className="pv-heading-mark" aria-hidden="true" />Transaction workbench</span>
      <span className="fv-simulation-label">Browser simulation</span>
    </figcaption>
    <div className="fv-workbench-body">
      <div className="fv-introduction"><p>Send a transaction. Follow its record.</p><span>No real model, API calls, risk scores, or feature contributions.</span></div>
      <div className="fv-workspace-tabs" role="group" aria-label="Choose a workbench view"><button type="button" aria-pressed={workspaceView === 'queue'} onClick={() => setWorkspaceView('queue')}>Queue & worker <span>{state.jobs.length}</span></button><button type="button" aria-pressed={workspaceView === 'input'} onClick={() => setWorkspaceView('input')}>Transaction input</button></div>
      {workspaceView === 'input' && <div className="fv-input-view"><form className="fv-composer" onSubmit={submit} noValidate aria-label="Create a simulated transaction">
        <div className="fv-input-row">
          <label className="fv-field fv-id-field" htmlFor={`${id}-transaction`}><span>Transaction ID</span><span className="fv-id-input"><input id={`${id}-transaction`} value={transactionId} maxLength={128} autoComplete="off" spellCheck="false" onChange={event => setTransactionId(event.target.value)} aria-describedby={`${id}-input-help`} /><button type="button" onClick={() => setTransactionId(nextTransactionId(state))}>New ID</button></span></label>
          <label className="fv-field fv-amount-field" htmlFor={`${id}-amount`}><span>Amount</span><input id={`${id}-amount`} type="number" step="any" inputMode="decimal" value={amount} onChange={event => setAmount(event.target.value)} aria-describedby={`${id}-input-help`} /></label>
          <button className="fv-button fv-primary fv-submit" type="submit">Submit job <span aria-hidden="true">↗</span></button>
        </div>
        <p className="fv-input-help" id={`${id}-input-help`}>Same ID twice returns 409. Try it; the original record stays intact.</p>
        <details className="fv-features"><summary>Set the 30 ordered features <span>Optional JSON</span></summary><div>
          <label htmlFor={`${id}-features`}>Time, V1–V28, Amount. The Amount field above replaces element 30.</label>
          <textarea id={`${id}-features`} value={featuresJSON} maxLength={12000} rows={4} placeholder="Leave empty for 29 zeros + the Amount above." spellCheck="false" onChange={event => setFeaturesJSON(event.target.value)} />
          <div className="fv-feature-actions"><button className="fv-button fv-secondary" type="button" onClick={() => setFeaturesJSON(JSON.stringify([...Array(29).fill(0), Number.isFinite(Number(amount)) ? Number(amount) : 0]))}>Load zero-vector example</button><button className="fv-button fv-quiet" type="button" onClick={() => { const result = validateTransaction({ id: transactionId, amount, featuresJSON }); setFeedback(result.ok ? 'Input is valid: 30 finite numbers. No model was run.' : result.error) }}>Validate input</button></div>
        </div></details>
      </form>
      <button className="fv-button fv-secondary fv-open-queue" type="button" onClick={() => setWorkspaceView('queue')}>Open queue & worker ({state.jobs.length})</button>
      {notice}</div>}

      {workspaceView === 'queue' && <><div className="fv-worker-toolbar" role="group" aria-label="Control the simulated worker">
        <button className="fv-button fv-secondary" type="button" onClick={() => { setFeedback(''); dispatch({ type: 'batch' }) }}>Batch 3 examples</button>
        <button className="fv-button fv-secondary" type="button" disabled={!pending || reduced} aria-pressed={state.playing} onClick={() => dispatch({ type: 'play', value: !state.playing })}>{state.playing ? 'Pause worker' : 'Resume worker'}</button>
        <button className="fv-button fv-secondary" type="button" disabled={!pending} onClick={() => dispatch({ type: 'step' })}>Process one step</button>
        <label className="fv-speed">Speed<select aria-label="Worker playback speed" value={state.speed} disabled={reduced} onChange={event => dispatch({ type: 'speed', value: Number(event.target.value) })}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
        <button className="fv-button fv-failure-button" type="button" disabled={failureArmed} aria-pressed={failureArmed} onClick={() => dispatch({ type: 'inject-failure' })}>{failureArmed ? 'Failure armed' : 'Fail one job'}</button>
      </div>
      <div className="fv-worker-state"><span><i className={playbackActive ? 'is-playing' : ''} aria-hidden="true" />{workerLabel}</span><span>{reduced ? 'Reduced motion: use Process one step.' : 'Playback pauses offscreen and in hidden tabs.'}</span></div>

      <div className="fv-live-pipeline" aria-label="Current queue and record counts">
        <div className="fv-live-node"><span className="fv-node-kicker">Request</span><strong>{counts.queued}<small>queued</small></strong><span>POST /predict · queued</span></div>
        <div className={`fv-live-node${worker ? ' is-active' : ''}`}><span className="fv-node-kicker">Browser worker</span><strong>{counts.running}<small>running</small></strong><span className="fv-working-id">{worker ? worker.id : 'Waiting for a job'}</span><span className="fv-worker-progress" aria-hidden="true"><i style={{ width: `${worker?.progress || 0}%` }} /></span></div>
        <div className="fv-live-node"><span className="fv-node-kicker">Session store</span><strong>{counts.completed + counts.failed}<small>saved</small></strong><span>{counts.completed} completed / {counts.failed} failed</span></div>
        {packet && <span className="fv-state-packet" key={packet.sequence} data-route={packet.route} aria-hidden="true" onAnimationEnd={() => setPacket(null)} />}
      </div>

      {notice}

      <div className="fv-job-workspace">
        <section className="fv-jobs" aria-label="Jobs in this browser session">
          <div className="fv-list-heading"><h4>Jobs <span>{state.jobs.length}/{MAX_WORKBENCH_JOBS}</span></h4><select aria-label="Filter jobs" value={state.filter} onChange={event => dispatch({ type: 'filter', value: event.target.value })}>{filters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="fv-job-list" role="group" aria-label="Select a job">
            {jobs.length ? jobs.map(job => <button className="fv-job" type="button" key={job.id} aria-pressed={selected?.id === job.id} onClick={() => { dispatch({ type: 'select', id: job.id }); setFeedback('') }}><span className="fv-job-main"><strong>{job.id}</strong><JobBadge job={job} /></span><span className="fv-job-meta"><span>{job.phase === 'saved' ? 'Terminal record' : job.phase === 'running' ? `Running · step ${job.progress / 25}/4` : 'Queued · awaiting worker'}</span><span>{job.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></span><span className="fv-job-track" aria-hidden="true"><i style={{ width: `${job.progress}%` }} /></span></button>) : <p className="fv-empty-list">{state.jobs.length ? 'No jobs match this filter.' : 'Independent jobs will appear here.'}</p>}
          </div>
        </section>
        <section className="fv-inspector" aria-label="Inspect the selected job">
          <div className="fv-inspector-heading"><span>Selected record</span>{readout && <span className={`fv-read-code${readout.http === 503 ? ' is-failed' : ''}`}>GET {readout.http}</span>}</div>
          {selected ? <>
            <h4 className="fv-selected-id">{selected.id}</h4>
            <p className="fv-selected-phase">{selected.phase === 'saved' ? `${selected.status} saved in this session.` : `${selected.phase === 'running' ? 'Running' : 'Queued'}; stored status is PENDING.`}{selected.replayOf && <span>Replays {selected.replayOf}. The original is preserved.</span>}{selected.shouldFail && selected.status === 'PENDING' && <span>One terminal failure is armed for this job.</span>}</p>
            <div className="fv-record-actions"><button className="fv-button fv-quiet" type="button" onClick={() => { dispatch({ type: 'read', id: selected.id }); setInspection('response') }}>Read explanation</button>{selected.status === 'FAILED' && <button className="fv-button fv-replay" type="button" onClick={() => { dispatch({ type: 'replay', id: selected.id }); setInspection('response') }}>Replay as new ID</button>}</div>
          </> : <div className="fv-empty-inspector"><strong>The response is not the finish.</strong><p>A queued or running job reads 202. Completed records read 200; saved failures read 503.</p></div>}
          <div className="fv-inspection-tabs" role="group" aria-label="Choose JSON to inspect">{[['response', 'Response'], ['input', 'Input'], ['events', 'Events']].map(([value, label]) => <button key={value} type="button" aria-pressed={inspection === value} onClick={() => setInspection(value)}>{label}</button>)}</div>
          <pre className="fv-json" tabIndex={0} aria-label={inspection === 'events' ? 'Last twelve simulation events JSON' : `${inspection} JSON for the selected job`}>{inspected ? JSON.stringify(inspected, null, 2) : '{\n  "simulation": true,\n  "note": "Submit a transaction to inspect it."\n}'}</pre>
          <div className="fv-receipt-actions"><button className="fv-button fv-quiet" type="button" disabled={!selected} onClick={copyReceipt}>Copy receipt</button><button className="fv-button fv-quiet" type="button" disabled={!selected} onClick={downloadReceipt}>Download receipt</button></div>
        </section>
      </div>
      </>}
      <div className="fv-session-actions"><button className="fv-button fv-quiet" type="button" disabled={!counts.queued} onClick={() => dispatch({ type: 'clear-queue' })}>Clear queued jobs</button><button className="fv-button fv-quiet" type="button" onClick={resetSession}>Reset session</button><span>12 jobs · last 12 events</span></div>
      <p className="fv-feedback" role="status" aria-live="polite">{feedback}</p>
    </div>
    <div className="fv-footnote"><p>All work happens in browser memory. Completion saves a workflow receipt, not a model explanation. Reset removes only this local simulation.</p><a href={sourceURL} target="_blank" rel="noreferrer">Inspect the API contract <span aria-hidden="true">↗</span></a></div>
  </figure>
}
