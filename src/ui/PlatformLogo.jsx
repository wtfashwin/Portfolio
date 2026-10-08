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
  return (
    <span className="platform-logo" aria-hidden="true">
      <img src={`./platform-logos/${file}`} alt="" width="20" height="20" />
    </span>
  )
}
