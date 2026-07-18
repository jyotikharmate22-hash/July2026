const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 60000 });
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const addButton = page.locator('button').filter({ hasText: /^Add$/ }).first();
  console.log('add-button-count', await addButton.count());
  if (await addButton.count()) {
    await addButton.click();
    await page.waitForTimeout(3000);
    console.log(await page.locator('body').innerText());
  }
  console.log('BUTTONS', await page.locator('button').evaluateAll((els) => els.map((el) => el.textContent && el.textContent.trim()).filter(Boolean)));
  console.log('INPUTS', await page.locator('input').evaluateAll((els) => els.map((el) => el.getAttribute('placeholder') || el.getAttribute('name') || el.getAttribute('type')).filter(Boolean)));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
