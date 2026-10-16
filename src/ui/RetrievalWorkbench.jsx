import { useId, useMemo, useState } from 'react'
import { SUPPORT_PASSAGES, copyWorkbenchText, downloadWorkbenchText, queryTerms, searchPassages, selectedContextMarkdown } from './project-workbench-model.js'
import './project-visuals.css'
import './project-workbenches.css'

const filters = [['all', 'All'], ['api', 'API'], ['retrieval', 'Retrieval'], ['operations', 'Operations']]
const presets = [['Authorization', 'How is authorization handled?'], ['Ingestion + retrieval', 'What connects document ingestion and retrieval?'], ['Request correlation', 'What supports request correlation?']]

function Highlight({ text, terms }) {
  const words = text.split(/([\p{L}\p{N}]+)/gu)
  return <>{words.map((word, index) => terms.includes(word.toLowerCase()) ? <mark key={index}>{word}</mark> : word)}</>
}

export function RetrievalWorkbench({ className = '' }) {
  const id = useId()
  const [query, setQuery] = useState('authorization')
  const [submitted, setSubmitted] = useState('authorization')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const [inspectedId, setInspectedId] = useState('access')
  const [comparison, setComparison] = useState('selected')
  const [assemblyOpen, setAssemblyOpen] = useState(false)
  const [status, setStatus] = useState('')
  const results = useMemo(() => searchPassages(submitted, filter), [submitted, filter])
  const terms = queryTerms(submitted)
  const inspected = SUPPORT_PASSAGES.find(passage => passage.id === inspectedId)
  const selectedMarkdown = selectedContextMarkdown(selected)
  const rawText = SUPPORT_PASSAGES.map(passage => `${passage.title}\n${passage.text}`).join('\n\n')
  const selectedText = SUPPORT_PASSAGES.filter(passage => selected.includes(passage.id)).map(passage => `${passage.title}\n${passage.text}`).join('\n\n')

  function search(event) {
    event?.preventDefault()
    setSubmitted(query)
    setStatus('')
  }

  function preset(value) {
    setQuery(value)
    setSubmitted(value)
    setFilter('all')
    setStatus('')
  }

  function togglePassage(passageId) {
    setSelected(current => current.includes(passageId) ? current.filter(value => value !== passageId) : [...current, passageId])
    setInspectedId(passageId)
    setAssemblyOpen(!selected.includes(passageId) || selected.length > 1)
    setStatus('')
  }

  async function copyContext() {
    const copied = await copyWorkbenchText(selectedMarkdown)
    setStatus(copied ? 'Selected context Markdown copied.' : 'Clipboard unavailable. Download the context or select the Markdown below.')
  }

  return <figure className={`pv-visual pwb pwb-retrieval ${className}`} aria-label="Customer Support System local keyword search workbench">
    <figcaption className="pwb-heading"><span>Retrieval workbench</span><span className="pwb-label">Local keyword search</span></figcaption>
    <div className="pwb-intro"><p>Find the passage. Choose the context.</p><span>Keyword search over six illustrative summary passages. No vector database or generated answer.</span></div>
    <noscript><p className="pwb-noscript">Enable JavaScript to search, choose passages, and export context. These passages restate the public project summary; the service README is linked below.</p></noscript>
    <form className="pwb-search" role="search" onSubmit={search} aria-label="Search illustrative support-project passages"><label htmlFor={`${id}-query`}>Ask about the public project</label><div><input id={`${id}-query`} type="search" value={query} maxLength={240} onChange={event => setQuery(event.target.value)} placeholder="Try streaming, JWT, or readiness" autoComplete="off" /><button className="pwb-primary" type="submit">Search</button></div></form>
    <div className="pwb-presets" role="group" aria-label="Preset search questions">{presets.map(([label, value]) => <button key={value} type="button" onClick={() => preset(value)}>{label}</button>)}</div>
    <div className="pwb-filters" role="group" aria-label="Filter passage category">{filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setFilter(value); setStatus('') }}>{label}</button>)}</div>
    <div className="pwb-search-meta" role="status" aria-live="polite" aria-atomic="true"><span>{results.length} {results.length === 1 ? 'passage' : 'passages'}{terms.length ? ` matching “${submitted.trim()}”` : ' in this category'}</span><span>{selected.length} selected</span></div>
    <div className="pwb-passages" role="group" aria-label="Ranked matching passages">
      {results.length ? results.map(({ passage, matchedTerms }, index) => <article className="pwb-passage" key={passage.id} data-selected={selected.includes(passage.id)}>
        <div className="pwb-passage-top"><span>{index + 1}. {filters.find(([value]) => value === passage.category)?.[1]}</span><span>{terms.length ? `${matchedTerms.length} / ${terms.length} keywords` : 'Corpus passage'}</span></div>
        <h4><Highlight text={passage.title} terms={terms} /></h4><p><Highlight text={passage.text} terms={terms} /></p>
        <div className="pwb-passage-actions"><button type="button" aria-pressed={selected.includes(passage.id)} onClick={() => togglePassage(passage.id)}>{selected.includes(passage.id) ? 'Remove from context' : 'Add to context'}</button><button type="button" aria-pressed={inspectedId === passage.id} aria-controls={`${id}-source`} onClick={() => setInspectedId(passage.id)}>Inspect source</button></div>
      </article>) : <div className="pwb-no-results"><h4>No matching passages.</h4><p>Try a literal term such as “streaming”, “JWT”, or “readiness”, or choose All to widen the category.</p><button type="button" onClick={() => { setQuery(''); setSubmitted(''); setFilter('all') }}>Show all six passages</button></div>}
    </div>
    <div id={`${id}-source`} className="pwb-source"><div><span>Inspected passage</span><strong>{inspected.title}</strong></div><a href={inspected.source} target="_blank" rel="noopener noreferrer">Service README <span aria-hidden="true">↗</span></a></div>
    <details className="pwb-context-assembly" open={assemblyOpen} onToggle={event => setAssemblyOpen(event.currentTarget.open)}>
      <summary>Context assembly <span>{selected.length} selected <b aria-hidden="true">+</b></span></summary>
      <div className="pwb-context-panel">
      <div className="pwb-panel-title"><h4>Selected passages</h4><button type="button" onClick={() => { setSelected([]); setAssemblyOpen(false); setStatus('Selection cleared. Search results stay available.') }} disabled={!selected.length}>Clear selection</button></div>
      <div className="pwb-compare" role="group" aria-label="Compare raw and selected context"><button type="button" aria-pressed={comparison === 'raw'} onClick={() => setComparison('raw')}>Raw corpus · 6 passages</button><button type="button" aria-pressed={comparison === 'selected'} onClick={() => setComparison('selected')}>Selected · {selected.length} passages</button></div>
      <div className="pwb-context-text" aria-label={comparison === 'raw' ? 'Raw corpus context' : 'Selected context'}><pre>{comparison === 'raw' ? rawText : selectedText || 'Choose passages above to assemble context. Your selection stays here when you search again.'}</pre></div>
      <div className="pwb-actions"><button type="button" disabled={!selected.length} onClick={copyContext}>Copy selected context</button><button type="button" disabled={!selected.length} onClick={() => { downloadWorkbenchText(selectedMarkdown, 'support-project-context.md'); setStatus('Selected context Markdown download prepared.') }}>Download context .md</button></div>
      {selected.length > 0 && <details className="pwb-export"><summary>Selected Markdown <span aria-hidden="true">+</span></summary><textarea aria-label="Selected context Markdown" readOnly rows={6} value={selectedMarkdown} /></details>}
      </div>
    </details>
    <div className="pwb-status-row"><p role="status" aria-live="polite" aria-atomic="true">{status || 'Search and selections run locally. No external data calls.'}</p></div>
    <div className="pwb-footnote">These are portfolio summaries, not production support documents. Source links open the actual service README.</div>
  </figure>
}

export default RetrievalWorkbench
