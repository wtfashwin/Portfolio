export function latestPublicUpdates(feed) {
  const github = feed.platforms?.find((platform) => platform.platform === 'GitHub')
  return [...(github?.items || [])]
    .filter((item) => !/^https:\/\/github\.com\/wtfashwin\/(portfolio|wtfashwin)(?:\/|$)/i.test(item.url))
    .sort((a, b) => (b.occurredAt || '').localeCompare(a.occurredAt || ''))
    .slice(0, 6)
}
export function writingEntries(directory, feed) {
  const articles = feed.platforms?.find((platform) => platform.platform === 'Medium')?.items || []
  const byUrl = new Map(directory.writing.map((item) => [item.url, item]))
  articles.filter((item) => item.type === 'article').forEach((item) => {
    const baseline = byUrl.get(item.url)
    byUrl.set(item.url, {
      ...baseline, title: item.title, url: item.url, platform: 'Medium',
      publishedAt: item.occurredAt || baseline?.publishedAt || null,
    })
  })
  return [...byUrl.values()].sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
}

export function updateDateLabel(item) {
  if (item.type !== 'merged-pr') return 'Repository update'
  return item.dateKind === 'merged' ? 'Merged PR' : 'Merged PR · last updated'
}
