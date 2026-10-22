import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createServer } from 'vite'

// This build reads only the editorial data module and the public Kaggle snapshot.
// Resume, intake, local notes, and repository history never enter these artifacts.
const root = fileURLToPath(new URL('../', import.meta.url))
const canonicalUrl = 'https://wtfashwin.github.io/Portfolio/'
const evidenceCheckedAt = '2026-10-12'
const publicDirectory = join(root, 'public')
const escapeXml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
}[character]))

const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
try {
  const { identity, experience, skills, openSource, certs, achievements } = await server.ssrLoadModule('/src/data.js')
  const kaggle = JSON.parse(await readFile(join(root, 'src/kaggle-evidence.json'), 'utf8'))
  const directory = JSON.parse(await readFile(join(root, 'src/platforms.json'), 'utf8'))
  const profile = {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    canonicalUrl,
    identity: {
      name: identity.name,
      role: identity.role,
      location: identity.location,
      email: identity.email,
      bio: identity.bio,
      links: identity.links,
    },
    evidenceNotes: {
      generation: 'Generated from the portfolio editorial source. Generation time is not an evidence verification time.',
      professionalExperience: 'Supplied professional summaries. Employer source code is private; public runtime or production outcomes are not asserted.',
      publicProjects: 'Linked source describes implementation; a liveUrl identifies a separately linked tool, prototype or synthetic example. Neither establishes production readiness or measured outcomes.',
      interactiveExplanations: 'Illustrative explanations of engineering concepts. The linked source records are the evidence.',
      platformRecords: 'Dated snapshots. Badge, competition, and profile records retain their separate check times; they are not live statistics.',
      credentials: 'Credential records and verification URLs supplied in the portfolio. These were not independently refreshed during this build.',
    },
    professionalExperience: experience.filter((entry) => !entry.url).map((entry) => ({
      role: entry.role, organization: entry.org, period: entry.when,
      focus: entry.flagship, summary: entry.points, technologies: entry.tags,
      evidenceType: 'supplied professional summary',
    })),
    publicProjects: experience.filter((entry) => entry.url).map((entry) => ({
      name: entry.org, role: entry.role, focus: entry.flagship,
      summary: entry.points, technologies: entry.tags, sourceUrl: entry.url,
      ...(entry.kind ? { kind: entry.kind } : {}),
      ...(entry.liveUrl ? { liveUrl: entry.liveUrl } : {}),
      evidenceType: entry.kind === 'public-example'
        ? 'public source and synthetic reporting example'
        : entry.liveUrl ? 'public source and live validation prototype' : 'public source implementation',
      ...(entry.evidence ? { evidence: entry.evidence } : {}),
    })),
    upstreamContributions: {
      checkedAt: evidenceCheckedAt,
      verifiedMergedTotal: 11,
      verifiedRepositoryTotal: 7,
      selectedCount: openSource.length,
      scope: '11 visible merged upstream PRs authored by wtfashwin across seven repositories were checked on this date. The selected records below are a subset, not the full inventory or a lifetime census. Accepted changes do not imply endorsement or measured production impact.',
      fullRecordUrl: identity.links.oss,
      selected: openSource.map((entry) => ({
        repository: entry.repo, pullRequest: entry.num, title: entry.title,
        summary: entry.note, area: entry.domain, url: entry.url,
        author: 'wtfashwin', status: 'merged', checkedAt: evidenceCheckedAt,
      })),
    },
    skills,
    directory,
    writing: directory.writing,
    credentialRecords: certs.map((entry) => ({
      issuer: entry.issuer, title: entry.items, category: entry.group,
      period: entry.when, summary: entry.summary, url: entry.url,
      ...(entry.verificationUrl ? { verificationUrl: entry.verificationUrl } : {}),
    })),
    platformRecords: {
      kaggle,
      leetcode: {
        checkedAt: '2026-10-08',
        url: identity.links.leetcode,
        summary: achievements.find((entry) => entry.url === identity.links.leetcode)?.v,
        detail: achievements.find((entry) => entry.url === identity.links.leetcode)?.l,
        evidenceType: 'dated profile snapshot; not refreshed during this build',
      },
    },
  }
  const siteUrl = new URL(canonicalUrl)
  const sitemapUrls = [canonicalUrl, ...profile.publicProjects
    .filter(entry => entry.kind === 'public-example' && entry.liveUrl)
    .map(entry => new URL(entry.liveUrl))
    .filter(url => url.origin === siteUrl.origin && url.pathname.startsWith(siteUrl.pathname)
      && (url.pathname.endsWith('/') || url.pathname.endsWith('.html')) && !url.search && !url.hash)
    .map(url => url.href)]

  const llms = `# ${identity.name}

> ${identity.role}. ${identity.location}. ${identity.bio}

## Canonical sources

- [Portfolio](${canonicalUrl}): Human-readable work, public evidence, and contact details.
- [Structured profile](${canonicalUrl}profile.json): Profile, selected source records, and evidence dates.
- [Portfolio JSON](${canonicalUrl}portfolio.json): The same structured profile at the existing public endpoint.
- [Text portfolio](${canonicalUrl}portfolio.md): Public facts, records, and dated sources in Markdown.
- [GitHub](${identity.links.github}): Public projects and contribution records.
- [Complete upstream record](${identity.links.oss}): Merged, open, and closed submissions are distinguished.
- [LinkedIn](${identity.links.linkedin}): Professional profile.
- [Contact](mailto:${identity.email}): Email Ashwin.

## Public projects

${profile.publicProjects.map((entry) => entry.kind === 'public-example'
  ? `- [${entry.name}](${entry.liveUrl}): ${entry.focus}. [Source code](${entry.sourceUrl}). Synthetic example using fictional CSV inputs; no upload, live connector, customer results or production reporting service is established.`
  : entry.liveUrl
    ? `- [${entry.name}](${entry.liveUrl}): ${entry.focus}. [Source code](${entry.sourceUrl}). Public validation prototype; production readiness and measured outcomes are not established.`
    : `- [${entry.name}](${entry.sourceUrl}): ${entry.focus}. Public implementation; deployment and production outcomes are not asserted.`).join('\n')}

## Selected accepted upstream changes

Checked ${evidenceCheckedAt}: 11 visible merged PRs across seven upstream repositories. The ${openSource.length} selected records below are a subset. This is not a lifetime census or a claim of endorsement.

${openSource.map((entry) => `- [${entry.repo} ${entry.num}](${entry.url}): ${entry.note}`).join('\n')}

## Evidence scope

- Professional experience is supplied by Ashwin. Employer code is private; implementation and runtime outcomes are not independently established by this page.
- Interactive notebook flows are illustrative. Use the linked PRs to inspect accepted changes.
- Platform statistics are dated snapshots, not live counters. Kaggle badge records were checked ${kaggle.generatedAt.slice(0, 10)}; competition scores keep their individual check times. LeetCode records were checked 2026-10-08.
- Credentials include professional certifications, course completion certificates, and job simulations. These are distinct categories; source URLs are in profile.json.
- No ranking, speedup, business impact, production readiness, or employer endorsement should be inferred from accepted code or credential records.

## Additional profiles

- [Kaggle](${identity.links.kaggle})
- [LeetCode](${identity.links.leetcode})
- [Credly](${identity.links.credly})

## Public profile directory

Profile evidence dates and user-supplied status are retained separately.

${directory.profiles.map(entry => `- [${entry.platform}](${entry.url}): ${entry.kind}; ${entry.status === 'user-supplied' ? `user-supplied ${entry.suppliedAt}; profile content not independently verified` : `checked ${entry.checkedAt}`}.`).join('\n')}

## Writing and research

${directory.writing.map(entry => `- [${entry.title}](${entry.url}): ${entry.platform}; ${entry.role || 'Author'}; published ${entry.publishedAt}.`).join('\n')}
`
  const markdown = `${llms}\n## Professional experience\n\n${profile.professionalExperience.map(entry => `### ${entry.role} · ${entry.organization}\n\n${entry.period}. Supplied professional summary.\n\n${entry.summary.map(point => `- ${point}`).join('\n')}`).join('\n\n')}\n\n## Credential records\n\n${profile.credentialRecords.map(entry => `- [${entry.title}](${entry.url}): ${entry.issuer}; ${entry.period}; ${entry.category}.`).join('\n')}\n\n## Awarded Kaggle badge records\n\n${kaggle.badges.filter(entry => entry.status === 'awarded').map(entry => `- [${entry.name}](${entry.evidenceUrl}): ${entry.awardedAt ? `awarded ${entry.awardedAt}` : 'award date not recorded'}; checked ${entry.checkedAt}.`).join('\n')}\n\n## Dated competition records\n\n${kaggle.competitions.map(entry => `- [${entry.title}](${entry.url}): validation ${entry.validationMetric} ${entry.validationScore}; public ${entry.publicMetric} ${entry.scoreState === 'scored' ? entry.publicScore : 'not verified'}; checked ${entry.checkedAt}. ${entry.validationScope}`).join('\n')}\n`
  const socialCard = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(identity.name)} — ${escapeXml(identity.role)}</title>
  <desc id="desc">I build AI applications. And the systems behind them.</desc>
  <rect width="1200" height="630" fill="#171613"/>
  <path d="M0 50h1200" stroke="#4b463b"/>
  <circle cx="80" cy="102" r="6" fill="#bd765a"/>
  <text x="102" y="110" fill="#b1ada1" font-family="Arial, sans-serif" font-size="24">${escapeXml(identity.name)} · PUNE, INDIA</text>
  <text x="76" y="258" fill="#edece7" font-family="Arial, sans-serif" font-size="64" letter-spacing="-2">I build AI applications.</text>
  <text x="76" y="338" fill="#edece7" font-family="Arial, sans-serif" font-size="64" letter-spacing="-2">And the systems behind them.</text>
  <path d="M80 399h80" stroke="#bd765a" stroke-width="3"/>
  <text x="80" y="454" fill="#bdb8aa" font-family="Arial, sans-serif" font-size="28">${escapeXml(identity.role)}</text>
  <text x="80" y="564" fill="#8f8a7c" font-family="monospace" font-size="21">wtfashwin.github.io/Portfolio</text>
</svg>
`
  await mkdir(publicDirectory, { recursive: true })
  await Promise.all([
    writeFile(join(publicDirectory, 'profile.json'), `${JSON.stringify(profile, null, 2)}\n`),
    writeFile(join(publicDirectory, 'portfolio.json'), `${JSON.stringify(profile, null, 2)}\n`),
    writeFile(join(publicDirectory, 'portfolio.md'), markdown),
    writeFile(join(publicDirectory, 'llms.txt'), llms),
    writeFile(join(publicDirectory, 'robots.txt'), `User-agent: *\nAllow: /Portfolio/\n\nSitemap: ${canonicalUrl}sitemap.xml\n`),
    writeFile(join(publicDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.map(url => `<url><loc>${escapeXml(url)}</loc></url>`).join('')}</urlset>\n`),
    writeFile(join(publicDirectory, 'social-card.svg'), socialCard),
  ])
  console.log(`Generated public profile: ${profile.publicProjects.length} projects, ${openSource.length} selected upstream PRs, ${certs.length} credential records. Evidence dates retained.`)
} finally {
  await server.close()
}
