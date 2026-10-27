import { runnableExamples } from '../data.js'

export default function RunnableExamples() {
  return (
    <section id="runnable-examples" aria-labelledby="runnable-examples-title">
      <div className="project-copy">
        <p className="project-kind">Code / Runnable examples</p>
        <h3 id="runnable-examples-title">Runnable examples</h3>
        <p>Source, fixtures, checks, and limits for five small engineering problems.</p>
      </div>
      {runnableExamples.map(example => (
        <article className="public-tool-entry" key={example.id} aria-labelledby={`${example.id}-title`}>
          <div className="project-copy">
            <h4 className="project-lede" id={`${example.id}-title`}>{example.problem}</h4>
            <p>{example.scope}</p>
          </div>
          <div className="public-tool-links">
            {example.links.map(link => (
              <a className="text-link accent-link" href={link.url} key={link.url} target="_blank" rel="noreferrer">
                {link.label}<span className="external-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}
