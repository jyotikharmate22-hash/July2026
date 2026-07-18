const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 60000 });
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(5000);
  const addButton = page.locator('button').filter({ hasText: 'Add' }).first();
  console.log('add count', await addButton.count());
  if (await addButton.count()) {
    await addButton.click();
    await page.waitForTimeout(5000);
  }
  console.log('page url', page.url());
  console.log('body head', (await page.locator('body').innerText()).slice(0, 3000));
  console.log('body html contains add user', (await page.locator('body').innerHTML()).includes('Add User'));
  console.log('body html contains user role', (await page.locator('body').innerHTML()).includes('User Role'));
  console.log('body html contains username', (await page.locator('body').innerHTML()).includes('Username'));
  console.log('input count', await page.locator('input').count());
  for (let i = 0; i < await page.locator('input').count(); i += 1) {
    const name = await page.locator('input').nth(i).getAttribute('name');
    const placeholder = await page.locator('input').nth(i).getAttribute('placeholder');
    console.log(i, { name, placeholder });
  }
  console.log('buttons', await page.locator('button').evaluateAll((els) => els.map((el) => el.textContent && el.textContent.trim()).filter(Boolean)));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
