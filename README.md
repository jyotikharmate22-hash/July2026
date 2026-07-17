# Playwright + TypeScript + Cucumber BDD Framework

Quickstart:

1. Install dependencies

```powershell
npm install
npm run playwright:install
```

2. Run tests

```powershell
npx cucumber-js
```

3. Generate Allure report

```powershell
npm run allure:generate
npm run allure:open
```

Jenkins:
- The pipeline is defined in `Jenkinsfile` for automatic CI execution.
- Jenkins uses:
  - `npm ci`
  - `npx playwright install --with-deps`
  - `npx cucumber-js`
  - `npx allure generate .\allure-results --clean -o .\allure-report`
- The Jenkins Allure plugin publishes results from `allure-results`.
- For Windows/manual usage, use `Jenkins.bat`.
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
