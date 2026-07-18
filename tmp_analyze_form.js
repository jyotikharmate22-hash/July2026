const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Login
    const loginUrl = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    
    // Fill login credentials
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForSelector('text=Dashboard', { timeout: 20000 });
    console.log('✓ Logged in successfully');
    
    // Navigate to Admin
    await page.click('a:has-text("Admin")');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    console.log('✓ Navigated to Admin');
    
    // Click Add button
    await page.click('button:has-text("Add")');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    console.log('✓ Clicked Add button');
    
    // Analyze the form structure
    console.log('\n=== ANALYZING FORM STRUCTURE ===');
    const formStructure = await page.evaluate(() => {
      const selects = document.querySelectorAll('[role="combobox"], [role="button"][class*="select"]');
      console.log(`Found ${selects.length} select-like elements`);
      
      const result = [];
      document.querySelectorAll('div[class*="oxd-form"]').forEach((form, idx) => {
        form.querySelectorAll('div[class*="oxd-select"], div[class*="select-wrapper"]').forEach((elem, i) => {
          result.push({
            index: `${idx}-${i}`,
            classes: elem.className,
            textContent: elem.textContent.substring(0, 50),
            html: elem.outerHTML.substring(0, 100)
          });
        });
      });
      
      return result;
    });
    
    console.log('Form elements:', JSON.stringify(formStructure, null, 2));
    
    // Try different selectors
    console.log('\n=== TRYING DIFFERENT SELECTORS ===');
    
    // Try clicking on any dropdown
    const anySelectDiv = page.locator('div[class*="select"]').first();
    console.log(`Looking for select divs...`);
    const selectDivCount = await page.locator('div[class*="select"]').count();
    console.log(`Found ${selectDivCount} select divs`);
    
    // Try finding by data-testid
    const byTestId = await page.locator('[data-testid]').count();
    console.log(`Found ${byTestId} elements with data-testid`);
    
    // List all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`Found ${buttonCount} buttons total`);
    
    // Check for buttons with "-- Select"
    let selectButtons = [];
    for (let i = 0; i < buttonCount; i++) {
      const btn = buttons.nth(i);
      const text = await btn.textContent();
      if (text.includes('Select')) {
        selectButtons.push({ index: i, text: text.trim() });
        console.log(`  Button ${i}: "${text.trim()}"`);
      }
    }
    
    // Take screenshot of page source analysis
    await page.screenshot({ path: 'tmp_page_analysis.png', fullPage: true });
    
    // Try using keyboard to interact with dropdowns
    console.log('\n=== ATTEMPTING KEYBOARD INTERACTION ===');
    
    // Focus on first input/select
    await page.locator('input, div[role="button"]').first().focus();
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    
    // Press Tab to navigate to first "select"
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
    }
    
    // Try to find the form container and list all elements
    console.log('\n=== LISTING ALL FORM INPUTS ===');
    const formInputs = await page.evaluate(() => {
      const inputs = [];
      document.querySelectorAll('input, [role="combobox"], [role="button"]').forEach((el, idx) => {
        if (el.offsetParent !== null) { // visible elements only
          inputs.push({
            tag: el.tagName,
            type: el.getAttribute('type'),
            placeholder: el.getAttribute('placeholder'),
            role: el.getAttribute('role'),
            class: el.className.substring(0, 100),
            text: el.textContent?.substring(0, 50),
            visible: el.offsetParent !== null
          });
        }
      });
      return inputs;
    });
    
    console.log('Visible form elements:');
    formInputs.forEach((el, i) => {
      console.log(`  [${i}] ${el.tag} role="${el.role}" type="${el.type}" text="${el.text}" placeholder="${el.placeholder}"`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'tmp_error_analysis.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
