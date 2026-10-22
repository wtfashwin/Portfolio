import React, { useCallback, useEffect, useId, useLayoutEffect, useReducer, useRef } from 'react';
import './notebook.css';

const useMeasuredEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const motionCurve = 'cubic-bezier(.22, 1, .36, 1)';

function prefersReducedMotion() {
  return typeof window === 'undefined'
    || typeof window.matchMedia !== 'function'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useMotionScope() {
  const running = useRef(new Set());
  const cancel = useCallback(() => {
    for (const entry of [...running.current]) {
      entry.finish();
      entry.animation.cancel();
    }
  }, []);

  const animate = useCallback((element, keyframes, options, cleanup = () => {}) => {
    if (prefersReducedMotion() || typeof element.animate !== 'function') {
      cleanup();
      return;
    }
    const animation = element.animate(keyframes, options);
    let settled = false;
    const entry = {
      animation,
      finish: () => {
        if (settled) return;
        settled = true;
        running.current.delete(entry);
        cleanup();
      },
    };
    running.current.add(entry);
    animation.finished.then(entry.finish, entry.finish);
  }, []);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handlePreference = () => { if (query?.matches) cancel(); };
    query?.addEventListener?.('change', handlePreference);
    return () => {
      query?.removeEventListener?.('change', handlePreference);
      cancel();
    };
  }, [cancel]);

  return { animate, cancel };
}

export const initialNotebookState = {
  scenario: 'memory',
  memoryMode: 'row-group',
  resultsMode: 'after',
  step: 0,
};

export function notebookReducer(state, action) {
  switch (action.type) {
    case 'scenario':
      return { ...state, scenario: action.scenario };
    case 'memory-mode':
      return { ...state, memoryMode: action.mode, step: 0 };
    case 'results-mode':
      return { ...state, resultsMode: action.mode };
    case 'next':
      return { ...state, step: Math.min(state.step + 1, 6) };
    case 'reset':
      return { ...state, step: 0 };
    default:
      return state;
  }
}

export function getMemoryFrame(state) {
  return {
    completed: state.step,
    active: state.step < 6 ? state.step : null,
    resident: state.step === 6 ? 0 : state.memoryMode === 'whole-file' ? 6 : 1,
  };
}

export function getMemoryArrivals(state, action) {
  if (state.step === 6) return [];
  if (state.memoryMode === 'whole-file') {
    return action.type === 'next' ? [] : [0, 1, 2, 3, 4, 5];
  }
  return [state.step];
}

const illustrativeSamples = [
  { time: 0, value: 2 },
  { time: 1, value: 4 },
  { time: 2, value: 3 },
  { time: 3, value: 3 },
];

export function getIntegrationModel(mode) {
  const observedArea = illustrativeSamples.slice(0, -1).reduce((area, sample, index) => (
    area + sample.value * (illustrativeSamples[index + 1].time - sample.time)
  ), 0);
  const last = illustrativeSamples[illustrativeSamples.length - 1];
  const queryTime = 5;
  const tailArea = mode === 'before' ? last.value * (queryTime - last.time) : 0;
  return { observedArea, tailArea, totalArea: observedArea + tailArea, lastTime: last.time, queryTime };
}

