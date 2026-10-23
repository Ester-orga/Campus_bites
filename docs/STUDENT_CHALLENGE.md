# Student challenges

## Part 1: Be the product owner (with your own free keys)

Write a feature request the AI team can build, run it from `/office`, and judge the result like a manager.

1. Write a request in 1–3 sentences. Make it testable: say exactly what the user sees and what numbers should come out. Use the menu data (prices, `veg`, `spicy`, `calories`).
2. Run it. If the Architect refuses it or a run fails, read why, rewrite the request, **Reset** and try again.
3. When it passes, read `tests/feature.acceptance.test.mjs`. Are the tests strong enough? Find one case they miss.
4. Hand-write one extra test for that case. Does the agents' code pass it?

Submit: your request, the run ID, the release-gate output, and your extra test with its result.

Ideas: a spicy-food warning, a "student meal under ₹300" filter, a delivery-time estimate, a bag-level "split the bill" calculator.

## Part 2: Track My Order

> A bigger feature that does not fit the single feature slot. Build it with any AI tool you like, after the workshop.

## Your product issue

A student orders a burger from CampusBites. The website shows a confirmation, but no way to track the order. Add a simple **Track My Order** experience using mock data.

## Acceptance criteria

- Show an order ID after mock checkout and provide a link/button to the tracking view.
- Show four states: **Placed → Preparing → Out for Delivery → Delivered**.
- Provide a backend endpoint such as `GET /api/orders/CB-2048` returning `{id, status, updatedAt}` with mock data. You may store mock orders only in memory for this exercise.
- Do not invent GPS, drivers, delivery partners or real payments. This is a simulation.
- Include at least one test each for an existing order, an invalid order ID, and a status change.
- Verify the feature manually in the browser and run automated tests before submitting.

## Suggested agent ownership

Manager + Architect: specify the API response contract and transitions.

Backend Agent: mock order lookup and a status-transition endpoint.

Frontend Agent: order-tracking timeline, loading and error states.

QA Agent: real tests for statuses and failed lookups.

## Bonus (optional)

- Persist mock order status in a local JSON database or SQLite.
- Write a Playwright browser test for the tracking timeline.
- Implement manual human approval before an AI agent merges changes.

## Share your work

Fork the repository, work on a branch named `feature/order-tracking`, include screenshots and test results in a PR. Compare the agent's claims against the changed files and the test output. Never commit API keys.
