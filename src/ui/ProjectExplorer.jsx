import { useState } from 'react'
import { ContextWorkbench } from './ContextWorkbench.jsx'
import { RetrievalWorkbench } from './RetrievalWorkbench.jsx'
import './portfolio-actions.css'

export default function ProjectExplorer({ kind, children }) {
 const [mode,setMode]=useState('try')
 const name=kind==='context'?'Context Dock':'Customer Support System'
 return <div className="project-explorer">
  <div className="project-explorer-tabs" role="group" aria-label={`${name} view`}><button type="button" aria-pressed={mode==='try'} onClick={()=>setMode('try')}>Try it yourself</button><button type="button" aria-pressed={mode==='architecture'} onClick={()=>setMode('architecture')}>Explore the architecture</button></div>
  <div hidden={mode!=='try'}>{kind==='context'?<ContextWorkbench/>:<RetrievalWorkbench/>}</div>
  <div hidden={mode!=='architecture'}>{children}</div>
 </div>
}
