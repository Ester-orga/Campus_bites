/** CampusBites feature slot (backend), served at POST /api/feature/<action>.
 * Empty on purpose: no feature is installed. The Backend agent replaces this
 * whole file with a feature that follows agent_demo/FEATURE_CONTRACT.md.
 */
export function handle(action, body, ctx) {
  return { status: 404, error: 'No feature is installed yet.' };
}
