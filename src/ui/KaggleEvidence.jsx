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
      <details className="kaggle-badges">
        <summary>All {badges.length} awarded badge records <span aria-hidden="true">+</span></summary>
        <div className="kaggle-badge-records">
          {badges.map((badge) => <a className="kaggle-badge-record" key={badge.name} href={badge.evidenceUrl} target="_blank" rel="noreferrer"><span>{badge.name} <span aria-hidden="true">↗</span></span>{badge.awardedAt ? <time dateTime={badge.awardedAt}>Awarded {badge.awardedAt}</time> : <span className="badge-date-note">Award date not recorded</span>}</a>)}
        </div>
      </details>
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
      <p className="kaggle-note">Badge records checked {checkedDate(snapshot.generatedAt)}. Competition scores show their own check times; validation and public scores use different samples.</p>
    </aside>
  )
}
