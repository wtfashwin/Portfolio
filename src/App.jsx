import Overlay from './ui/Overlay.jsx'
import Nav from './ui/Nav.jsx'
import useScrollTheme from './theme/useScrollTheme.js'

export default function App() {
  useScrollTheme()
  return <><Nav /><Overlay /></>
}
