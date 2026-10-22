import test from 'node:test'
import assert from 'node:assert/strict'
import { searchPortfolio, filterCredentialGroups } from '../src/ui/portfolio-search.js'

test('search locates projects by their real behavior and technologies', () => {
 assert.equal(searchPortfolio('fraud queue')[0].target,'fraud-detection')
 assert.equal(searchPortfolio('swift task')[0].target,'context-dock')
 assert.equal(searchPortfolio('retrieval FastAPI')[0].target,'customer-support-system')
 assert.equal(searchPortfolio('invoice csv')[0]?.target,'invoice-followup')
})
test('search supports keyboard-sized result lists and an empty state', () => {
 assert.equal(searchPortfolio('',4).length,4)
 assert.deepEqual(searchPortfolio('unmatched-xyz-990'),[])
 assert.ok(searchPortfolio('credentials').some(x=>x.target==='certifications-list'))
})
test('credential filters combine query and issuer without altering the source', () => {
 const groups=[{id:'a',items:[{issuer:'Oracle',items:'Cloud Developer',summary:'APIs'},{issuer:'IBM',items:'Data Science',summary:'Python'}]}]
 const snapshot=JSON.stringify(groups)
 assert.equal(filterCredentialGroups(groups,'cloud','Oracle')[0].items.length,1)
 assert.deepEqual(filterCredentialGroups(groups,'cloud','IBM'),[])
 assert.equal(filterCredentialGroups(groups,'python','')[0].items[0].issuer,'IBM')
 assert.equal(JSON.stringify(groups),snapshot)
 assert.equal(filterCredentialGroups(groups,'','')[0].items.length,2)
})
