/** Reference feature (facilitator fallback): STUDENT10 coupon in the bag. */
export const feature = { name: 'Student coupon', slot: 'bag' };

export function initialState() {
  return { code: '', valid: false, percent: 0, cap: 0, minSubtotal: 0, message: '' };
}

export function render(view) {
  const s = view.state;
  const note = s.message ? `<p class="${s.valid ? 'success' : 'error'}">${view.esc(s.message)}</p>` : '<p>Students save 10% on orders of ₹299 or more.</p>';
  return `<div class="row"><input name="code" placeholder="Enter coupon code" value="${view.esc(s.code)}"/>` +
    `<button data-action="apply">Apply</button></div>${note}`;
}

export async function onAction(action, input, view, api) {
  if (action !== 'apply') return view.state;
  const code = String(input.code ?? '').trim();
  if (!code) return { ...initialState(), message: 'Enter a coupon code.' };
  try {
    const items = view.items.map((i) => ({ id: i.id, qty: i.qty }));
    const r = await api('apply-coupon', { code, items });
    return { code, valid: r.valid === true, percent: r.percent ?? 0, cap: r.cap ?? 0, minSubtotal: r.minSubtotal ?? 0, message: String(r.message ?? '') };
  } catch {
    return { ...view.state, code, valid: false, message: 'Cannot verify this offer right now. Try again.' };
  }
}

export function summaryLines(view) {
  const s = view.state;
  if (!s.valid || view.subtotal < s.minSubtotal) return [];
  const discount = Math.min(s.cap, Math.round(view.subtotal * s.percent / 100));
  return discount > 0 ? [{ label: 'Student offer', amount: -discount }] : [];
}
