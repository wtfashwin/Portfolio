import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

// Independent visitor-facing contract from the seven verified public sources.
// Removing a source from the page or an export must fail this contract.
const expectedUrls = [
  'https://gist.github.com/wtfashwin/1997b331f3a4a5dc17c621ee3bd97f3a',
  'https://gist.github.com/wtfashwin/373319b939b76759dd97cf164b1965cb',
  'https://gist.github.com/wtfashwin/aca8c85f3d6d3da1374c5f1e4945c075',
  'https://gist.github.com/wtfashwin/dce7ceedb2214464352997b427bff1fd',
  'https://gist.github.com/wtfashwin/864824eb480b0f01a13bb2d057447ea7',
  'https://gist.github.com/wtfashwin/d4781a7504c871a5531d0403eeb40652',
  'https://gist.github.com/wtfashwin/a082d9456219a0e2ef22d26870361ca7',
]

test('Work exposes all seven runnable sources before existing project entries', async () => {
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

test('generated reader exports retain five problem groups and the same seven sources', async () => {
  const profile = JSON.parse(await readFile(new URL('../public/profile.json', import.meta.url), 'utf8'))
  assert.ok(Array.isArray(profile.runnableExamples), 'Generated profile has no runnable-source collection')
  assert.equal(profile.runnableExamples.length, 5)
  const urls = profile.runnableExamples.flatMap(group => group.links.map(link => link.url))
  assert.equal(urls.length, 7)
  assert.deepEqual([...urls].sort(), [...expectedUrls].sort())
  const alias = await readFile(new URL('../public/portfolio.json', import.meta.url), 'utf8')
  assert.deepEqual(JSON.parse(alias).runnableExamples, profile.runnableExamples)
  for (const name of ['portfolio.md', 'llms.txt']) {
    const text = await readFile(new URL(`../public/${name}`, import.meta.url), 'utf8')
    for (const url of expectedUrls) assert.ok(text.includes(`](${url})`), `${name} is missing a usable source link: ${url}`)
  }
})
