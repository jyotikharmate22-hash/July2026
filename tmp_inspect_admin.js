const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', { waitUntil: 'load', timeout: 60000 });
  await page.fill('input[name="username"]', 'Admin');
  await page.fill('input[name="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  const adminLink = page.locator('a').filter({ hasText: 'Admin' }).first();
  console.log('admin-link-count', await adminLink.count());
  if (await adminLink.count()) {
    console.log('admin-link-text', await adminLink.textContent());
    await adminLink.click();
    await page.waitForLoadState('networkidle');
    console.log('admin page body snippet', (await page.locator('body').innerText()).slice(0, 2000));
  }

  const addBtn = page.locator('button').filter({ hasText: /^Add$/ }).first();
  console.log('add-btn-count', await addBtn.count());
  if (await addBtn.count()) {
    await addBtn.click();
    console.log('after add click', (await page.locator('body').innerText()).slice(0, 2000));
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
