export const initialFraudFlow = { scenario: 'complete', step: 0 }
export function fraudFlowReducer(state, action) {
  if (action.type === 'scenario' && ['complete', 'failure', 'duplicate'].includes(action.scenario)) return { scenario: action.scenario, step: 0 }
  if (action.type === 'reset') return { ...state, step: 0 }
  if (action.type === 'advance') return { ...state, step: Math.min(state.step + 1, state.scenario === 'duplicate' ? 1 : 3) }
  return state
}
export function getFraudFlow({ scenario, step }) {
  const duplicate = scenario === 'duplicate'
  const failed = scenario === 'failure'
  const finished = duplicate ? step === 1 : step === 3
  const record = step === 0 ? (duplicate ? 'EXISTING' : 'NOT CREATED') : duplicate ? 'UNCHANGED' : step === 1 ? 'PENDING' : failed ? 'FAILED' : 'COMPLETED'
  const http = step === 0 || (!duplicate && step === 2) ? null : duplicate ? 409 : step === 1 ? 202 : failed ? 503 : 200
  const titles = ['Start with one transaction.', 'The response is not the finish.', failed ? 'Failure has a saved state.' : 'The worker saves the explanation.', failed ? 'A failed job is not a result.' : 'Read the result that was saved.']
  const descriptions = ['Thirty ordered features enter the prediction API. This is an illustrative request, not a model run.', 'The API dispatches an explanation task through Redis. While it is pending, reading the explanation returns 202.', failed ? 'After its retry attempts fail, the worker marks the stored explanation FAILED. It does not return a success-shaped result.' : 'The Celery worker uses the saved preprocessing bundle and persists its feature contributions in PostgreSQL.', failed ? 'Reading a failed explanation returns 503. The failure remains visible to the caller.' : 'The explanation endpoint returns 200 with the completed result. Dispatch and completion are separate guarantees.']
  return {
    record, http, finished, queued: !duplicate && step > 0,
    title: duplicate && step > 0 ? 'Protect the earlier result.' : titles[step],
    description: duplicate && step > 0 ? 'Reusing a transaction ID returns 409. The existing explanation is preserved and no new task is queued.' : descriptions[step],
    action: finished ? 'Trace complete' : step === 0 ? 'Send example' : step === 1 ? 'Run worker' : 'Read explanation',
    endpoint: step === 0 ? '30 ordered features' : duplicate ? 'POST /predict' : step === 2 ? 'Worker → PostgreSQL' : 'GET /explain/{id}',
  }
}
