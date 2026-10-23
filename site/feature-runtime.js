/** Glue between the shop and the AI-built feature (site/feature.js).
 * Used by the browser (app.js) and by the tests (tests/helpers.mjs), so both
 * call the feature the same way. Agents never edit this file.
 */

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/** True when site/feature.js exports a usable feature. */
export function isInstalled(mod) {
  return Boolean(mod && mod.feature && typeof mod.feature === 'object' && typeof mod.render === 'function');
}

/** The read-only view handed to every feature function. */
export function buildView({bag = {}, products, state = {}}) {
  const items = products
    .filter((p) => (bag[p.id] || 0) > 0)
    .map((p) => ({id: p.id, name: p.name, price: p.price, qty: bag[p.id], category: p.category, veg: p.veg, spicy: p.spicy}));
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  return Object.freeze({items, subtotal, products, state, esc});
}

/** Extra bag lines from the feature, e.g. [{label:'Student offer', amount:-49}]. */
export function summaryLines(mod, view) {
  if (typeof mod?.summaryLines !== 'function') return [];
  const lines = mod.summaryLines(view);
  if (!Array.isArray(lines)) throw new Error('summaryLines must return an array');
  return lines.map((l) => {
    if (typeof l?.label !== 'string' || !Number.isFinite(l?.amount)) throw new Error('summaryLines items need {label:string, amount:number}');
    return {label: l.label, amount: Math.round(l.amount)};
  });
}

/** Dishes to show on the menu after the feature's filter, if any. */
export function filterProducts(mod, products, view) {
  if (typeof mod?.filterProducts !== 'function') return products;
  const shown = mod.filterProducts(products, view);
  if (!Array.isArray(shown)) throw new Error('filterProducts must return an array');
  const ids = new Set(shown.map((p) => p?.id));
  return products.filter((p) => ids.has(p.id));
}
