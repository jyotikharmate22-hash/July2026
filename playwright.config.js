const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: 0,
  reporter: [ ['list'], ['allure-playwright'] ],
  use: {
    headless: true,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    actionTimeout: 0,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
