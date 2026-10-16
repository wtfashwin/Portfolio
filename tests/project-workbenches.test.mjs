import test from 'node:test'
import assert from 'node:assert/strict'
import { parseStoredNotes, saveContextNote, notesMarkdown, searchPassages, queryTerms, selectedContextMarkdown, applyContextNoteMutation, readContextSnapshot } from '../src/ui/project-workbench-model.js'

const note = (index, overrides = {}) => ({ id: `note-${index}`, title: `Task ${index}`, project: 'Context Dock', body: 'Keep the keyboard path clear.', createdAt: '2026-10-16T10:00:00.000Z', updatedAt: '2026-10-16T10:00:00.000Z', ...overrides })

test('invalid storage cannot become a saved note', () => {
  assert.deepEqual(parseStoredNotes('{broken'), [])
  assert.deepEqual(parseStoredNotes(JSON.stringify({ version: 9, notes: [note(1)] })), [])
  const notes = parseStoredNotes(JSON.stringify({ version: 1, notes: [note(1), note(1), note(2, { project: 'unknown' }), note(3, { title: 'x'.repeat(161) }), note(4)] }))
  assert.deepEqual(notes.map(item => item.id), ['note-1', 'note-4'])
})

test('the ten-note limit preserves older notes and still permits edits', () => {
  const notes = Array.from({ length: 10 }, (_, index) => note(index))
  assert.equal(parseStoredNotes(JSON.stringify({ version: 1, notes: [...notes, note(11)] })).length, 10)
  assert.deepEqual(saveContextNote(notes, note(11)), notes)
  const updated = saveContextNote(notes, note(3, { title: 'Updated task' }))
  assert.equal(updated.length, 10)
  assert.equal(updated.find(item => item.id === 'note-3').title, 'Updated task')
  assert.equal(notes[3].title, 'Task 3')
})

test('Markdown export contains actual note text and its selected project', () => {
  const output = notesMarkdown([note(1, { title: 'Shortcut *review*', project: 'Portfolio', body: 'Use **focus** and Escape.' })])
  assert.match(output, /Shortcut \\\*review\\\*/)
  assert.match(output, /Project: Portfolio/)
  assert.match(output, /Use \*\*focus\*\* and Escape\./)
})

test('keyword ranking uses input words and filters the corpus', () => {
  assert.deepEqual(queryTerms('How does REQUEST, request correlation work?'), ['request', 'correlation', 'work'])
  const ranked = searchPassages('request correlation')
  assert.equal(ranked[0].passage.id, 'operations')
  assert.deepEqual(ranked[0].matchedTerms, ['request', 'correlation'])
  assert.ok(searchPassages('streaming', 'api').some(item => item.passage.id === 'streaming'))
  assert.equal(searchPassages('streaming', 'retrieval').length, 0)
  assert.equal(searchPassages('unfindableword').length, 0)
  assert.equal(searchPassages('').length, 6)
})

test('selected context excludes unselected passages and retains their real source', () => {
  const output = selectedContextMarkdown(['access'])
  assert.match(output, /JWT verification/)
  assert.match(output, /apps\/aiml-service\/README\.md/)
  assert.doesNotMatch(output, /Readiness checks/)
  assert.equal(selectedContextMarkdown([]), '')
})


test('a stale tab capture or edit preserves unrelated notes from the latest snapshot', () => {
  const latest = [note(2), note(1)]
  const captured = applyContextNoteMutation(latest, { type: 'save', note: note(3) })
  assert.deepEqual(captured.notes.map(item => item.id), ['note-3', 'note-2', 'note-1'])
  const edited = applyContextNoteMutation(latest, { type: 'save', base: note(1), note: note(1, { title: 'Edited in tab A' }) })
  assert.deepEqual(edited.notes.map(item => item.title), ['Task 2', 'Edited in tab A'])
})

test('stale same-note edits and deletes cannot overwrite a newer note or resurrect a removed one', () => {
  const latest = [note(1, { title: 'Changed in tab B' })]
  for (const type of ['save', 'delete']) {
    const result = applyContextNoteMutation(latest, { type, base: note(1), note: note(1, { title: 'Stale edit' }) })
    assert.equal(result.error, 'conflict')
    assert.deepEqual(result.notes, latest)
  }
  assert.equal(applyContextNoteMutation([], { type: 'save', base: note(1), note: note(1) }).error, 'conflict')
})

test('undo merges removed records without deleting or replacing newer records', () => {
  const latest = [note(2), note(1, { title: 'Newer version' })]
  const restored = applyContextNoteMutation(latest, { type: 'restore', notes: [note(1), note(3)] })
  assert.deepEqual(restored.notes.map(item => item.title), ['Task 3', 'Task 2', 'Newer version'])
  assert.equal(readContextSnapshot('{broken'), null)
  assert.deepEqual(readContextSnapshot(null), [])
})
