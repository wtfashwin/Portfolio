import { useId, useState } from 'react'
import './project-visuals.css'

const retrievalSteps = [
  {
    id: 'sources',
    label: 'Source documents',
    detail: 'Start with source material',
    description: 'Documents supply the knowledge for a support answer. The sheets here are illustrative, with no customer data.',
  },
  {
    id: 'ingestion',
    label: 'Ingestion',
    detail: 'Prepare the knowledge',
    description: 'An ingestion path prepares source content for retrieval. The diagram condenses that preparation into one step.',
  },
  {
    id: 'retrieval',
    label: 'Retrieval',
    detail: 'Find relevant context',
    description: 'A support question is paired with relevant source context before an answer is composed.',
  },
  {
    id: 'response',
    label: 'Grounded response',
    detail: 'Answer from context',
    description: 'Retrieved material informs the response. This drawing explains the architecture; it is not an executed query or a quality benchmark.',
  },
]

const accessStep = {
  id: 'access',
  detail: 'Keep the access boundary explicit',
  description: 'The public implementation forwards authorization to the AI service. This boundary marks that request context; it does not imply a security audit.',
}

const contextSteps = [
  {
    id: 'capture',
    label: 'Capture a task',
    detail: 'Give the idea a place',
    description: 'Capture a task idea in a native macOS interface. The task shown is a simple example, not recorded activity.',
  },
  {
    id: 'project',
    label: 'Select project context',
    detail: 'Keep the right project nearby',
    description: 'Match the task with its project context. The folder represents that choice, rather than a live file browser.',
  },
  {
    id: 'note',
    label: 'Keep a local note',
    detail: 'Carry the context forward',
    description: 'Task and project context come together in a local note. This conceptual flow does not capture, inspect, or write files.',
  },
]

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6.5 8V5.8a3.5 3.5 0 0 1 7 0V8M5 8h10v8H5z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 11v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function SourceDrawing() {
  return (
    <svg viewBox="0 0 112 94" fill="none" aria-hidden="true">
      <path d="M29 14h55v66H29z" className="pv-drawing-back" />
      <path d="M23 19h55v66H23z" className="pv-drawing-sheet" />
      <path d="M31 29h22M31 38h37M31 45h37M31 52h28M31 66h37M31 73h22" className="pv-drawing-line" />
      <path d="M31 58h37" className="pv-drawing-accent" />
      <path d="M67 19v10h11" className="pv-drawing-line" />
      <text x="85" y="29" className="pv-svg-letter">a</text>
      <text x="85" y="75" className="pv-svg-letter">b</text>
    </svg>
  )
}

function IngestionDrawing() {
  return (
    <svg viewBox="0 0 112 94" fill="none" aria-hidden="true">
      <path d="M14 21h23v52H14z" className="pv-drawing-sheet" />
      <path d="M20 30h11M20 38h11M20 46h8M20 54h11M20 62h8" className="pv-drawing-line" />
      <path d="M37 47h14M51 27v40M51 27h13M51 47h13M51 67h13" className="pv-drawing-connection" />
      {[22, 42, 62].map((y, index) => (
        <g key={y}>
          <rect x="64" y={y} width="33" height="10" rx="1" className={index === 1 ? 'pv-drawing-chunk active' : 'pv-drawing-chunk'} />
          <path d={`M70 ${y + 5}h20`} className="pv-drawing-line" />
        </g>
      ))}
      <path d="M64 80h33" className="pv-drawing-line pv-drawing-faint" />
    </svg>
  )
}

function RetrievalDrawing() {
  return (
    <svg viewBox="0 0 112 94" fill="none" aria-hidden="true">
      <path d="M15 17h82v14H15z" className="pv-drawing-sheet" />
      <circle cx="24" cy="23.5" r="2.5" className="pv-drawing-line" />
      <path d="m26 26 3 3M36 24h38" className="pv-drawing-line" />
      {Array.from({ length: 18 }, (_, index) => {
        const isRelevant = [2, 8, 9].includes(index)
        return <rect key={index} x={17 + (index % 6) * 13.5} y={43 + Math.floor(index / 6) * 13} width="10" height="8" rx="1" className={isRelevant ? 'pv-vector active' : 'pv-vector'} />
      })}
      <path d="M17 85h50" className="pv-drawing-line pv-drawing-faint" />
    </svg>
  )
}

function ResponseDrawing() {
  return (
    <svg viewBox="0 0 112 94" fill="none" aria-hidden="true">
      <rect x="17" y="16" width="78" height="64" rx="2" className="pv-drawing-sheet" />
      <path d="M27 29h16M27 40h58M27 48h58M27 56h39" className="pv-drawing-line" />
      <rect x="27" y="66" width="24" height="7" rx="1" className="pv-drawing-chunk active" />
      <rect x="55" y="66" width="20" height="7" rx="1" className="pv-drawing-chunk" />
      <path d="m80 27 3 3 6-7" className="pv-drawing-accent" />
    </svg>
  )
}

const retrievalDrawings = {
  sources: SourceDrawing,
  ingestion: IngestionDrawing,
  retrieval: RetrievalDrawing,
  response: ResponseDrawing,
}

function VisualCaption({ id, step, position, total }) {
  return (
    <div className="pv-caption" id={id} role="status" aria-live="polite" aria-atomic="true">
      <span className="pv-caption-index" aria-hidden="true">{position}{total && <span> / {total}</span>}</span>
      <div>
        <p className="pv-caption-title">{step.detail}</p>
        <p className="pv-caption-description">{step.description}</p>
      </div>
    </div>
  )
}

