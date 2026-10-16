import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'

const moduleURL = new URL('../src/ui/fraud-workbench.js', import.meta.url)
let model
async function workbench() {
  assert.equal(existsSync(moduleURL), true, 'The stateful browser workbench model must exist')
  model ||= import(moduleURL.href)
  return model
}
const input = (id, amount = '24.50') => ({ id, amount, featuresJSON: '' })
const advance = (reducer, state, count = 4) => {
  for (let step = 0; step < count; step++) state = reducer(state, { type: 'step' })
  return state
}

test('validation requires a finite amount and exactly thirty finite numeric features', async () => {
  const { validateTransaction } = await workbench()
  for (const amount of ['', 'Infinity', 'NaN', 'nope']) assert.equal(validateTransaction(input('test', amount)).ok, false)
  for (const featuresJSON of ['{bad}', JSON.stringify([1, 2]), JSON.stringify(Array(30).fill(null)), JSON.stringify(Array(30).fill('1')), `[1e309,${Array(29).fill(0).join(',')}]`]) {
    assert.equal(validateTransaction({ ...input('test'), featuresJSON }).ok, false)
  }
  assert.equal(validateTransaction(input('  ')).ok, false)
  assert.equal(validateTransaction(input('contains spaces')).ok, false)
  assert.equal(validateTransaction(input('bad/id')).ok, false)
  assert.equal(validateTransaction(input('a'.repeat(96))).ok, true)
  assert.equal(validateTransaction(input('a'.repeat(129))).ok, false)
  const result = validateTransaction({ ...input(' test ', '19.5'), featuresJSON: JSON.stringify(Array(30).fill(2)) })
  assert.equal(result.ok, true)
  assert.equal(result.value.id, 'test')
  assert.equal(result.value.features.length, 30)
  assert.equal(result.value.features[0], 2)
  assert.equal(result.value.features[29], 19.5)
})

test('selecting a later job cannot change FIFO processing or another job input', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce } = await workbench()
  const empty = createInitialWorkbench()
  let state = reduce(empty, { type: 'submit', input: input('first', '12') })
  state = reduce(state, { type: 'submit', input: input('second', '80') })
  state = reduce(state, { type: 'select', id: 'second' })
  state = reduce(state, { type: 'step' })
  assert.equal(state.selectedId, 'second')
  assert.equal(state.jobs[0].phase, 'running')
  assert.equal(state.jobs[0].features[29], 12)
  assert.equal(state.jobs[1].phase, 'queued')
  assert.equal(state.jobs[1].features[29], 80)
  assert.deepEqual(empty.jobs, [])
})

test('pending reads stay 202 until a terminal explanation record has been saved', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce, readExplanation } = await workbench()
  let state = reduce(createInitialWorkbench(), { type: 'submit', input: input('receipt') })
  assert.equal(state.notice.http, null, 'submission must not claim a prediction response when no model runs')
  assert.equal(readExplanation(state.jobs[0]).http, 202)
  assert.equal(state.jobs[0].savedResponse, null)
  state = reduce(state, { type: 'step' })
  assert.equal(state.jobs[0].status, 'PENDING')
  assert.equal(state.jobs[0].phase, 'running')
  assert.equal(readExplanation(state.jobs[0]).http, 202)
  state = advance(reduce, state, 3)
  assert.equal(state.jobs[0].status, 'COMPLETED')
  assert.equal(readExplanation(state.jobs[0]).http, 200)
  assert.equal(state.jobs[0].savedResponse.body.explanation.model_executed, false)
  assert.equal(Object.hasOwn(state.jobs[0].savedResponse.body.explanation, 'contributions'), false)
})

test('one injected failure is saved and replay creates a new ID without rewriting it', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce, readExplanation } = await workbench()
  let state = reduce(createInitialWorkbench(), { type: 'submit', input: input('original') })
  state = reduce(state, { type: 'inject-failure' })
  state = advance(reduce, state)
  const failedRecord = JSON.stringify(state.jobs[0])
  assert.equal(state.jobs[0].status, 'FAILED')
  assert.equal(readExplanation(state.jobs[0]).http, 503)
  state = reduce(state, { type: 'replay', id: 'original' })
  assert.equal(state.jobs.length, 2)
  assert.notEqual(state.jobs[1].id, 'original')
  assert.equal(state.jobs[1].replayOf, 'original')
  assert.deepEqual(state.jobs[1].features, state.jobs[0].features)
  state = advance(reduce, state)
  assert.equal(state.jobs[1].status, 'COMPLETED')
  assert.equal(JSON.stringify(state.jobs[0]), failedRecord)
})

