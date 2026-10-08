import evidence from '../kaggle-evidence.json'

const metricValue = (value) => typeof value === 'number' && Number.isFinite(value) ? value.toFixed(6) : 'Not verified'
const checkedDate = (value) => {
  const date = new Date(value)
  return value && Number.isFinite(date.getTime()) ? `${date.toISOString().slice(0, 16).replace('T', ' ')} UTC` : 'Not checked'
}

export default function KaggleEvidence({ snapshot = evidence }) {
  const badges = snapshot.badges.filter((badge) => badge.status === 'awarded')
  return (
    <aside className="kaggle-evidence" aria-labelledby="kaggle-heading">
      <div className="kaggle-heading">
        <div>
          <div className="float-label">Kaggle · experiments & competition entries</div>
          <h2 id="kaggle-heading">Kaggle benchmarks</h2>
        </div>
        <a className="ghost" href={snapshot.profile.url} target="_blank" rel="noreferrer">View Kaggle profile ↗</a>
      </div>
      <div className="kaggle-grid">
        {snapshot.competitions.map((entry) => (
          <article className="kaggle-card glass" key={entry.id}>
            <h3><a href={entry.url} target="_blank" rel="noreferrer">{entry.title} ↗</a></h3>
            <dl className="kaggle-metrics">
              <div><dt>Validation · {entry.validationMetric}</dt><dd>{metricValue(entry.validationScore)}</dd></div>
              <div><dt>Kaggle public · {entry.publicMetric}</dt><dd>{entry.scoreState === 'scored' ? metricValue(entry.publicScore) : 'Not verified'}</dd></div>
            </dl>
            <p className="kaggle-scope">{entry.validationScope}</p>
            <div className="kaggle-card-foot">
              {entry.notebookUrl && <a href={entry.notebookUrl} target="_blank" rel="noreferrer">Public notebook ↗</a>}
              <span>Submission: {entry.status.toLowerCase()}</span>
              {entry.submissionRef && <span>Reference {entry.submissionRef}</span>}
              <span>Checked {checkedDate(entry.checkedAt)}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="kaggle-badges">
        <span className="cert-strip-label">Verified badges</span>
        {badges.length ? badges.map((badge) => <a className="cert-pill" key={badge.name} href={badge.evidenceUrl || 'https://www.kaggle.com/progression/badges'} target="_blank" rel="noreferrer" title={`Awarded ${badge.awardedAt || 'date unavailable'}; checked ${checkedDate(badge.checkedAt)}`}>{badge.name}</a>) : <span className="kaggle-scope">Awarded badges are not verified in this snapshot.</span>}
        <a href="https://www.kaggle.com/progression/badges" target="_blank" rel="noreferrer">All badge criteria ↗</a>
      </div>
      <p className="kaggle-note">Validation and Kaggle public scores use different samples. Badges are separate from medals and rankings. Snapshot updated {checkedDate(snapshot.generatedAt)}.</p>
    </aside>
  )
}
