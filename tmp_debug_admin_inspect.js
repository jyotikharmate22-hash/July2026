const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  try {
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
  } catch (e) {
    console.error('Login actions failed', e.message);
  }
  await page.waitForLoadState('networkidle');
  console.log('Logged in, navigating to Admin menu');
  try {
    const admin = await page.locator('a').filter({ hasText: /^Admin$/i }).first();
    await admin.click();
  } catch (e) {
    console.error('Admin menu click failed:', e.message);
  }
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  // capture Add form and inputs
  const form = await page.locator('form').first().elementHandle();
  const formHtml = form ? (await form.evaluate(e => e.outerHTML)) : null;
  const pwdInputs = await page.$$eval('input[type="password"]', els => els.map(e => ({ name: e.getAttribute('name'), placeholder: e.getAttribute('placeholder'), outer: e.outerHTML })));
  const elements = await page.$$eval('button, a, span, div, label', els => els.map(e => ({ tag: e.tagName, text: e.innerText, class: e.className, outer: e.outerHTML.slice(0,500) })));
  console.log('Collected', elements.length, 'elements');
  const addCandidates = elements.filter(el => /\bAdd\b/i.test(el.text));
  console.log('Add candidates count:', addCandidates.length);
  console.log(JSON.stringify(addCandidates.slice(0,20), null, 2));
  console.log('Password inputs found:', JSON.stringify(pwdInputs, null, 2));
  if (formHtml) console.log('Form HTML snippet:', formHtml.slice(0,1000));
  const createLoginLabels = elements.filter(el => /create\s+login|create login|login details|password/i.test(el.text));
  console.log('Create/Login-related elements:', JSON.stringify(createLoginLabels.slice(0,20), null, 2));

  await page.screenshot({ path: 'tmp_admin_page.png', fullPage: true });
  console.log('Screenshot saved: tmp_admin_page.png');

  await browser.close();
  process.exit(0);
})();
