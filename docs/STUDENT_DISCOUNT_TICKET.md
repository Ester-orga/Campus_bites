# Product-owner ticket: Student discount

**What the presenter types:** `Implement the student discount section in my cart.`

The project attaches the following **business acceptance criteria** to that student-offer ticket. It does not dictate which code or functions the agents write.

- Add a visible coupon input and Apply action in the cart. The starter has no coupon section.
- Entering `STUDENT10` gives 10% off food subtotal of ₹299 or more, rounded to the nearest rupee (₹488 subtotal gives ₹49).
- Maximum discount is ₹100. Delivery charges are not discounted.
- Invalid codes and ineligible orders receive no discount and informative feedback.
- Refresh the calculated discount when the cart changes. Do not retain a discount if the order falls below ₹299.
- For integration with the existing feature endpoint, expose the action `apply-coupon` (request contains `code` and `items`). The response must include `valid` (true or false) and `discount` (a number in ₹, 0 when not valid). The agents choose how to implement it.
- Validate item ID and quantity against server-side catalog prices. Do not trust prices submitted by the browser.
- Show the discount as a separate negative bag line, and keep the existing food app functional.

**How** to implement this is up to the Architect, Backend, and Frontend agents within the reusable two-module plugin interface. The human-controlled independent tests evaluate external behavior. The agents cannot edit those independent tests through their tools.

**Scope of autonomy:** Agents design the plugin and write genuine source code, but they are not general-purpose unrestricted coding agents. The shop host and page-level DOM renderer are trusted infrastructure outside their write scope.
