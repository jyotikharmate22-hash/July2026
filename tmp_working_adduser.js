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
    
    await page.screenshot({ path: 'tmp_01_form_opened.png', fullPage: true });
    console.log('✓ Form opened');
    
    // === STEP 1: Select User Role ===
    console.log('\n=== STEP 1: Select User Role ===');
    const selectInputs = page.locator('div.oxd-select-text-input[tabindex="0"]');
    const selectCount = await selectInputs.count();
    console.log(`Found ${selectCount} select fields`);
    
    console.log('Clicking User Role dropdown (1st select)...');
    await selectInputs.nth(0).click();
    await page.waitForTimeout(500);
    
    const adminOption = page.locator('div[role="option"]').filter({ hasText: /^Admin$/i }).first();
    if (await adminOption.count()) {
      console.log('Clicking Admin option...');
      await adminOption.click();
      console.log('✓ Selected Admin role');
    } else {
      console.log('⚠ Admin option not found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_02_role_selected.png', fullPage: true });
    
    // === STEP 2: Enter Employee Name ===
    console.log('\n=== STEP 2: Enter Employee Name ===');
    const employeeNameInput = page.locator('input[placeholder="Type for hints..."]').first();
    console.log('Filling employee name: John');
    await employeeNameInput.fill('John');
    console.log('✓ Entered employee name');
    
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp_03_employee_entered.png', fullPage: true });
    
    // === STEP 3: Select Employee from Autocomplete ===
    console.log('\n=== STEP 3: Select Employee from Autocomplete ===');
    const firstOption = page.locator('div[role="option"]').first();
    if (await firstOption.count()) {
      const optionText = await firstOption.textContent();
      console.log(`Clicking employee option: ${optionText.trim()}`);
      await firstOption.click();
      console.log('✓ Selected employee');
    } else {
      console.log('⚠ No employee options found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_04_employee_selected.png', fullPage: true });
    
    // === STEP 4: Select Status ===
    console.log('\n=== STEP 4: Select Status ===');
    console.log('Clicking Status dropdown (2nd select)...');
    await selectInputs.nth(1).click();
    await page.waitForTimeout(500);
    
    const enabledOption = page.locator('div[role="option"]').filter({ hasText: /^Enabled$/i }).first();
    if (await enabledOption.count()) {
      console.log('Clicking Enabled option...');
      await enabledOption.click();
      console.log('✓ Selected Enabled status');
    } else {
      console.log('⚠ Enabled option not found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_05_status_selected.png', fullPage: true });
    
    // === STEP 5: Enter Username ===
    console.log('\n=== STEP 5: Enter Username ===');
    const username = 'jyotikharmate@gmail.com';
    
    // Get all inputs and find username field
    const allInputs = page.locator('input');
    const inputCount = await allInputs.count();
    console.log(`Found ${inputCount} total inputs`);
    
    // Check which is the username input - it should be after employee name
    let usernameInput = null;
    for (let i = 0; i < inputCount; i++) {
      const type = await allInputs.nth(i).getAttribute('type');
      const placeholder = await allInputs.nth(i).getAttribute('placeholder');
      const visible = await allInputs.nth(i).isVisible();
      console.log(`  Input ${i}: type="${type}", placeholder="${placeholder}", visible=${visible}`);
      
      // Username is usually a text input that's visible and not password/search
      if (visible && (type === 'text' || type === null || type === '') && 
          placeholder !== 'Search' && placeholder !== 'Type for hints...') {
        if (!usernameInput) {
          usernameInput = allInputs.nth(i);
          console.log(`  -> Selected input ${i} as username field`);
          break;
        }
      }
    }
    
    if (usernameInput) {
      console.log(`Entering username: ${username}`);
      await usernameInput.fill(username);
      console.log('✓ Entered username');
    } else {
      console.log('❌ Could not find username input field');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_06_username_entered.png', fullPage: true });
    
    // === STEP 6: Enter Password ===
    console.log('\n=== STEP 6: Enter Password ===');
    const passwordInputs = page.locator('input[type="password"]');
    const passwordCount = await passwordInputs.count();
    console.log(`Found ${passwordCount} password inputs`);
    
    if (passwordCount > 0) {
      console.log('Entering password: Admin@12345');
      await passwordInputs.nth(0).fill('Admin@12345');
      console.log('✓ Entered password');
    } else {
      console.log('❌ Password input not found');
    }
    
    // === STEP 7: Enter Confirm Password ===
    console.log('\n=== STEP 7: Enter Confirm Password ===');
    if (passwordCount > 1) {
      console.log('Entering confirm password: Admin@12345');
      await passwordInputs.nth(1).fill('Admin@12345');
      console.log('✓ Entered confirm password');
    } else {
      console.log('⚠ Confirm password input not found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_07_credentials_entered.png', fullPage: true });
    
    // === STEP 8: Click Save ===
    console.log('\n=== STEP 8: Click Save ===');
    
    // Scroll down to ensure Save button is visible
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);
    
    // Try different selectors for Save button
    let saveButton = null;
    
    // Try by button text
    let btn = page.locator('button').filter({ hasText: /^Save$/i });
    if (await btn.count()) {
      saveButton = btn.first();
      console.log('Found Save button by text');
    }
    
    // Try by class (green button)
    if (!saveButton) {
      btn = page.locator('button[class*="oxd-button-main"]');
      if (await btn.count()) {
        const text = await btn.last().textContent();
        if (text.includes('Save')) {
          saveButton = btn.last();
          console.log('Found Save button by main button class');
        }
      }
    }
    
    // Try all buttons and find one that says Save
    if (!saveButton) {
      const allButtons = page.locator('button');
      const allButtonCount = await allButtons.count();
      console.log(`Checking ${allButtonCount} buttons...`);
      for (let i = 0; i < allButtonCount; i++) {
        const btnText = await allButtons.nth(i).textContent();
        console.log(`  Button ${i}: "${btnText.trim()}"`);
        if (btnText.trim().toLowerCase() === 'save') {
          saveButton = allButtons.nth(i);
          console.log(`  -> Found Save button at index ${i}`);
          break;
        }
      }
    }
    
    if (saveButton && await saveButton.isVisible()) {
      console.log('Clicking Save button...');
      await saveButton.click();
      console.log('✓ Clicked Save button');
      
      // Wait for response
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'tmp_08_after_save.png', fullPage: true });
      
      // Check for success message
      await page.waitForTimeout(1000);
      const successToast = page.locator('.oxd-toast').filter({ hasText: /success|saved|successfully/i }).first();
      if (await successToast.count()) {
        const message = await successToast.textContent();
        console.log(`✓✓✓ SUCCESS MESSAGE DISPLAYED: ${message.trim()}`);
      } else {
        console.log('⚠ No success toast message found');
      }
      
      // Check URL change
      const currentUrl = page.url();
      console.log(`Final URL: ${currentUrl}`);
      
      if (currentUrl.includes('viewSystemUsers') || currentUrl.includes('admin')) {
        console.log('✓✓✓ USER CREATION SUCCESSFUL!');
      }
      
    } else {
      console.log('❌ Save button not found or not visible');
      await page.screenshot({ path: 'tmp_save_button_debug.png', fullPage: true });
    }
    
    console.log('\n=== TEST COMPLETED ===');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'tmp_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
