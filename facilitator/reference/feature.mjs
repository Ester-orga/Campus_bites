/** Reference feature (facilitator fallback): STUDENT10 coupon rules.
 * The server recomputes the subtotal from the menu; it never trusts prices from the browser.
 */
const OFFER = { code: 'STUDENT10', percent: 10, cap: 100, minSubtotal: 299 };

function subtotalOf(items, products) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item?.id);
    const qty = Number.isInteger(item?.qty) && item.qty > 0 ? item.qty : 0;
    return product ? sum + product.price * qty : sum;
  }, 0);
}

export function handle(action, body, ctx) {
  if (action !== 'apply-coupon') return { status: 404, error: `Unknown action: ${action}` };
  const code = String(body?.code ?? '').trim().toUpperCase();
  if (code !== OFFER.code) return { status: 200, valid: false, discount: 0, message: 'That code is not valid.' };
  const subtotal = subtotalOf(body?.items, ctx.products);
  if (subtotal < OFFER.minSubtotal) {
    return { status: 200, valid: false, discount: 0, message: `Add ₹${OFFER.minSubtotal - subtotal} more to use STUDENT10.` };
  }
  const discount = Math.min(OFFER.cap, Math.round(subtotal * OFFER.percent / 100));
  return { status: 200, valid: true, discount, percent: OFFER.percent, cap: OFFER.cap, minSubtotal: OFFER.minSubtotal, message: `STUDENT10 applied. You saved ₹${discount}!` };
}
