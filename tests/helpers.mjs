// Test helpers: build the same view and API the browser uses.
import {PRODUCTS} from '../site/catalog.js';
import {buildView} from '../site/feature-runtime.js';
import * as ui from '../site/feature.js';
import {handle} from '../api/feature.mjs';

export {PRODUCTS, ui, handle};
export {summaryLines, filterProducts} from '../site/feature-runtime.js';

/** A view for a bag like {pizza: 2, fries: 1}. State defaults to ui.initialState(). */
export function makeView(bag = {}, state) {
  const initial = typeof ui.initialState === 'function' ? ui.initialState() : {};
  return buildView({bag, products: PRODUCTS, state: state ?? initial});
}

/** Server context: the menu plus an in-memory store shared across calls. */
export function makeCtx() {
  return {products: PRODUCTS, store: {}};
}

/** The api(action, body) function the frontend receives, wired to the real backend. */
export function apiFrom(ctx = makeCtx()) {
  return async (action, body) => JSON.parse(JSON.stringify(handle(action, body ?? {}, ctx) ?? {}));
}
