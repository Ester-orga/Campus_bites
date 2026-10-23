// Fixed contract tests: every feature must plug into the shop this way.
// Written by humans; no agent can edit this file.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ui, handle, makeView, makeCtx, apiFrom, summaryLines, filterProducts, PRODUCTS} from './helpers.mjs';

const sampleBag = {pizza: 1, fries: 2};

test('Contract: frontend exports feature {name, slot}', () => {
  assert.ok(ui.feature && typeof ui.feature === 'object', 'export const feature = {name, slot}');
  assert.equal(typeof ui.feature.name, 'string');
  assert.ok(ui.feature.name.trim().length > 0, 'feature.name must not be empty');
  assert.ok(['bag', 'menu'].includes(ui.feature.slot), "feature.slot must be 'bag' or 'menu'");
});

test('Contract: initialState() returns a plain object', () => {
  assert.equal(typeof ui.initialState, 'function');
  const state = ui.initialState();
  assert.ok(state && typeof state === 'object' && !Array.isArray(state));
  assert.deepEqual(JSON.parse(JSON.stringify(state)), state, 'state must be JSON-serializable');
});

test('Contract: render(view) returns HTML for empty and full bags', () => {
  assert.equal(typeof ui.render, 'function');
  for (const bag of [{}, sampleBag]) {
    const html = ui.render(makeView(bag));
    assert.equal(typeof html, 'string');
    assert.doesNotMatch(html, /<script/i, 'render must not emit <script>');
  }
});

test('Contract: onAction ignores unknown actions and returns state', async () => {
  assert.equal(typeof ui.onAction, 'function');
  const view = makeView(sampleBag);
  const next = await ui.onAction('unknown-action', {}, view, apiFrom());
  assert.ok(next && typeof next === 'object' && !Array.isArray(next));
});

test('Contract: optional summaryLines / filterProducts have the right shape', () => {
  const view = makeView(sampleBag);
  const lines = summaryLines(ui, view);
  assert.ok(Array.isArray(lines));
  const shown = filterProducts(ui, PRODUCTS, view);
  assert.ok(Array.isArray(shown) && shown.length <= PRODUCTS.length);
});

test('Contract: backend handle() answers unknown actions with status 404', () => {
  assert.equal(typeof handle, 'function');
  const result = handle('unknown-action', {}, makeCtx());
  assert.equal(result?.status, 404);
  assert.doesNotThrow(() => handle('unknown-action', null, makeCtx()));
});
