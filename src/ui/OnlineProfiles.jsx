import directory from '../platforms.json'
import PlatformLogo from './PlatformLogo.jsx'

export default function OnlineProfiles() {
  return <>
    <details className="record-disclosure" id="writing"><summary><span>Writing & research<span>Four technical articles and a co-authored research paper</span></span><span className="disclosure-plus" aria-hidden="true">+</span></summary><div className="disclosure-body"><h3 className="directory-title">Writing & research</h3><ul className="writing-records">{directory.writing.map(item => <li key={item.url}><a href={item.url} target="_blank" rel="noreferrer">{item.title}<span aria-hidden="true">↗</span></a><p>{item.platform}{item.role ? ` · ${item.role}` : ''} · <time dateTime={item.publishedAt}>{item.publishedAt.slice(0, 10)}</time></p></li>)}</ul></div></details>
    <details className="record-disclosure" id="profiles"><summary><span>Find me online<span>Code, writing, experiments, and professional profiles</span></span><span className="disclosure-plus" aria-hidden="true">+</span></summary><div className="disclosure-body"><h3 className="directory-title">Public profiles</h3><div className="profile-records">{directory.profiles.map(profile => <a key={profile.platform} href={profile.url} target="_blank" rel="noreferrer"><PlatformLogo platform={profile.platform} /><span>{profile.platform}</span><span className="profile-record-arrow" aria-hidden="true">↗</span></a>)}</div><p className="record-note">Profile directory checked {directory.checkedAt.slice(0, 10)}. Sources retain their original check dates.</p></div></details>
  </>
}
