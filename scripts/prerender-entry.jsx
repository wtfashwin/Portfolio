import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../src/App.jsx'
import {
  identity, scenes, experience, skills, openSource,
  achievements, certs, achievementGroups,
} from '../src/data.js'
import kaggle from '../src/kaggle-evidence.json'
import directory from '../src/platforms.json'

export function render() {
  return renderToString(<React.StrictMode><App /></React.StrictMode>)
}

// Export the public facts used by the rendered page, including the original
// evidence times. A new build is not a new verification of these facts.
export const portfolio = {
  schemaVersion: 1,
  url: 'https://wtfashwin.github.io/Portfolio/',
  profile: {
    name: identity.name,
    role: identity.role,
    location: identity.location,
    email: identity.email,
    introduction: scenes.hero.sub,
    links: Object.fromEntries(
      ['github', 'linkedin', 'leetcode', 'kaggle', 'credly', 'oss', 'achievements']
        .map((key) => [key, identity.links[key]]),
    ),
  },
  sections: Object.fromEntries(
    ['work', 'capabilities', 'proof', 'contact'].map((key) => [key, {
      heading: scenes[key].h,
      description: scenes[key].sub,
    }]),
  ),
  experience,
  skills,
  openSource: openSource.map(({ repo, num, note, url }) => ({ repo, num, note, url })),
  achievements,
  certifications: certs,
  badgeGroups: achievementGroups,
  kaggle,
  directory,
  writing: directory.writing,
}
