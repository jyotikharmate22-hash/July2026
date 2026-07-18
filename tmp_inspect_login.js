const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'load', timeout: 60000 });
  console.log('title', await page.title());
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log('after-login', (await page.locator('body').innerText()).slice(0, 2000));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
