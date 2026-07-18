const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'load', timeout: 60000 });
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 60000 });
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  const bodyText = await page.locator('body').innerText();
  console.log(bodyText.slice(0, 6000));
  const buttons = await page.locator('button').evaluateAll((els) => els.map((el) => el.textContent?.trim()).filter(Boolean));
  console.log('BUTTONS', buttons);
  const links = await page.locator('a').evaluateAll((els) => els.map((el) => el.textContent?.trim()).filter(Boolean));
  console.log('LINKS', links.slice(0, 40));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
