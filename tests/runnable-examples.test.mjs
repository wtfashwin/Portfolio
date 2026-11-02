import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { searchPortfolio } from '../src/ui/portfolio-search.js'

// Independent visitor-facing contract from the existing sources and worked guide.
// Removing a source from the page or an export must fail this contract.
const expectedUrls = [
  'https://wtfashwin.github.io/Portfolio/complaint-ranking/',
  'https://github.com/wtfashwin/pain-pipeline/tree/03148aa9ae8579211081e9672108f13d7e502578',
  'https://gist.github.com/wtfashwin/1997b331f3a4a5dc17c621ee3bd97f3a',
  'https://gist.github.com/wtfashwin/373319b939b76759dd97cf164b1965cb',
  'https://gist.github.com/wtfashwin/aca8c85f3d6d3da1374c5f1e4945c075',
  'https://gist.github.com/wtfashwin/dce7ceedb2214464352997b427bff1fd',
  'https://gist.github.com/wtfashwin/864824eb480b0f01a13bb2d057447ea7',
  'https://gist.github.com/wtfashwin/d4781a7504c871a5531d0403eeb40652',
  'https://gist.github.com/wtfashwin/a082d9456219a0e2ef22d26870361ca7',
]

test('Work exposes all nine teaching links before existing project entries', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const html = renderToStaticMarkup(createElement(App))
    for (const url of expectedUrls) {
      assert.ok(html.includes(`href="${url}"`), `Visible source link missing: ${url}`)
    }
    const work = html.indexOf('id="work"')
    const examples = html.indexOf('id="runnable-examples"')
    const firstProject = html.indexOf('id="invoice-followup"')
    assert.ok(work >= 0 && examples > work && firstProject > examples,
      'Visitors following Work must reach the example block before existing projects')
  } finally {
    await server.close()
  }
})

test('generated reader exports retain six problem groups and the same nine links', async () => {
  const profile = JSON.parse(await readFile(new URL('../public/profile.json', import.meta.url), 'utf8'))
  assert.ok(Array.isArray(profile.runnableExamples), 'Generated profile has no runnable-source collection')
  assert.equal(profile.runnableExamples.length, 6)
  const urls = profile.runnableExamples.flatMap(group => group.links.map(link => link.url))
  assert.equal(urls.length, 9)
  assert.deepEqual([...urls].sort(), [...expectedUrls].sort())
  const alias = await readFile(new URL('../public/portfolio.json', import.meta.url), 'utf8')
  assert.deepEqual(JSON.parse(alias).runnableExamples, profile.runnableExamples)
  for (const name of ['portfolio.md', 'llms.txt']) {
    const text = await readFile(new URL(`../public/${name}`, import.meta.url), 'utf8')
    for (const url of expectedUrls) assert.ok(text.includes(`](${url})`), `${name} is missing a usable source link: ${url}`)
  }
})


test('search finds all six runnable examples and reaches their visible headings', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
  try {
    const { runnableExamples } = await server.ssrLoadModule('/src/data.js')
    const { default: App } = await server.ssrLoadModule('/src/App.jsx')
    const html = renderToStaticMarkup(createElement(App))
    const queries = [
      ['ranking', 'complaint-ranking-title'],
      ['AIRFLOW retry', 'airflow-retry-policy-title'],
      ['integer money', 'csv-meaning-title'],
      ['body-limit', 'api-body-boundary-title'],
      ['duplicate audit', 'csv-duplicate-audit-title'],
      ['precision recall', 'classification-counts-title'],
      ['runnable examples', 'runnable-examples'],
    ]
    for (const [query, target] of queries) {
      const results = searchPortfolio(query, 8, runnableExamples)
      assert.ok(results.some(result => result.target === target), `Search must find the example for: ${query}`)
      assert.equal(results[0]?.target, target, `Search must put the specific example first for: ${query}`)
      assert.equal(html.split(`id="${target}"`).length - 1, 1, `Search destination must be one visible heading: ${target}`)
    }
    assert.equal(searchPortfolio('', 4, runnableExamples).length, 4)
    assert.deepEqual(searchPortfolio('unmatched-xyz-990', 8, runnableExamples), [])
    for (const query of ['fraud queue', 'invoice csv', 'credentials']) {
      assert.deepEqual(searchPortfolio(query, 8, runnableExamples)[0], searchPortfolio(query)[0], `Existing first result changed: ${query}`)
    }
  } finally {
    await server.close()
  }
})
