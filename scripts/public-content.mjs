export function toStructuredData(portfolio) {
  const { profile, certifications, experience, directory, writing } = portfolio
  const currentWork = experience.find((item) => item.when.endsWith('Present'))
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': portfolio.url,
    url: portfolio.url,
    name: `${profile.name} · ${profile.role}`,
    description: profile.introduction,
    mentions: writing.map((item) => ({
      '@type': item.platform === 'TIJER' ? 'ScholarlyArticle' : 'Article',
      name: item.title,
      url: item.url,
      author: { '@id': `${portfolio.url}#person` },
      // A month-only publication date remains in the source export; do not
      // invent a day to satisfy Schema.org's Date format.
      ...(/^\d{4}-\d{2}-\d{2}/.test(item.publishedAt) ? { datePublished: item.publishedAt } : {}),
    })),
    mainEntity: {
      '@type': 'Person',
      '@id': `${portfolio.url}#person`,
      name: profile.name,
      jobTitle: profile.role,
      description: profile.introduction,
      url: portfolio.url,
      email: `mailto:${profile.email}`,
      homeLocation: { '@type': 'Place', name: profile.location },
      sameAs: directory.profiles.filter((item) => item.status === 'verified' && item.kind !== 'Research publication').map((item) => item.url),
      ...(currentWork ? { worksFor: { '@type': 'Organization', name: currentWork.org } } : {}),
      hasCredential: certifications.map((credential) => ({
        '@type': 'EducationalOccupationalCredential',
        name: credential.items,
        url: credential.url,
        recognizedBy: { '@type': 'Organization', name: credential.issuer },
      })),
    },
  }
}

export function toMarkdown(portfolio) {
  const { profile, sections, experience, skills, openSource, achievements, certifications, badgeGroups, kaggle, directory, writing } = portfolio
  const lines = [
    `# ${profile.name}`,
    '',
    `${profile.role} · ${profile.location}`,
    '',
    profile.introduction,
    '',
    `[Portfolio](${portfolio.url}) · [GitHub](${profile.links.github}) · [LinkedIn](${profile.links.linkedin})`,
    '',
    `## ${sections.work.heading}`,
    '',
    sections.work.description,
    '',
  ]
  for (const item of experience) {
    lines.push(`### ${item.role} · ${item.org}`, '', item.when, '', item.flagship, '')
    lines.push(...item.points.slice(0, 3).map((point) => `- ${point}`), '')
    lines.push(`Tools: ${item.tags.join(', ')}.`, '')
    if (item.url) lines.push(`[Source code](${item.url})`, '')
  }
  lines.push(`## ${sections.capabilities.heading}`, '', sections.capabilities.description, '')
  for (const [group, items] of Object.entries(skills)) lines.push(`- ${group}: ${items.join(', ')}.`)
  lines.push('', `## ${sections.proof.heading}`, '', sections.proof.description, '')
  for (const contribution of openSource) {
    lines.push(`- [${contribution.repo} ${contribution.num}](${contribution.url}): ${contribution.note}`)
  }
  lines.push('', `[Full contribution record](${profile.links.oss})`, '', '## Achievements & credentials', '')
  for (const achievement of achievements) lines.push(`- [${achievement.v}](${achievement.url}): ${achievement.l}`)
  lines.push('', '### Certifications', '')
  for (const credential of certifications) lines.push(`- ${credential.issuer}: [${credential.items}](${credential.url})`)
  for (const group of badgeGroups) {
    lines.push('', `### ${group.title}`, '')
    lines.push(...group.items.map((item) => `- ${item}`))
  }
  lines.push('', `[Full achievement record](${profile.links.achievements})`, '', '## Kaggle benchmarks', '')
  for (const competition of kaggle.competitions) {
    lines.push(`### [${competition.title}](${competition.url})`, '')
    lines.push(`- Validation ${competition.validationMetric}: ${competition.validationScore.toFixed(6)}.`,
      `- Kaggle public ${competition.publicMetric}: ${competition.scoreState === 'scored' ? competition.publicScore.toFixed(6) : 'Not verified'}.`,
      `- Validation scope: ${competition.validationScope}.`,
      `- Submission: ${competition.status.toLowerCase()}${competition.submissionRef ? `; reference ${competition.submissionRef}` : ''}.`,
      `- Score checked: ${competition.checkedAt}.`, '')
    if (competition.notebookUrl) lines.push(`[Public notebook](${competition.notebookUrl})`, '')
  }
  lines.push('Validation and Kaggle public scores use different samples. Badges are separate from medals and rankings.', '', '### Earned Kaggle badge dates', '')
  for (const badge of kaggle.badges.filter((item) => item.status === 'awarded')) {
    lines.push(`- [${badge.name}](${badge.evidenceUrl}): awarded ${badge.awardedAt}; checked ${badge.checkedAt}.`)
  }
  lines.push('', `Kaggle snapshot updated: ${kaggle.generatedAt}.`, '', '## Across the web', '', directory.scope, '')
  for (const platform of directory.profiles.filter((item) => item.status === 'verified')) {
    lines.push(`- [${platform.platform}](${platform.url}): ${platform.kind}; handle ${platform.handle}; checked ${platform.checkedAt}.`)
  }
  lines.push('', '### Writing & research', '')
  for (const item of writing) lines.push(`- [${item.title}](${item.url}): ${item.platform}; ${item.role || 'Author'}; published ${item.publishedAt || 'date unavailable'}.`)
  lines.push(`## ${sections.contact.heading}`, '', sections.contact.description, '', `[Email ${profile.email}](mailto:${profile.email})`, '')
  return lines.join('\n')
}
