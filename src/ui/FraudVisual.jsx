import { useId, useReducer } from 'react'
import { initialFraudFlow, fraudFlowReducer, getFraudFlow } from './fraud-flow.js'
import './fraud-visual.css'

function FlowDrawing({ kind }) {
  return <svg viewBox="0 0 100 86" fill="none" aria-hidden="true">
    {kind === 0 && <><path d="M23 12h48v62H23z" className="fv-sheet" /><path d="M31 25h31M31 34h31M31 43h20M31 56h31M31 63h17" className="fv-line" /><path d="M31 48h31" className="fv-accent" /></>}
    {kind === 1 && <><rect x="10" y="18" width="80" height="48" rx="4" className="fv-sheet" /><path d="m35 33-10 9 10 9m30-18 10 9-10 9m-11-22-8 26" className="fv-accent" /><path d="M22 73h56" className="fv-line" /></>}
    {kind === 2 && <><rect x="18" y="18" width="64" height="48" rx="4" className="fv-sheet" /><path d="M18 31h64M29 23v4m7-4v4m7-4v4M28 42h15m-15 8h25m-25 8h17" className="fv-line" /><path d="m62 41 9 9-9 9" className="fv-accent" /></>}
    {kind === 3 && <><ellipse cx="50" cy="22" rx="29" ry="10" className="fv-sheet" /><path d="M21 22v37c0 13 58 13 58 0V22M21 40c0 13 58 13 58 0" className="fv-line" /><path d="m40 52 7 7 14-15" className="fv-accent" /></>}
  </svg>
}

export default function FraudVisual() {
  const [state, dispatch] = useReducer(fraudFlowReducer, initialFraudFlow)
  const view = getFraudFlow(state)
  const id = useId()
  const duplicate = state.scenario === 'duplicate'
  const error = (duplicate && state.step > 0) || (state.scenario === 'failure' && state.step >= 2)
  const labels = ['Transaction', 'FastAPI', 'Celery worker', 'Saved explanation']
  const notes = ['Time · V1–V28 · Amount', 'Validate & dispatch', 'Compute contributions', 'PostgreSQL']
  return <figure className="pv-visual fv-visual" data-step={state.step} data-error={error} aria-label="Fraud Detection prediction and asynchronous explanation flow">
    <figcaption className="pv-heading"><span className="pv-heading-label"><span className="pv-heading-mark" aria-hidden="true" />Prediction → explanation</span><span className="pv-heading-note">Illustrative flow</span></figcaption>
    <div className="fv-scenarios" role="group" aria-label="Choose a fraud API scenario">{[['complete','Completed job'],['failure','Worker failure'],['duplicate','Duplicate ID']].map(([value,label]) => <button type="button" key={value} aria-pressed={state.scenario === value} onClick={() => dispatch({type:'scenario',scenario:value})}>{label}</button>)}</div>
    <div className="fv-board">
      <div className="fv-request-label"><span>Example transaction</span><span>example-001</span></div>
      <div className="fv-pipeline" aria-hidden="true">{labels.map((label,index) => <div className={`fv-node${state.step === index ? ' is-active' : ''}${state.step > index && !duplicate ? ' is-past' : ''}${duplicate && index > 1 ? ' is-skipped' : ''}`} key={label}><span className="fv-node-number">{String(index+1).padStart(2,'0')}</span><FlowDrawing kind={index} /><span className="fv-node-label">{label}</span><span className="fv-node-note">{notes[index]}</span>{index < 3 && <span className="fv-connector">→</span>}</div>)}</div>
      <div className="fv-record"><span><span className="fv-status-dot" aria-hidden="true" />Explanation record</span><strong key={view.record}>{view.record}</strong></div>
      <div className="fv-trace" role="status" aria-live="polite" aria-atomic="true" id={`${id}-trace`}><div className="fv-response"><span>{view.endpoint}</span><span className="fv-http">{view.http ? `HTTP ${view.http}` : state.step === 2 ? 'Saved state' : 'Ready'}</span></div><p className="fv-trace-title">{view.title}</p><p className="fv-trace-description">{view.description}</p></div>
      <div className="fv-actions"><button className="fv-next" type="button" aria-describedby={`${id}-trace`} disabled={view.finished} onClick={() => dispatch({type:'advance'})}>{view.action}<span aria-hidden="true">→</span></button><button className="fv-reset" type="button" disabled={state.step === 0} onClick={() => dispatch({type:'reset'})}>Reset</button><span className="fv-step-count">{state.step} / {duplicate ? 1 : 3}</span></div>
    </div>
    <div className="fv-footnote">No API calls or real transaction data. The source defines the behavior.</div>
  </figure>
}
