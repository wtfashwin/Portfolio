import { useEffect, useId, useRef, useState } from 'react'
import { CONTEXT_PROJECTS, MAX_CONTEXT_NOTES, NOTES_STORAGE_KEY, copyWorkbenchText, downloadWorkbenchText, notesMarkdown, readContextSnapshot, sameContextNote, applyContextNoteMutation } from './project-workbench-model.js'
import './project-visuals.css'
import './project-workbenches.css'

const emptyDraft = project => ({ title: '', project, body: '' })

export function ContextWorkbench({ className = '' }) {
  const id = useId()
  const titleInput = useRef(null)
  const notesRef = useRef([])
  const baseRef = useRef(null)
  const sessionOnly = useRef(false)
  const [notes, setNotes] = useState([])
  const [draft, setDraft] = useState({ title: 'Add keyboard shortcuts', project: CONTEXT_PROJECTS[0], body: '' })
  const [selectedId, setSelectedId] = useState(null)
  const [editingBase, setEditingBase] = useState(null)
  const [conflict, setConflict] = useState(false)
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [storage, setStorage] = useState('loading')
  const [status, setStatus] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)
  const [undo, setUndo] = useState(null)

  function showNotes(next) { notesRef.current = next; setNotes(next) }
  function setBase(note) { baseRef.current = note; setEditingBase(note); setSelectedId(note?.id || null); setConflict(false) }

  useEffect(() => {
    try {
      showNotes(readContextSnapshot(window.localStorage.getItem(NOTES_STORAGE_KEY)) || [])
      setStorage('local')
    } catch { sessionOnly.current = true; setStorage('session') }
    setReady(true)
    function syncNotes(event) {
      if (sessionOnly.current || (event.key !== NOTES_STORAGE_KEY && event.key !== null)) return
      let snapshot
      try {
        if (event.storageArea && event.storageArea !== window.localStorage) return
        // A queued event may describe an older write than this tab's last action.
        snapshot = readContextSnapshot(window.localStorage.getItem(NOTES_STORAGE_KEY))
      } catch { return }
      if (snapshot === null) return
      showNotes(snapshot)
      const base = baseRef.current
      if (base && !sameContextNote(snapshot.find(note => note.id === base.id), base)) setConflict(true)
      setStatus('Saved notes updated in another tab. Your current draft was kept.')
    }
    window.addEventListener('storage', syncNotes)
    return () => window.removeEventListener('storage', syncNotes)
  }, [])

  // Writes happen only for explicit actions, never as a side effect of external snapshots.
  async function mutateNotes(mutation) {
    setBusy(true)
    const run = () => {
      let latest = notesRef.current
      if (!sessionOnly.current) {
        try { latest = readContextSnapshot(window.localStorage.getItem(NOTES_STORAGE_KEY)) || latest }
        catch { sessionOnly.current = true; setStorage('session') }
      }
      const result = applyContextNoteMutation(latest, mutation)
      if (result.error) {
        showNotes(latest)
        if (result.error === 'conflict') {
          setConflict(true)
          setStatus('This note changed or was removed in another tab. Select its latest version, or keep your draft as a new task.')
        } else setStatus('Ten notes are already saved. Delete a note before adding or restoring more.')
        return result
      }
      if (!sessionOnly.current) {
        try { window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify({ version: 1, notes: result.notes })) }
        catch { sessionOnly.current = true; setStorage('session') }
      }
      showNotes(result.notes)
      return result
    }
    try {
      // Supported browsers serialize read/modify/write across same-origin tabs.
      if (navigator.locks?.request) return await navigator.locks.request(NOTES_STORAGE_KEY, run)
      return run()
    } finally { setBusy(false) }
  }

  const selectedNote = notes.find(note => note.id === selectedId)
  const dirty = !editingBase || ['title', 'body', 'project'].some(key => draft[key] !== editingBase[key])
  const projectNotes = notes.filter(note => note.project === draft.project)
  const atLimit = notes.length >= MAX_CONTEXT_NOTES && !editingBase
  const canSave = ready && draft.title.trim() && !atLimit && dirty && !conflict && !busy
  const selectedMarkdown = notesMarkdown(selectedNote ? [selectedNote] : [])

  function updateDraft(key, value) {
    setDraft(current => ({ ...current, [key]: value }))
    setStatus('')
  }

  function newDraft() {
    setBase(null)
    setDraft(emptyDraft(draft.project))
    setConfirmClear(false)
    setStatus('New task. Choose a project and capture it below.')
    titleInput.current?.focus()
  }

  function keepDraft() {
    setBase(null)
    setStatus('Draft kept as a new task. Capture it to save a separate note.')
  }

  async function capture(event) {
    event.preventDefault()
    if (!canSave) return
    const now = new Date().toISOString()
    const note = {
      id: editingBase?.id || (globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`),
      title: draft.title.trim(), project: draft.project, body: draft.body,
      createdAt: editingBase?.createdAt || now, updatedAt: now,
    }
    const result = await mutateNotes({ type: 'save', note, base: editingBase })
    if (result.error) return
    setDraft({ title: note.title, project: note.project, body: note.body })
    setBase(note)
    setUndo(null)
    setConfirmClear(false)
    setStatus(editingBase ? 'Changes saved.' : `Captured in ${note.project}.`)
  }

  function openNote(note) {
    setBase(note)
    setDraft({ title: note.title, project: note.project, body: note.body })
    setConfirmClear(false)
    setStatus('Note selected. Edit its fields or copy its saved Markdown.')
  }

  async function deleteNote() {
    if (!editingBase || busy) return
    const result = await mutateNotes({ type: 'delete', base: editingBase })
    if (result.error) return
    setUndo({ notes: result.removed })
    setBase(null)
    setDraft(emptyDraft(draft.project))
    setStatus('Note deleted. Undo is available until the next save or deletion.')
  }

  async function clearNotes() {
    const result = await mutateNotes({ type: 'clear' })
    setUndo({ notes: result.removed })
    setBase(null)
    setDraft(emptyDraft(draft.project))
    setConfirmClear(false)
    setStatus('Notes cleared. Undo is available until the next save or deletion.')
  }

  async function undoChange() {
    const result = await mutateNotes({ type: 'restore', notes: undo.notes })
    if (result.error) return
    setUndo(null)
    setStatus('Notes restored. Newer notes from other tabs were kept.')
  }

  async function copyNote() {
    const copied = await copyWorkbenchText(selectedMarkdown)
    setStatus(copied ? 'Saved note Markdown copied.' : 'Clipboard unavailable. Use Download notes or select the Markdown below.')
  }

  return <figure className={`pv-visual pwb pwb-context ${className}`} aria-label="Context Dock browser workbench">
    <figcaption className="pwb-heading"><span>Context workbench</span><span className="pwb-label">Browser sketch</span></figcaption>
    <div className="pwb-intro"><p>Capture a task. Keep it with its project.</p><span>Browser only; your notes stay local. No native macOS session.</span></div>
    <noscript><p className="pwb-noscript">Enable JavaScript to capture and manage notes. The draft below illustrates task capture and project context; no notes are saved without JavaScript.</p></noscript>
    <div className="pwb-context-artifacts" aria-label="Current task and project preview">
      <div className="pwb-task-paper"><span className="pwb-artifact-label">{editingBase ? 'Note being edited' : 'Task draft'}</span><strong>{draft.title.trim() || 'Untitled task'}</strong><span className="pwb-paper-body">{draft.body.trim() || 'Add the detail you want to keep.'}</span></div>
      <div className="pwb-project-folder"><span className="pwb-folder-tab" aria-hidden="true" /><span className="pwb-artifact-label">Project context</span><strong>{draft.project}</strong><span>{projectNotes.length} saved {projectNotes.length === 1 ? 'note' : 'notes'}</span><div className="pwb-folder-slips" aria-hidden="true">{projectNotes.slice(0, 3).map(note => <span key={note.id}>{note.title}</span>)}</div></div>
    </div>
    <div className="pwb-context-layout">
      <form className="pwb-editor" onSubmit={capture} aria-label={editingBase ? 'Edit selected note' : 'Capture a task'}>
        <div className="pwb-panel-title"><h4>{editingBase ? 'Edit note' : 'Capture a task'}</h4><span>{conflict ? 'Changed in another tab' : editingBase && !dirty ? 'Saved' : 'Unsaved draft'}</span></div>
        <label htmlFor={`${id}-task`}>Task title</label><input ref={titleInput} id={`${id}-task`} value={draft.title} onChange={event => updateDraft('title', event.target.value)} maxLength={160} required disabled={!ready} autoComplete="off" />
        <label htmlFor={`${id}-project`}>Project</label><select id={`${id}-project`} value={draft.project} onChange={event => updateDraft('project', event.target.value)} disabled={!ready}>{CONTEXT_PROJECTS.map(project => <option key={project}>{project}</option>)}</select>
        <label htmlFor={`${id}-body`}>Note <span className="pwb-optional">optional · Markdown supported</span></label><textarea id={`${id}-body`} value={draft.body} onChange={event => updateDraft('body', event.target.value)} maxLength={3000} rows={3} placeholder="What should you remember when you return?" disabled={!ready} />
        {atLimit && <p className="pwb-help">Ten notes saved. Edit a note or delete one before capturing another.</p>}
        {conflict && <p className="pwb-help">Your draft is unchanged. Select the latest saved note to reload it, or keep this draft separately.</p>}
        <div className="pwb-actions">{conflict && <button type="button" onClick={keepDraft}>Keep draft as new task</button>}<button className="pwb-primary" type="submit" disabled={!canSave}>{editingBase ? 'Save changes' : 'Capture note'}</button><button type="button" onClick={newDraft} disabled={!ready}>New task</button>{editingBase && <button className="pwb-danger" type="button" disabled={busy || conflict} onClick={deleteNote}>Delete note</button>}</div>
      </form>
      <div className="pwb-library">
        <div className="pwb-panel-title"><h4>Local notes</h4><span>{notes.length} / {MAX_CONTEXT_NOTES}</span></div>
        {notes.length ? <div className="pwb-note-list" role="group" aria-label="Select a saved note">{notes.map(note => <button key={note.id} type="button" aria-pressed={selectedId === note.id} onClick={() => openNote(note)}><span>{note.title}</span><small>{note.project}</small></button>)}</div> : <p className="pwb-empty">No saved notes yet. Capture your first task to put a note in its project folder.</p>}
        <div className="pwb-library-actions"><button type="button" onClick={copyNote} disabled={!selectedNote}>Copy saved note</button><button type="button" disabled={!notes.length} onClick={() => { downloadWorkbenchText(notesMarkdown(notes), 'context-notes.md'); setStatus('Markdown download prepared with all saved notes.') }}>Download notes .md</button><button className="pwb-danger" type="button" disabled={!notes.length || busy} onClick={() => setConfirmClear(true)}>Clear notes</button></div>
      </div>
    </div>
    {confirmClear && <div className="pwb-confirm" role="group" aria-label="Confirm clearing local notes"><p>Clear all {notes.length} saved notes from this browser?</p><div className="pwb-actions"><button className="pwb-danger" type="button" disabled={busy} onClick={clearNotes}>Clear all notes</button><button type="button" onClick={() => setConfirmClear(false)}>Cancel</button></div></div>}
    {selectedNote && <details className="pwb-export"><summary>Saved Markdown <span aria-hidden="true">+</span></summary><textarea aria-label="Saved note Markdown" readOnly rows={5} value={selectedMarkdown} /></details>}
    <div className="pwb-status-row"><p role="status" aria-live="polite" aria-atomic="true">{status || (storage === 'loading' ? 'Loading local notes…' : storage === 'session' ? 'Browser storage unavailable. Notes last only in this open page.' : 'Notes stay in this browser. No external data calls.')}</p>{undo && <button type="button" disabled={busy} onClick={undoChange}>Undo</button>}</div>
    <div className="pwb-footnote">{storage === 'session' ? 'Storage unavailable; notes exist only in this open page. Download them to keep a copy.' : 'Your browser stores up to ten notes. Download them to keep a separate copy.'}</div>
  </figure>
}

export default ContextWorkbench
