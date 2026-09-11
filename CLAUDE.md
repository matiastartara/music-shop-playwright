# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

End-to-end and API test suite (TypeScript + Playwright) for the live site https://music-tech-shop.vercel.app/, using the Page Object Model pattern. There is no application source code here — only tests against a deployed, externally-hosted app. `BASE_URL` in `.env` points at it.

## Commands

```bash
npm test                 # run the whole suite headless
npm run test:headed      # run with the browser visible
npm run test:ui          # Playwright interactive UI mode
npm run test:debug       # step-by-step debug mode
npm run report           # open the last HTML report
npm run typecheck        # tsc --noEmit, validate types without compiling

npx playwright test tests/e2e/login.spec.ts   # run a single file
npx playwright test -g "Login with invalid credentials"   # run by title
```

First-time setup: `npm install`, `npx playwright install`, `cp .env.example .env` (sets `BASE_URL`).

## Architecture

- `pages/` — Page Object Model. `BasePage` centralizes navigation/waiting (`goto`, `waitForPageLoad`, `reloadPage`); every other page class extends it. Locators are `readonly` properties set in the constructor; interactions are methods. Locator collections use plural names (`addToCartButtons`, `cartItems`, `productPrices`, …) since they may resolve to 0, 1, or many elements.
- `pages/utils/parseMoney.ts` — shared helper for parsing `"$1,299.99"`-style text into a `number`; used by both `ProductPage.getProductPrice` and `CartPage.getSubtotal` so money parsing isn't duplicated per page object.
- `tests/e2e/` — browser-driven specs (login, products/search, purchase flow). `tests/api/` — direct API specs against the app's endpoints (e.g. `GET /api/products`) using Playwright's `request` fixture, no browser.
- `data-test/users.json` — the two test accounts (`admin`, `customer`) used across specs; iterate over this array rather than hardcoding credentials in a new test.
- `docs/` — working notes / review docs for the test suite itself (not published, gitignored).

## Conventions specific to this repo

- Cart item locator is deliberately `[data-testid^="cart-item-"][role="article"]`, not just the `data-testid` prefix — the site also emits nested elements like `cart-item-total-price-3` and `cart-item-quantity-3` under the same prefix, which a bare prefix match would incorrectly pick up.
- `cartItems.count()` counts distinct product rows, not total units — a single product with quantity 2 still counts as 1. Don't conflate the two when asserting.
- Compare money amounts with `toBeCloseTo(x, 2)`, not `toBe`, since prices go through string parsing.
- Before indexing into a locator collection (`.nth(0)`, `addToCart(0)`, etc.), assert the collection is populated first (e.g. `toBeVisible()` on `.first()`) so a broken search/filter fails with a clear error instead of an out-of-range index.
- Tests reuse the same two accounts across runs and don't currently isolate cart state between tests/executions — be aware a test can be affected by state left over from a previous run.

## Discovering locators: playwright-cli

Use the `playwright-cli` skill to explore the live site and find real `data-testid`/selectors before writing them into a Page Object, instead of guessing:

```bash
playwright-cli open https://music-tech-shop.vercel.app/
playwright-cli snapshot                 # accessibility tree with refs (e1, e2, …)
playwright-cli find "Sign in"           # locate an element by text
playwright-cli click e15                # interact via ref
playwright-cli eval "el => el.getAttribute('data-testid')" e15
playwright-cli close
```

## CI

`.github/workflows/playwright.yml` runs on every push/PR to `main`/`master`: `npm ci` → install browsers → `cp .env.example .env` → `npx playwright test` → upload `playwright-report/` as an artifact (30-day retention). CI config forces `retries: 2` and `workers: 1` (vs. local defaults of 0 retries / 2 workers) to reduce flakiness. Traces only get recorded `on-first-retry`, so they only appear for tests that failed and were retried.
