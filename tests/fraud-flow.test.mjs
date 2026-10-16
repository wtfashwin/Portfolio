import test from 'node:test'
import assert from 'node:assert/strict'
import { initialFraudFlow, fraudFlowReducer, getFraudFlow } from '../src/ui/fraud-flow.js'

test('an explanation stays pending until the worker saves its result', () => {
 let state = initialFraudFlow
 state = fraudFlowReducer(state, {type:'advance'})
 assert.equal(getFraudFlow(state).record,'PENDING')
 assert.equal(getFraudFlow(state).http,202)
 state = fraudFlowReducer(state, {type:'advance'})
 assert.equal(getFraudFlow(state).record,'COMPLETED')
 assert.equal(getFraudFlow(state).http,null)
 state = fraudFlowReducer(state, {type:'advance'})
 assert.equal(getFraudFlow(state).http,200)
 assert.equal(getFraudFlow(state).finished,true)
 assert.deepEqual(fraudFlowReducer(state,{type:'advance'}),state)
})
test('worker failure remains failed and returns 503 when read', () => {
 let state = fraudFlowReducer(initialFraudFlow,{type:'scenario',scenario:'failure'})
 for(let i=0;i<3;i++) state=fraudFlowReducer(state,{type:'advance'})
 assert.equal(getFraudFlow(state).record,'FAILED')
 assert.equal(getFraudFlow(state).http,503)
 assert.equal(getFraudFlow(state).finished,true)
})
test('a duplicate ID returns 409 without entering the worker queue', () => {
 let state=fraudFlowReducer(initialFraudFlow,{type:'scenario',scenario:'duplicate'})
 state=fraudFlowReducer(state,{type:'advance'})
 assert.equal(getFraudFlow(state).http,409)
 assert.equal(getFraudFlow(state).record,'UNCHANGED')
 assert.equal(getFraudFlow(state).queued,false)
 assert.equal(getFraudFlow(state).finished,true)
 assert.equal(fraudFlowReducer(state,{type:'advance'}).step,1)
})
test('scenario changes and reset clear the preceding trace', () => {
 const failure={scenario:'failure',step:3}
 assert.deepEqual(fraudFlowReducer(failure,{type:'reset'}),{scenario:'failure',step:0})
 assert.deepEqual(fraudFlowReducer(failure,{type:'scenario',scenario:'complete'}),initialFraudFlow)
 assert.deepEqual(fraudFlowReducer(failure,{type:'scenario',scenario:'unknown'}),failure)
})
