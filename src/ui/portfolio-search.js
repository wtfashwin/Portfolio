const normalize = value => String(value || '').normalize('NFKD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim()
const actions = [
 {target:'fraud-detection',title:'Operate the Fraud Detection workbench',description:'Submit jobs, inspect saved records, and explore failure recovery.',keywords:'transactions queue worker jobs failure retry finance celery redis postgres'},
 {target:'context-dock',title:'Capture a task in Context Dock',description:'Create, edit, and export a browser note with project context.',keywords:'swift task notes markdown local developer macos'},
 {target:'customer-support-system',title:'Try retrieval in Customer Support System',description:'Search passages and assemble context from the project summary.',keywords:'retrieval fastapi rag api document query search authorization'},
 {target:'invoice-followup',title:'Try Invoice Followup',description:'Open the free browser invoice queue and editable payment reminder tool.',keywords:'invoice csv import export payment reminder followup freelancer browser local'},
 {target:'certifications-list',title:'Find a credential',description:'Filter the credential records by issuer and subject.',keywords:'certifications credentials oracle ibm cloud courses learning'},
 {target:'proof',title:'Inspect accepted upstream changes',description:'Source links to the checked contribution record.',keywords:'open source merged github contributions prefect dlt victoriametrics unsloth'},
 {target:'work',title:'Explore all projects',description:'Public source, interactive sketches, and engineering details.',keywords:'portfolio projects code applications'},
 {target:'writing',title:'Read writing and research',description:'Technical articles and a co-authored paper.',keywords:'medium hashnode articles writing research paper'},
 {target:'profiles',title:'Find public profiles',description:'Code, experiments, publications, and professional profiles.',keywords:'github linkedin kaggle leetcode profiles'},
 {target:'practice',title:'How I approach engineering',description:'Failure, access boundaries, and recovery.',keywords:'principles approach practice correctness'},
 {target:'about',title:'About Ashwin',description:'Professional experience and education.',keywords:'experience sylox founding engineer education about'},
 {target:'contact',title:'Start a conversation',description:'Email and contact links.',keywords:'contact hire email talk'},
 {target:'hero',title:'Explore the engineering notebook',description:'Bounded memory and time-series calculation explanations.',keywords:'memory parquet notebook bounded time series integration'},
]
export function searchPortfolio(query, limit = 8) {
 const tokens=normalize(query).split(/\s+/).filter(Boolean)
 return actions.map((entry,index)=>({entry,index,haystack:normalize(`${entry.title} ${entry.description} ${entry.keywords}`)}))
  .filter(({haystack})=>tokens.every(token=>haystack.includes(token)))
  .map(item=>({...item,score:tokens.reduce((sum,token)=>sum+(normalize(item.entry.title).includes(token)?3:1),0)}))
  .sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,limit).map(({entry})=>entry)
}
export function filterCredentialGroups(groups,query='',issuer='') {
 const tokens=normalize(query).split(/\s+/).filter(Boolean)
 return groups.map(group=>({...group,items:group.items.filter(item=>(!issuer||item.issuer===issuer)&&tokens.every(token=>normalize(`${item.issuer} ${item.items} ${item.summary}`).includes(token)))})).filter(group=>group.items.length)
}
