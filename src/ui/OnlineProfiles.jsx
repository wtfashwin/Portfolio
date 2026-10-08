import directory from '../platforms.json'
import PlatformLogo from './PlatformLogo.jsx'

const dateLabel = (value) => value?.slice(0, 10) || ''
export default function OnlineProfiles() {
  const writing = directory.writing
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
              <a className="profile-button" href={profile.url} target="_blank" rel="noreferrer"><PlatformLogo platform={profile.platform} />{profile.platform}</a>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
