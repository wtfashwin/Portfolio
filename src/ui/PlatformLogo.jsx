const files = {
  GitHub: 'github.svg', LinkedIn: 'linkedin.png', Kaggle: 'kaggle.png',
  Medium: 'medium.svg', CodePen: 'codepen.svg', LeetCode: 'leetcode.svg',
  GeeksforGeeks: 'geeksforgeeks.svg', Codolio: 'codolio.png', Credly: 'credly.png',
  TIJER: 'tijer.png', Twine: 'twine.png', Collective: 'collective.png',
  PyPI: 'pypi.svg', RemoteOK: 'remoteok.png',
}

export default function PlatformLogo({ platform }) {
  const file = files[platform]
  if (!file) return null
  const source = `./platform-logos/${file}`
  const monochrome = file.endsWith('.svg') || file === 'twine.png'
  return (
    <span className={`platform-logo${monochrome ? ' platform-logo-monochrome' : ''}`} style={monochrome ? { maskImage: `url("${source}")`, WebkitMaskImage: `url("${source}")` } : undefined} data-logo-src={source} aria-hidden="true">
      {!monochrome && <img src={source} alt="" width="26" height="26" />}
    </span>
  )
}