function ExternalMark() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
      <path d="M4 12 12 4M4.5 4H12v7.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SegmentedChoice({ label, options, value, onChange }) {
  return (
    <div className="notebook-choice" role="group" aria-label={label}>
      {options.map(option => (
        <button
          type="button"
          key={option.value}
          className="notebook-choice-button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MemoryExplanation({ state, dispatch, titleId }) {
  const visual = useRef(null);
  const pendingTransfer = useRef(null);
  const { animate, cancel } = useMotionScope();
  const frame = getMemoryFrame(state);
  const wholeFile = state.memoryMode === 'whole-file';
  const finished = frame.completed === 6;

  const changeMemory = action => {
    cancel();
    pendingTransfer.current = null;
    if (action.type === 'memory-mode' && action.mode === state.memoryMode && state.step === 0) return;
    pendingTransfer.current = visual.current && !prefersReducedMotion()
      ? {
        action,
        rects: [...visual.current.querySelectorAll('[data-row-group]')].map(group => group.getBoundingClientRect()),
      }
      : null;
    dispatch(action);
  };

  useMeasuredEffect(() => {
    const transfer = pendingTransfer.current;
    pendingTransfer.current = null;
    if (!transfer || !visual.current || prefersReducedMotion()) return;
    const sourceRects = transfer.rects;
    const container = visual.current;
    const origin = container.getBoundingClientRect();
    const destinations = [...container.querySelectorAll('[data-buffer-unit]')];
    const arrivingGroups = getMemoryArrivals(state, transfer.action);

    arrivingGroups.forEach((groupIndex, index) => {
      const destination = destinations[wholeFile ? groupIndex : 0];
      const source = sourceRects[groupIndex];
      if (!destination || !source) return;
      const target = destination.getBoundingClientRect();
      if (!target.width || !target.height) return;
      const token = document.createElement('span');
      token.className = 'notebook-transfer-token';
      token.textContent = String(groupIndex + 1).padStart(2, '0');
      token.setAttribute('aria-hidden', 'true');
      Object.assign(token.style, {
        left: `${target.left - origin.left}px`,
        top: `${target.top - origin.top}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
      });
      container.append(token);
      destination.style.opacity = '0';
      const dx = source.left + source.width / 2 - target.left - target.width / 2;
      const dy = source.top + source.height / 2 - target.top - target.height / 2;
      animate(token, [
        { transform: `translate(${dx}px, ${dy}px) scale(${source.width / target.width}, ${source.height / target.height})`, opacity: 0.3 },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
      ], {
        duration: wholeFile ? 210 : 280,
        delay: wholeFile ? index * 24 : 0,
        easing: motionCurve,
        fill: 'both',
      }, () => {
        destination.style.opacity = '';
        token.remove();
      });
    });
  }, [state.memoryMode, state.step, animate]);

  return (
    <>
      <div className="notebook-panel" role="region" aria-labelledby={titleId}>
        <div className="notebook-topic">dlt / SQL Server ingestion</div>
        <h2 id={titleId}>A smaller memory boundary.</h2>
        <p className="notebook-insight">
          I changed dlt’s SQL Server ADBC path to ingest Parquet one row group at a time.
          The driver can release each buffer, while one commit per file preserves the transaction.
        </p>

        <SegmentedChoice
          label="Choose an ingestion approach"
          options={[
            { value: 'whole-file', label: 'Whole file' },
            { value: 'row-group', label: 'One row group' },
          ]}
          value={state.memoryMode}
          onChange={mode => changeMemory({ type: 'memory-mode', mode })}
        />

        <div className="notebook-memory-visual" ref={visual} aria-hidden="true">
          <div className="notebook-rail-label">
            <span>Parquet file</span>
            <span>Six equal row groups</span>
          </div>
          <div className="notebook-file-groups">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                className={`notebook-file-group${index < frame.completed ? ' is-processed' : ''}${index === frame.active ? ' is-current' : ''}`}
                key={index}
                data-row-group={index}
              >
                <span className="notebook-group-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="notebook-group-lines"><i /><i /><i /></span>
                <span className="notebook-group-state">
                  {index < frame.completed ? 'Handled' : index === frame.active ? 'Current' : 'Waiting'}
                </span>
              </div>
            ))}
          </div>

          <div className="notebook-buffer-label">
            <span>Driver buffer</span>
            <span className="notebook-buffer-count">
              <strong>{frame.resident}</strong> {frame.resident === 1 ? 'unit held' : 'units held'}
            </span>
          </div>
          <div className="notebook-buffer">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className={`notebook-buffer-unit${index < frame.resident ? ' is-resident' : ''}`}
                data-buffer-unit={index}
              >
                {index < frame.resident && (
                  <span>{wholeFile ? index + 1 : frame.active + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="notebook-status" aria-live="polite" aria-atomic="true">
          <span className="notebook-status-count">{frame.completed}<span> / 6 handled</span></span>
          <span>
            {finished
              ? 'All six groups handled. The buffer is empty.'
              : wholeFile
                ? 'The whole file stays resident until the final step.'
                : `Group ${frame.active + 1} is resident. Earlier groups have been released.`}
          </span>
        </div>

        <div className="notebook-actions">
          <button
            className="notebook-next"
            type="button"
            disabled={finished}
            onClick={() => changeMemory({ type: 'next' })}
          >
            Next step <span aria-hidden="true">→</span>
          </button>
          <button
            className="notebook-reset"
            type="button"
            disabled={state.step === 0}
            onClick={() => changeMemory({ type: 'reset' })}
          >
            Reset
          </button>
          <span className="notebook-action-note">You control the steps.</span>
        </div>
      </div>
      <div className="notebook-footnote">
        <p>Six equal units are a toy model. Real row-group sizes and driver overhead vary.</p>
        <a href="https://github.com/dlt-hub/dlt/pull/3947" target="_blank" rel="noreferrer">
          Read the change <span className="notebook-source-id">dlt #3947</span><ExternalMark />
        </a>
      </div>
    </>
  );
}

function ResultsExplanation({ state, dispatch, titleId, plotId }) {
  const before = state.resultsMode === 'before';
  const model = getIntegrationModel(state.resultsMode);
  const x = time => 42 + time * 78;
  const y = value => 184 - value * 37;
  const samplePoints = illustrativeSamples.map(sample => `${x(sample.time)},${y(sample.value)}`);
  const stepLine = `M${samplePoints[0]} H${x(1)} V${y(4)} H${x(2)} V${y(3)} H${x(3)}`;
  const observedArea = `${stepLine} V184 H42 Z`;

  return (
    <>
      <div className="notebook-panel notebook-results" role="region" aria-labelledby={titleId}>
        <div className="notebook-topic">VictoriaMetrics / time-series queries</div>
        <h2 id={titleId}>A result should stop with the data.</h2>
        <p className="notebook-insight">
          I fixed an integration query that kept adding area after a time series ended.
          When no later sample exists, the calculation now stops at the last observed point.
        </p>

        <SegmentedChoice
          label="Compare integration behavior"
          options={[
            { value: 'before', label: 'Before' },
            { value: 'after', label: 'After' },
          ]}
          value={state.resultsMode}
          onChange={mode => dispatch({ type: 'results-mode', mode })}
        />

        <figure className="notebook-plot">
          <div className="notebook-plot-labels" aria-hidden="true">
            <span>Observed samples</span>
            <span>No later samples</span>
          </div>
          <svg viewBox="0 0 474 208" role="img" aria-labelledby={`${plotId}-title ${plotId}-description`}>
            <title id={`${plotId}-title`}>Illustrative integration {before ? 'before' : 'after'} the fix</title>
            <desc id={`${plotId}-description`}>
              Toy samples at 0, 1, 2 and 3 seconds have values 2, 4, 3 and 3.
              The observed step area is 9 value-seconds. The query is at 5 seconds.
              {before
                ? 'Before: a tail adds 6 unsupported value-seconds, making 15 in total.'
                : 'After: no tail is added beyond the last sample, leaving 9 in total.'}
            </desc>
            <defs>
              <pattern id={`${plotId}-tail`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="7" className="notebook-tail-hatch" />
              </pattern>
            </defs>
            {[1, 2, 3, 4].map(value => (
              <line key={value} x1="42" y1={y(value)} x2="432" y2={y(value)} className="notebook-plot-grid" />
            ))}
            <line x1="42" y1="184" x2="432" y2="184" className="notebook-plot-axis" />
            <path d={observedArea} className="notebook-observed-area" />
            <g
              className={`notebook-tail-region${before ? ' is-visible' : ''}`}
              style={{ transformOrigin: `${x(3)}px 0px` }}
              aria-hidden="true"
            >
              <rect x={x(3)} y={y(3)} width={x(5) - x(3)} height={184 - y(3)} fill={`url(#${plotId}-tail)`} />
              <path d={`M${x(3)} ${y(3)} H${x(5)}`} className="notebook-tail-line" />
            </g>
            <line x1={x(3)} y1="20" x2={x(3)} y2="184" className="notebook-last-sample" />
            <path d={stepLine} className="notebook-sample-line" />
            {illustrativeSamples.map(sample => (
              <circle key={sample.time} cx={x(sample.time)} cy={y(sample.value)} r="4.5" className="notebook-sample-point" />
            ))}
          </svg>
          <div className="notebook-plot-ticks" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map(time => <span key={time}>{time}s</span>)}
          </div>
          <figcaption>
            Toy values: 2, 4, 3, 3 at 0–3s. Last sample: 3s. Query: 5s.
          </figcaption>
        </figure>

        <div className="notebook-result-readout" aria-live="polite" aria-atomic="true">
          <div className="notebook-area-equation">
            <span><strong>{model.observedArea}</strong><small>observed area</small></span>
            <span className="notebook-equation-sign" aria-hidden="true">+</span>
            <span className={before ? 'notebook-tail-value is-added' : 'notebook-tail-value'}>
              <strong>{model.tailArea}</strong><small>unsupported tail</small>
            </span>
            <span className="notebook-equation-sign" aria-hidden="true">=</span>
            <span className="notebook-total-value"><strong>{model.totalArea}</strong><small>value-seconds</small></span>
          </div>
          <p>{before ? 'The last value is extended into a period with no samples.' : 'No area is invented beyond the last observed point.'}</p>
        </div>
      </div>
      <div className="notebook-footnote">
        <p>This fixed toy series explains the boundary. It is not a production query result.</p>
        <a href="https://github.com/VictoriaMetrics/VictoriaMetrics/pull/10974" target="_blank" rel="noreferrer">
          Read the change <span className="notebook-source-id">VictoriaMetrics #10974</span><ExternalMark />
        </a>
      </div>
    </>
  );
}

export default function EngineeringNotebook() {
  const [state, dispatch] = useReducer(notebookReducer, initialNotebookState);
  const integrationBefore = getIntegrationModel('before');
  const integrationAfter = getIntegrationModel('after');
  const id = useId();
  const content = useRef(null);
  const previousHeight = useRef(null);
  const { animate, cancel } = useMotionScope();

  const interact = action => {
    const switching = action.type === 'scenario' && action.scenario !== state.scenario;
    const height = switching ? content.current?.getBoundingClientRect().height : null;
    cancel();
    previousHeight.current = height;
    dispatch(action);
  };

  useMeasuredEffect(() => {
    const fromHeight = previousHeight.current;
    previousHeight.current = null;
    const element = content.current;
    if (fromHeight == null || !element || prefersReducedMotion()) return;
    const toHeight = element.getBoundingClientRect().height;
    if (Math.abs(fromHeight - toHeight) > 1) {
      animate(element, [{ height: `${fromHeight}px` }, { height: `${toHeight}px` }], {
        duration: 280,
        easing: motionCurve,
      });
    }
    const panel = element.querySelector('.notebook-panel');
    if (panel) animate(panel, [
      { opacity: 0.72, transform: 'translateY(4px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 220, easing: motionCurve });
  }, [state.scenario, animate]);

  return (
    <section className="notebook" aria-label="Interactive explanations of public engineering contributions">
      <header className="notebook-header">
        <span>Interactive explanation</span>
        <span className="notebook-model-label">Illustrative model · not a benchmark</span>
      </header>
      <div className="notebook-scenarios" role="group" aria-label="Choose an engineering explanation">
        <button type="button" aria-pressed={state.scenario === 'memory'} onClick={() => interact({ type: 'scenario', scenario: 'memory' })}>
          Bounded memory
        </button>
        <button type="button" aria-pressed={state.scenario === 'results'} onClick={() => interact({ type: 'scenario', scenario: 'results' })}>
          Correct results
        </button>
      </div>
      <div className="notebook-content" ref={content}>
        {state.scenario === 'memory'
          ? <MemoryExplanation state={state} dispatch={interact} titleId={`${id}-memory-title`} />
          : <ResultsExplanation state={state} dispatch={interact} titleId={`${id}-results-title`} plotId={`${id}-integration-plot`} />}
      </div>
      <details id="integration-boundary" className="notebook-footnote">
        <summary>Read the integration boundary calculation</summary>
        <p>Toy values 2, 4, 3 and 3 at 0–3 seconds give {integrationAfter.observedArea} value-seconds of observed step area. The query is at {integrationAfter.queryTime} seconds.</p>
        <p>Before the fix, extending the last value beyond the final sample adds {integrationBefore.tailArea} unsupported value-seconds, making {integrationBefore.totalArea} value-seconds. The corrected calculation stops at the last observed point, leaving {integrationAfter.totalArea} value-seconds.</p>
        <p>This fixed toy series explains the boundary. It is not a production query result.</p>
        <p><a href="https://github.com/VictoriaMetrics/VictoriaMetrics/pull/10974" target="_blank" rel="noreferrer">Read the change <span className="notebook-source-id">VictoriaMetrics #10974</span><ExternalMark /></a></p>
        <a href="#integration-boundary">Link to this explanation</a>
      </details>
    </section>
  );
}
