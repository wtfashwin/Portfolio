import { useEffect, useId, useRef, useState } from 'react'
import { searchPortfolio } from './portfolio-search.js'
import './portfolio-actions.css'

export default function CommandPalette() {
 const [open,setOpen]=useState(false)
 const [paused,setPaused]=useState(false)
 const [reduced,setReduced]=useState(false)
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)')
  const sync=()=>setReduced(media.matches)
  sync();media.addEventListener('change',sync)
  try {setPaused(localStorage.getItem('portfolio-background-paused')==='true')} catch {}
  return()=>media.removeEventListener('change',sync)
 },[])
 const toggleMotion=()=>{
  const next=!paused;setPaused(next)
  try {localStorage.setItem('portfolio-background-paused',String(next))} catch {}
  window.dispatchEvent(new CustomEvent('portfolio:background-motion',{detail:{paused:next}}))
 }
 const [query,setQuery]=useState('')
 const [selected,setSelected]=useState(0)
 const dialog=useRef(null)
 const input=useRef(null)
 const listId=useId()
 const results=searchPortfolio(query)
 const show=()=>{setQuery('');setSelected(0);setOpen(true)}
 useEffect(()=>{
  const key=event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setOpen(value=>!value)}}
  window.addEventListener('keydown',key)
  return()=>window.removeEventListener('keydown',key)
 },[])
 useEffect(()=>{
  const element=dialog.current
  if(open&&!element.open){element.showModal();input.current.focus()}
  else if(!open&&element.open)element.close()
 },[open])
 useEffect(()=>{if(open)document.getElementById(`${listId}-option-${selected}`)?.scrollIntoView({block:'nearest'})},[open,selected,listId])
 const navigate=entry=>{
  dialog.current.close()
  setOpen(false)
  const target=document.getElementById(entry.target)
  if(!target)return
  if(target.tagName==='DETAILS')target.open=true
  let ancestor=target.parentElement
  while(ancestor){if(ancestor.tagName==='DETAILS')ancestor.open=true;ancestor=ancestor.parentElement}
  const focusTarget=target.tagName==='DETAILS'?target.querySelector('summary'):target
  if(focusTarget){if(!focusTarget.hasAttribute('tabindex')&&focusTarget.tagName!=='SUMMARY')focusTarget.tabIndex=-1;focusTarget.focus({preventScroll:true})}
  window.location.hash=entry.target
  target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})
 }
 return <>
  <button className="command-trigger" type="button" onClick={show} aria-label="Search and explore portfolio" aria-haspopup="dialog"><svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.4"/></svg><span className="command-trigger-label">Explore</span><kbd>⌘ K</kbd></button>
  <dialog className="command-dialog" ref={dialog} aria-label="Explore the portfolio" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();setOpen(false)}}} onClose={()=>setOpen(false)} onClick={event=>{const rect=dialog.current.getBoundingClientRect();if(event.target===dialog.current&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))setOpen(false)}}>
   <div className="command-search-row"><label className="sr-only" htmlFor={`${listId}-input`}>Search projects, technologies, and sections</label><input ref={input} id={`${listId}-input`} type="search" role="combobox" placeholder="Find a project, skill, or action…" autoComplete="off" value={query} aria-expanded={open} aria-autocomplete="list" aria-controls={`${listId}-results`} aria-activedescendant={results[selected]?`${listId}-option-${selected}`:undefined} onChange={event=>{setQuery(event.target.value);setSelected(0)}} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setSelected(index=>Math.max(0,Math.min(index+1,results.length-1)))}else if(event.key==='ArrowUp'){event.preventDefault();setSelected(index=>Math.max(index-1,0))}else if(event.key==='Enter'&&results[selected]){event.preventDefault();navigate(results[selected])}}}/><button type="button" onClick={()=>setOpen(false)} aria-label="Close portfolio search">×</button></div>
   <ul className="command-results" id={`${listId}-results`} role="listbox" aria-label="Matching portfolio actions">{results.map((entry,index)=><li key={entry.target} role="presentation"><button type="button" id={`${listId}-option-${index}`} role="option" aria-selected={selected===index} onFocus={()=>setSelected(index)} onMouseEnter={()=>setSelected(index)} onClick={()=>navigate(entry)}><span><strong>{entry.title}</strong><small>{entry.description}</small></span><span aria-hidden="true">↗</span></button></li>)}</ul>
   {!results.length&&<p className="command-empty" role="status">No matches. Try a project name, technology, or “credentials”.</p>}
   <button className="command-motion" type="button" onClick={toggleMotion} disabled={reduced}>{reduced?'Background motion paused by system preference':paused?'Resume background motion':'Pause background motion'}</button>
   <div className="command-hint"><span>↑ ↓ to choose · Enter to open</span><span>Esc to close</span></div>
  </dialog>
 </>
}
