# 🎸 Music Tech — Playwright E2E

End-to-end test suite for [music-tech-shop](https://music-tech-shop.vercel.app/), written in **TypeScript** with **Playwright** using the **Page Object Model** pattern.

---

## 🚀 Installation

```bash
# 1. Clone the repo
git clone <repo-url>
cd music-tech-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Create the env file
cp .env.example .env
```

The `.env` file defines the base URL of the site under test:

```bash
BASE_URL=https://music-tech-shop.vercel.app/
```

---

## ▶️ Commands

| Command | What it does |
| --- | --- |
| `npm test` | 🧪 Run the whole suite (headless) |
| `npm run test:headed` | 👀 Run tests with the browser visible |
| `npm run test:ui` | 🎛️ Open Playwright's interactive UI mode |
| `npm run test:debug` | 🐛 Run in debug mode, step by step |
| `npm run report` | 📊 Open the last HTML report |
| `npm run typecheck` | ✅ Validate types without compiling |

Run a single file or a specific test:

```bash
npx playwright test tests/login.spec.ts
npx playwright test -g "Login with invalid credentials"
```

---

## 📊 Viewing the report

After running the tests:

```bash
npm run report
```

This opens the HTML report in the browser, with details for each test, screenshots, and traces.
In CI, the report is uploaded as the `playwright-report` artifact (30-day retention).

> 💡 Traces are generated with `trace: 'on-first-retry'`, so they only show up when a test fails and gets retried.

---

## 📁 Project structure

```
music-tech-playwright/
│
├── 📂 .github/workflows/
│   └── playwright.yml       # ⚙️  CI: runs the suite on every push and PR
│
├── 📂 data-test/
│   └── users.json           # 👥 Test data (users by role)
│
├── 📂 pages/                # 🧩 Page Object Model
│   ├── BasePage.ts          #    Base class: goto, waitForPageLoad, reload
│   ├── HomePage.ts          #    Home: login button, user menu
│   └── LoginPage.ts         #    Login: form and error messages
│
├── 📂 tests/
│   └── login.spec.ts        # 🧪 Login specs (valid / invalid)
│
├── 📄 .env.example          # 🔧 Environment variables template
├── 📄 playwright.config.ts  # ⚡ Config: baseURL, reporter, retries, projects
└── 📄 tsconfig.json         # 🟦 TypeScript config
```

### 🧩 About the Page Object Model

Each page exposes its **locators** as `readonly` properties and its **actions** as methods.
`BasePage` centralizes what's common (navigation and waits), so a change in the waiting strategy only needs to be touched in one place:

```ts
const home = new HomePage(page);
await home.goto('/');          // 👈 navigates + waits for load
await home.clickOnLogin();
```

---

## 🤖 Playwright CLI

`playwright-cli` lets you explore the live site from the terminal to **discover real locators** before writing them into a Page Object. It avoids guessing selectors.

```bash
playwright-cli open https://music-tech-shop.vercel.app/   # open the browser
playwright-cli snapshot                                   # accessibility tree with refs (e1, e2, …)
playwright-cli find "Sign in"                              # search for text in the snapshot
playwright-cli click e15                                   # interact using the ref
playwright-cli eval "el => el.getAttribute('data-testid')" e15
playwright-cli close                                        # close the browser
```

Typical flow: `open` → `snapshot` → `find` to locate the element → `eval` to read its `data-testid` → only then write the locator in the Page Object.

---

## 🔄 Workflow

**The Golden Rule: Verify → Commit → Proceed**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI-ASSISTED DEVELOPMENT CYCLE                       │
│                                                                             │
│    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐          │
│    │  PROMPT  │────▶│  REVIEW  │────▶│  VERIFY  │────▶│  COMMIT  │──┐       │
│    │          │     │   CODE   │     │  TESTS   │     │          │  │       │
│    └──────────┘     └──────────┘     └──────────┘     └──────────┘  │       │
│         ▲                                                           │       │
│         └───────────────────────────────────────────────────────────┘       │
│                              Next prompt                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Prompt** — ask for a scoped change, not the whole suite at once.
2. **Review code** — read the diff: are the locators stable? does the assert actually prove something?
3. **Verify tests** — run `npm test` and get it green before calling the step done.
4. **Commit** — one commit per verified change, so you can roll back without losing work.

Never chain prompts on top of code that hasn't been verified: a test that never ran isn't a test.

---

## ⚙️ CI

The [`playwright.yml`](.github/workflows/playwright.yml) workflow runs on every `push` and `pull_request` to `main` / `master`:

install dependencies → install browsers → generate `.env` from `.env.example` → run the suite → upload the report as an artifact.

In CI the config uses `retries: 2` and `workers: 1` to reduce flakiness.
