import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const directory = JSON.parse(await readFile(new URL('../src/platforms.json', import.meta.url), 'utf8'))
const hashnode = directory.profiles.find(profile => profile.platform === 'Hashnode')
const profileUrl = 'https://hashnode.com/@wtfashwin'

test('Hashnode records the checked public profile without inventing published writing', () => {
  assert.equal(hashnode.status, 'verified')
  assert.equal(typeof hashnode.checkedAt, 'string')
  assert.ok(hashnode.checkedAt.startsWith('2026-11-02'))
  assert.ok(Number.isFinite(Date.parse(hashnode.checkedAt)))
  assert.deepEqual(hashnode.evidenceUrls, [profileUrl])
  assert.equal(hashnode.suppliedAt, '2026-10-17')
  assert.equal(hashnode.ownershipMethod, 'user-confirmed')
  assert.match(hashnode.verificationScope, /public name, handle, bio and portfolio link/i)
  assert.match(hashnode.verificationScope, /no articles or publications were listed at this check/i)
  assert.equal(directory.writing.filter(entry => entry.platform === 'Hashnode').length, 0)
})

test('visible profile note and reader exports agree with the dated Hashnode evidence', async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
  try {
    const { default: OnlineProfiles } = await server.ssrLoadModule('/src/ui/OnlineProfiles.jsx')
    const html = renderToStaticMarkup(createElement(OnlineProfiles))
    assert.doesNotMatch(html, /profile content has not been independently verified/)
    assert.ok(html.includes('Hashnode profile checked'))
    assert.ok(html.includes(`dateTime="${hashnode.checkedAt}"`))
    assert.ok(html.includes(hashnode.verificationScope))
    for (const file of ['profile.json', 'portfolio.json']) {
      const profile = JSON.parse(await readFile(new URL(`../public/${file}`, import.meta.url), 'utf8'))
      assert.deepEqual(profile.directory.profiles.find(entry => entry.platform === 'Hashnode'), hashnode)
      assert.equal(profile.writing.filter(entry => entry.platform === 'Hashnode').length, 0)
    }
    for (const file of ['portfolio.md', 'llms.txt']) {
      const text = await readFile(new URL(`../public/${file}`, import.meta.url), 'utf8')
      const line = text.split('\n').find(line => line.startsWith(`- [Hashnode](${profileUrl}):`))
      assert.ok(line?.includes(`checked ${hashnode.checkedAt}`), `${file} must carry the actual check time`)
      assert.ok(line.includes(hashnode.verificationScope), `${file} must retain the checked scope and writing limit`)
      assert.doesNotMatch(line, /user-supplied|not independently verified/)
    }
  } finally {
    await server.close()
  }
})
