// Reference acceptance tests for the Student coupon feature.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ui, handle, makeView, makeCtx, apiFrom, summaryLines} from './helpers.mjs';

test('API: STUDENT10 on a ₹488 bag gives ₹49 off', () => {
  const r = handle('apply-coupon', {code: 'STUDENT10', items: [{id: 'pizza', qty: 1}, {id: 'biryani', qty: 1}]}, makeCtx());
  assert.equal(r.valid, true);
  assert.equal(r.discount, 49);
});

test('API: code is case-insensitive and capped at ₹100', () => {
  const r = handle('apply-coupon', {code: ' student10 ', items: [{id: 'pizza', qty: 10}]}, makeCtx());
  assert.equal(r.discount, 100);
});

test('API: below ₹299 is rejected; server ignores browser prices', () => {
  const r = handle('apply-coupon', {code: 'STUDENT10', items: [{id: 'fries', qty: 1, price: 9999}]}, makeCtx());
  assert.equal(r.valid, false);
  assert.equal(r.discount, 0);
});

test('API: unknown code is rejected', () => {
  const r = handle('apply-coupon', {code: 'FREEFOOD', items: [{id: 'pizza', qty: 2}]}, makeCtx());
  assert.equal(r.valid, false);
});

test('UI: applying STUDENT10 adds a Student offer line to the bag', async () => {
  const view = makeView({pizza: 1, biryani: 1});
  const state = await ui.onAction('apply', {code: 'STUDENT10'}, view, apiFrom());
  const lines = summaryLines(ui, makeView({pizza: 1, biryani: 1}, state));
  assert.deepEqual(lines, [{label: 'Student offer', amount: -49}]);
  assert.match(ui.render(makeView({pizza: 1, biryani: 1}, state)), /saved ₹49/);
});

test('UI: a network failure shows a retry message, not a crash', async () => {
  const failing = async () => { throw new Error('offline'); };
  const state = await ui.onAction('apply', {code: 'STUDENT10'}, makeView({pizza: 2}), failing);
  assert.equal(state.valid, false);
  assert.match(state.message, /try again/i);
});
