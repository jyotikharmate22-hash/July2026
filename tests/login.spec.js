const { test, expect } = require('@playwright/test');

test.describe('Login flow', () => {
  test('should log in with valid credentials', async ({ page }) => {
    await page.goto('/');

    // Replace selectors with real ones from your app
    await page.fill('input[name="username"]', process.env.TEST_USER || 'testuser');
    await page.fill('input[name="password"]', process.env.TEST_PASS || 'password');
    await page.click('button[type="submit"]');

    // Adjust assertion to match your post-login landing page
    await expect(page).toHaveURL(/dashboard|home/);
    await expect(page.locator('text=Logout')).toBeVisible();
  });
});