export function RetrievalVisual({ className = '' }) {
  const [active, setActive] = useState('retrieval')
  const descriptionId = useId()
  const activeIndex = retrievalSteps.findIndex((step) => step.id === active)
  const activeStep = active === 'access' ? accessStep : retrievalSteps[activeIndex]

  return (
    <figure className={`pv-visual pv-retrieval ${className}`} aria-label="Customer Support System architecture illustration">
      <figcaption className="pv-heading">
        <span className="pv-heading-label"><span className="pv-heading-mark" aria-hidden="true" />Architecture illustration</span>
        <span className="pv-heading-note">Explore each step</span>
      </figcaption>
      <div className="pv-retrieval-board">
        <div className="pv-retrieval-grid" role="group" aria-label="Retrieval architecture steps">
          {retrievalSteps.map((step, index) => {
            const Drawing = retrievalDrawings[step.id]
            return (
              <button
                key={step.id}
                type="button"
                className={`pv-flow-node pv-flow-${step.id}`}
                aria-pressed={active === step.id}
                aria-controls={descriptionId}
                onClick={() => setActive(step.id)}
                onFocus={() => setActive(step.id)}
              >
                <span className="pv-node-top"><span>{String(index + 1).padStart(2, '0')}</span><span className="pv-node-select" aria-hidden="true" /></span>
                <span className="pv-node-drawing"><Drawing /></span>
                <span className="pv-node-label">{step.label}</span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          className="pv-access"
          aria-pressed={active === 'access'}
          aria-controls={descriptionId}
          onClick={() => setActive('access')}
          onFocus={() => setActive('access')}
        >
          <span className="pv-access-name"><LockIcon />Access boundary</span>
          <span className="pv-access-note">Authorization follows the request</span>
          <span className="pv-access-end" aria-hidden="true">i</span>
        </button>
      </div>
      <VisualCaption id={descriptionId} step={activeStep} position={active === 'access' ? '↳' : String(activeIndex + 1).padStart(2, '0')} total={active === 'access' ? null : '04'} />
    </figure>
  )
}

function CaptureArtifact() {
  return (
    <span className="pv-task-slip">
      <span className="pv-slip-top"><span className="pv-paper-icon" aria-hidden="true">+</span><span>Example task</span></span>
      <span className="pv-task-copy">Add keyboard<br />shortcuts</span>
      <span className="pv-task-rule" aria-hidden="true" />
      <span className="pv-task-bottom">An idea, captured.</span>
    </span>
  )
}

function ProjectArtifact() {
  return (
    <span className="pv-project-folder">
      <span className="pv-folder-tab" aria-hidden="true" />
      <span className="pv-folder-top"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 7h7l2 2h9v11H3zM3 7V5h7l2 2h8v2" stroke="currentColor" strokeWidth="1.4" /></svg><span className="pv-folder-check" aria-hidden="true">✓</span></span>
      <span className="pv-folder-name">Context Dock</span>
      <span className="pv-folder-meta">Swift · macOS</span>
      <span className="pv-folder-bottom">Project context</span>
    </span>
  )
}

function NoteArtifact() {
  return (
    <span className="pv-local-note">
      <span className="pv-note-top"><span className="pv-note-file-icon" aria-hidden="true" /><span>Local note</span></span>
      <span className="pv-note-field">Task<span className="pv-note-rule" aria-hidden="true" /></span>
      <span className="pv-note-field">Project<span className="pv-note-rule short" aria-hidden="true" /></span>
      <span className="pv-note-field">Context<span className="pv-note-rule" aria-hidden="true" /></span>
      <span className="pv-note-bottom"><span aria-hidden="true">↳</span> Kept together</span>
    </span>
  )
}

const contextArtifacts = { capture: CaptureArtifact, project: ProjectArtifact, note: NoteArtifact }

export function ContextVisual({ className = '' }) {
  const [active, setActive] = useState('project')
  const descriptionId = useId()
  const activeIndex = contextSteps.findIndex((step) => step.id === active)

  return (
    <figure className={`pv-visual pv-context ${className}`} aria-label="Context Dock conceptual flow">
      <figcaption className="pv-heading">
        <span className="pv-heading-label"><span className="pv-heading-mark" aria-hidden="true" />Conceptual flow</span>
        <span className="pv-heading-note">No live app session</span>
      </figcaption>
      <div className="pv-context-board" role="group" aria-label="Context Dock task flow">
        <span className="pv-context-rail" aria-hidden="true" />
        {contextSteps.map((step, index) => {
          const Artifact = contextArtifacts[step.id]
          return (
            <button
              key={step.id}
              type="button"
              className={`pv-context-node pv-context-${step.id}`}
              aria-pressed={active === step.id}
              aria-controls={descriptionId}
              onClick={() => setActive(step.id)}
              onFocus={() => setActive(step.id)}
            >
              {step.id === 'note' && <span className="pv-context-join" aria-hidden="true">Task + project</span>}
              <span className="pv-context-artifact" aria-hidden="true"><Artifact /></span>
              <span className="pv-context-label"><span className="pv-context-step" aria-hidden="true">{index + 1}</span>{step.label}</span>
            </button>
          )
        })}
      </div>
      <VisualCaption id={descriptionId} step={contextSteps[activeIndex]} position={String(activeIndex + 1).padStart(2, '0')} total="03" />
    </figure>
  )
}
