export const CONTEXT_PROJECTS = ['Context Dock', 'Portfolio', 'Fraud Detection']
export const NOTES_STORAGE_KEY = 'portfolio.context-workbench.v1'
export const MAX_CONTEXT_NOTES = 10

const isDate = value => typeof value === 'string' && value.length <= 32 && Number.isFinite(Date.parse(value))
const validNote = value => value && typeof value === 'object' &&
  typeof value.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(value.id) &&
  typeof value.title === 'string' && value.title.trim().length > 0 && value.title.length <= 160 &&
  CONTEXT_PROJECTS.includes(value.project) && typeof value.body === 'string' && value.body.length <= 3000 &&
  isDate(value.createdAt) && isDate(value.updatedAt)

export function readContextSnapshot(raw) {
  if (raw === null) return []
  if (typeof raw !== 'string' || raw.length > 50000) return null
  try {
    const value = JSON.parse(raw)
    if (value?.version !== 1 || !Array.isArray(value.notes)) return null
    const seen = new Set()
    return value.notes.filter(item => {
      if (!validNote(item) || seen.has(item.id)) return false
      seen.add(item.id)
      return true
    }).slice(0, MAX_CONTEXT_NOTES).map(({ id, title, project, body, createdAt, updatedAt }) => ({ id, title: title.trim(), project, body, createdAt, updatedAt }))
  } catch { return null }
}

export function parseStoredNotes(raw) { return readContextSnapshot(raw) || [] }

export function saveContextNote(notes, note) {
  if (!validNote(note)) return notes
  const index = notes.findIndex(item => item.id === note.id)
  if (index < 0) return notes.length < MAX_CONTEXT_NOTES ? [note, ...notes] : notes
  return notes.map(item => item.id === note.id ? note : item)
}

// Compare the version that was opened, not a live list item changed by another tab.
export function sameContextNote(left, right) {
  return Boolean(left && right) && ['id', 'title', 'project', 'body', 'createdAt', 'updatedAt'].every(key => left[key] === right[key])
}

export function applyContextNoteMutation(latest, mutation) {
  if (mutation.type === 'clear') return { notes: [], removed: latest }
  if (mutation.type === 'restore') {
    const missing = mutation.notes.filter(note => validNote(note) && !latest.some(current => current.id === note.id))
    if (latest.length + missing.length > MAX_CONTEXT_NOTES) return { notes: latest, error: 'capacity' }
    return { notes: [...missing, ...latest] }
  }
  const current = mutation.base && latest.find(note => note.id === mutation.base.id)
  if (mutation.base && !sameContextNote(current, mutation.base)) return { notes: latest, error: 'conflict' }
  if (mutation.type === 'delete') {
    if (!current) return { notes: latest, error: 'conflict' }
    return { notes: latest.filter(note => note.id !== current.id), removed: [current] }
  }
  if (mutation.type === 'save') {
    if (!validNote(mutation.note)) return { notes: latest, error: 'invalid' }
    if (!current && latest.length >= MAX_CONTEXT_NOTES) return { notes: latest, error: 'capacity' }
    return { notes: saveContextNote(latest, mutation.note) }
  }
  return { notes: latest, error: 'invalid' }
}

const markdownTitle = title => title.replace(/[\r\n]+/g, ' ').replace(/([\\`*_{}[\]<>#])/g, '\\$1')
export function notesMarkdown(notes) {
  if (!notes.length) return ''
  return '# Context notes\n\n' + notes.map(note => `## ${markdownTitle(note.title)}\n\nProject: ${note.project}\n\n${note.body || '_No additional note._'}\n`).join('\n---\n\n')
}

export const SUPPORT_SOURCE = 'https://github.com/wtfashwin/Customer-Support-System/blob/main/apps/aiml-service/README.md'
// These short passages only restate the public project summary in data.js and Overlay.jsx.
// They are illustrative search documents, not excerpts from a running support system.
export const SUPPORT_PASSAGES = [
  { id: 'application', title: 'Application and AI service', category: 'api', text: 'A support application connects a TypeScript application with a FastAPI AI service.', source: SUPPORT_SOURCE },
  { id: 'retrieval', title: 'Document ingestion and retrieval', category: 'retrieval', text: 'Document ingestion, embeddings, and search connect to the answer path through retrieval.', source: SUPPORT_SOURCE },
  { id: 'tools', title: 'Tool workflows', category: 'retrieval', text: 'The FastAPI AI service includes retrieval and LangGraph tool workflows.', source: SUPPORT_SOURCE },
  { id: 'streaming', title: 'Streaming responses', category: 'api', text: 'The public support application includes streaming responses alongside its FastAPI AI service and TypeScript application.', source: SUPPORT_SOURCE },
  { id: 'access', title: 'Authorization at the API boundary', category: 'api', text: 'Authorization forwarding and JWT verification make the API boundary inspectable in the public implementation.', source: SUPPORT_SOURCE },
  { id: 'operations', title: 'Request correlation and readiness', category: 'operations', text: 'Request correlation, tracing, and readiness checks are part of the public implementation.', source: SUPPORT_SOURCE },
]

const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'do', 'does', 'for', 'from', 'how', 'i', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'what', 'when', 'where', 'which', 'with'])
export function queryTerms(query) {
  const tokens = String(query).slice(0, 240).toLowerCase().match(/[\p{L}\p{N}]+/gu) || []
  return [...new Set(tokens.filter(token => token.length > 1 && !stopWords.has(token)))].slice(0, 20)
}

export function searchPassages(query, category = 'all') {
  const terms = queryTerms(query)
  return SUPPORT_PASSAGES.filter(passage => category === 'all' || passage.category === category).map(passage => {
    const body = new Set(queryTerms(`${passage.title} ${passage.text}`))
    const title = new Set(queryTerms(passage.title))
    const matchedTerms = terms.filter(term => body.has(term))
    return { passage, matchedTerms, score: matchedTerms.reduce((sum, term) => sum + (title.has(term) ? 3 : 1), 0) }
  }).filter(result => !terms.length || result.score > 0).sort((a, b) => b.score - a.score)
}

export function selectedContextMarkdown(ids) {
  const selected = SUPPORT_PASSAGES.filter(passage => ids.includes(passage.id))
  if (!selected.length) return ''
  return '# Selected support-project context\n\nIllustrative portfolio summary passages. Local keyword search; no generated answer.\n\n' + selected.map(passage => `## ${passage.title}\n\n${passage.text}\n\nSource: ${passage.source}\n`).join('\n')
}

export async function copyWorkbenchText(text) {
  if (!text || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}

export function downloadWorkbenchText(text, filename) {
  if (!text || typeof document === 'undefined') return false
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return true
}