test('a duplicate ID returns 409 and preserves both queue and saved record', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce } = await workbench()
  let state = reduce(createInitialWorkbench(), { type: 'submit', input: input('same') })
  state = advance(reduce, state)
  const before = JSON.stringify(state.jobs)
  state = reduce(state, { type: 'submit', input: input('same', '999') })
  assert.equal(state.notice.http, 409)
  assert.equal(JSON.stringify(state.jobs), before)
})

test('capacity never evicts saved jobs and event history stays bounded', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce } = await workbench()
  let state = createInitialWorkbench()
  for (let batch = 0; batch < 4; batch++) state = reduce(state, { type: 'batch' })
  assert.equal(state.jobs.length, 12)
  const before = JSON.stringify(state.jobs)
  state = reduce(state, { type: 'submit', input: input('overflow') })
  assert.equal(state.notice.kind, 'capacity')
  assert.equal(JSON.stringify(state.jobs), before)
  for (let step = 0; step < 48; step++) state = reduce(state, { type: 'step' })
  assert.equal(state.jobs.filter(job => job.status === 'COMPLETED').length, 12)
  assert.equal(state.events.length, 12)
  assert.equal(new Set(state.events.map(event => event.sequence)).size, 12)
})

test('batch submission is atomic when fewer than three slots remain', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce } = await workbench()
  let state = createInitialWorkbench()
  for (let n = 0; n < 10; n++) state = reduce(state, { type: 'submit', input: input(`job-${n}`) })
  const before = JSON.stringify(state.jobs)
  state = reduce(state, { type: 'batch' })
  assert.equal(state.notice.kind, 'capacity')
  assert.equal(JSON.stringify(state.jobs), before)
})

test('pause blocks automatic ticks while manual steps still work', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce } = await workbench()
  let state = reduce(createInitialWorkbench(), { type: 'submit', input: input('manual') })
  assert.strictEqual(reduce(state, { type: 'tick' }), state)
  state = reduce(state, { type: 'play', value: true })
  state = reduce(state, { type: 'tick' })
  assert.equal(state.jobs[0].progress, 25)
  state = reduce(state, { type: 'play', value: false })
  assert.strictEqual(reduce(state, { type: 'tick' }), state)
  state = reduce(state, { type: 'step' })
  assert.equal(state.jobs[0].progress, 50)
})

test('clearing queued work preserves running and terminal records; reset starts a new session', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce } = await workbench()
  let state = reduce(createInitialWorkbench(), { type: 'batch' })
  state = advance(reduce, state)
  state = reduce(state, { type: 'step' })
  state = reduce(state, { type: 'clear-queue' })
  assert.deepEqual(state.jobs.map(job => job.phase), ['saved', 'running'])
  state = reduce(state, { type: 'reset' })
  assert.deepEqual(state.jobs, [])
  assert.deepEqual(state.events, [])
  assert.equal(state.playing, false)
})

test('receipts are explicitly simulated and cannot mutate a saved record', async () => {
  const { createInitialWorkbench, fraudWorkbenchReducer: reduce, createReceipt } = await workbench()
  let state = reduce(createInitialWorkbench(), { type: 'submit', input: input('copy') })
  state = advance(reduce, state)
  const receipt = createReceipt(state.jobs[0])
  assert.equal(receipt.simulation, true)
  assert.equal(receipt.model_executed, false)
  assert.equal(receipt.input.features.length, 30)
  receipt.input.features[0] = 999
  receipt.response.body.status = 'FAKE'
  assert.equal(state.jobs[0].features[0], 0)
  assert.equal(state.jobs[0].savedResponse.body.status, 'COMPLETED')
})
