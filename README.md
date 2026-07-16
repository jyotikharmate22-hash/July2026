# Playwright + TypeScript + Cucumber BDD Framework

Quickstart:

1. Install dependencies

```powershell
npm install
npm run playwright:install
```

2. Run tests

```powershell
node node_modules\@cucumber\cucumber\bin\cucumber-js
```

3. Generate Allure report

```powershell
npm run allure:generate
npm run allure:open
```

Jenkins:
- Use `Jenkins.bat` to run install, tests and open report on Windows agents.
# July2026 E2E (recovered)

This scaffold restores a basic Playwright end-to-end test for the login scenario.

Setup

1. Install dependencies:

```powershell
npm install
```

2. Install Playwright browsers (postinstall runs this automatically):

```powershell
npx playwright install
```

3. Copy `.env.example` to `.env` and update values:

```powershell
copy .env.example .env
```

Run tests

```powershell
npx playwright test
```

Generate Allure report (if you have `allure` commandline installed):

```powershell
npm run allure:generate
npm run allure:open
```

Notes

- The test uses placeholders for selectors and assertions — update `tests/login.spec.js` to match your app.
- Credentials and base URL are read from environment variables.
