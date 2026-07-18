const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 60000 });
  const adminLink = page.getByRole('link', { name: /^Admin$/i }).first();
  console.log('admin link count', await adminLink.count());
  await adminLink.click();
  await page.waitForTimeout(5000);
  console.log('URL', page.url());
  console.log('BODY', await page.locator('body').innerText());
  console.log('BUTTONS', await page.locator('button').evaluateAll((els) => els.map((el) => el.textContent && el.textContent.trim()).filter(Boolean)));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
