import directory from '../platforms.json'
import feed from '../work-feed.json'
import { latestPublicUpdates, writingEntries, updateDateLabel } from '../workSelectors.js'

const dateLabel = (value) => value?.slice(0, 10) || ''
export default function OnlineProfiles() {
  const writing = writingEntries(directory, feed)
  return (
    <>
      <section id="writing" className="scene">
        <div className="scene-head">
          <h2 className="h1">Writing & research</h2>
          <p className="sub">Technical articles and a research paper I co-authored.</p>
        </div>
        <ul className="writing-list">
          {writing.map((item) => (
            <li key={item.url}>
              <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
              <span>{item.platform}{item.role ? ` · ${item.role}` : ''} · {item.publishedAt ? <time dateTime={item.publishedAt}>{dateLabel(item.publishedAt)}</time> : 'Publication date unavailable'}</span>
            </li>
          ))}
        </ul>
      </section>
      <section id="profiles" className="scene">
        <div className="scene-head">
          <h2 className="h1">Find me online</h2>
          <p className="sub">Code, writing, experiments, and credentials.</p>
        </div>
        <ul className="profile-list">
          {directory.profiles.map((profile) => (
            <li key={profile.platform}>
              <a href={profile.url} target="_blank" rel="noreferrer">{profile.platform}</a>
              <span>{profile.kind}</span><span className="profile-handle">{profile.handle}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export function LatestUpdates() {
  const updates = latestPublicUpdates(feed)
  const source = feed.platforms?.find((platform) => platform.platform === 'GitHub')
  if (!updates.length) return null
  return (
    <section id="updates" className="scene updates-section">
      <div className="scene-head"><h2 className="h1">Recent public work</h2><p className="sub">Repository activity and merged contributions.</p></div>
      <ul className="writing-list">
        {updates.map((item) => <li key={item.url}>
          <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
          <span>{updateDateLabel(item)} · <time dateTime={item.occurredAt}>{dateLabel(item.occurredAt)}</time></span>
        </li>)}
      </ul>
      <p className="feed-note">Checked {dateLabel(source?.fetchedAt)}{source?.status === 'unavailable' ? '. Refresh unavailable; showing the last saved update.' : '.'}</p>
    </section>
  )
}
