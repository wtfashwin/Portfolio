import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const componentPath = fileURLToPath(new URL('../src/ui/EngineeringNotebook.jsx', import.meta.url));
const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'engineering-notebook-test-'));
const bundlePath = path.join(temporaryDirectory, 'notebook.mjs');
after(() => rm(temporaryDirectory, { recursive: true, force: true }));

await build({
  entryPoints: [componentPath],
  outfile: bundlePath,
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  loader: { '.css': 'empty' },
  plugins: [{
    name: 'share-react-with-server-renderer',
    setup(builder) {
      builder.onResolve({ filter: /^react(?:\/.*)?$/ }, ({ path: moduleName }) => ({
        path: require.resolve(moduleName),
        external: true,
      }));
    },
  }],
  logLevel: 'silent',
});

const notebook = await import(pathToFileURL(bundlePath).href);
const { notebookReducer, initialNotebookState, getMemoryFrame, getIntegrationModel } = notebook;

test('row-group processing keeps one unit resident and releases the final group', () => {
  let state = { ...initialNotebookState };
  const held = [], completed = [];
  for (let step = 0; step <= 6; step++) {
    const frame = getMemoryFrame(state);
    held.push(frame.resident);
    completed.push(frame.completed);
    state = notebookReducer(state, { type: 'next' });
  }
  assert.deepEqual(held, [1, 1, 1, 1, 1, 1, 0]);
  assert.deepEqual(completed, [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(state.step, 6, 'repeated next actions must stay at the terminal step');
});

test('whole-file processing retains six units until the last step and then releases them', () => {
  let state = notebookReducer({ ...initialNotebookState }, { type: 'memory-mode', mode: 'whole-file' });
  const held = [];
  for (let step = 0; step <= 6; step++) {
    held.push(getMemoryFrame(state).resident);
    state = notebookReducer(state, { type: 'next' });
  }
  assert.deepEqual(held, [6, 6, 6, 6, 6, 6, 0]);
});

test('reset and approach changes restart at the first group', () => {
  let state = notebookReducer({ ...initialNotebookState, step: 4 }, { type: 'reset' });
  assert.equal(getMemoryFrame(state).active, 0);
  assert.equal(getMemoryFrame(state).completed, 0);
  state = notebookReducer({ ...state, step: 3 }, { type: 'memory-mode', mode: 'whole-file' });
  assert.equal(state.step, 0);
  assert.equal(getMemoryFrame(state).resident, 6);
});

test('the corrected calculation removes only the unsupported tail', () => {
  let state = notebookReducer({ ...initialNotebookState }, { type: 'results-mode', mode: 'before' });
  assert.deepEqual(getIntegrationModel(state.resultsMode), {
    observedArea: 9, tailArea: 6, totalArea: 15, lastTime: 3, queryTime: 5,
  });
  state = notebookReducer(state, { type: 'results-mode', mode: 'after' });
  assert.deepEqual(getIntegrationModel(state.resultsMode), {
    observedArea: 9, tailArea: 0, totalArea: 9, lastTime: 3, queryTime: 5,
  });
});

test('whole-file steps retain resident units instead of replaying file loading', () => {
  assert.equal(typeof notebook.getMemoryArrivals, 'function', 'the visual must distinguish arrival from retention');
  const wholeFile = { ...initialNotebookState, memoryMode: 'whole-file', step: 3 };
  assert.deepEqual(notebook.getMemoryArrivals(wholeFile, { type: 'next' }), []);
  assert.deepEqual(notebook.getMemoryArrivals({ ...wholeFile, step: 0 }, { type: 'reset' }), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(notebook.getMemoryArrivals({ ...wholeFile, step: 0 }, { type: 'memory-mode' }), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(notebook.getMemoryArrivals({ ...initialNotebookState, step: 2 }, { type: 'next' }), [2]);
  assert.deepEqual(notebook.getMemoryArrivals({ ...initialNotebookState, step: 6 }, { type: 'next' }), []);
});

test('the server-rendered notebook exposes its explanation, source, and correct heading level', () => {
  const html = renderToStaticMarkup(React.createElement(notebook.default));
  assert.match(html, /Interactive explanation/);
  assert.match(html, /Illustrative model/);
  assert.match(html, /https:\/\/github.com\/dlt-hub\/dlt\/pull\/3947/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /<h2[^>]*>A smaller memory boundary\.<\/h2>/);
  assert.doesNotMatch(html, /notebook-transfer-token/);
});
