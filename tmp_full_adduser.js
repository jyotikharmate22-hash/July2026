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
    
    // Screenshot
    await page.screenshot({ path: 'tmp_form_start.png', fullPage: true });
    
    // === STEP 1: Select User Role ===
    console.log('\n=== STEP 1: Select User Role ===');
    const userRoleLabel = page.locator('label').filter({ hasText: /^User Role/ });
    const userRoleDropdown = userRoleLabel.locator('..').locator('div[class*="oxd-select"]').first();
    console.log('Clicking User Role dropdown...');
    await userRoleDropdown.click();
    await page.waitForTimeout(500);
    
    const adminRoleOption = page.locator('div[role="option"]').filter({ hasText: /^Admin$/i }).first();
    if (await adminRoleOption.count()) {
      console.log('Found Admin option, clicking...');
      await adminRoleOption.click();
      console.log('✓ Selected Admin role');
    } else {
      console.log('⚠ Admin option not found, trying alternative');
      await page.click('text=Admin');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step1_user_role.png', fullPage: true });
    
    // === STEP 2: Enter Employee Name ===
    console.log('\n=== STEP 2: Enter Employee Name ===');
    const employeeNameLabel = page.locator('label').filter({ hasText: /^Employee Name/ });
    const employeeNameInput = employeeNameLabel.locator('..').locator('input').first();
    console.log('Filling employee name...');
    await employeeNameInput.fill('John');
    console.log('✓ Entered employee name: John');
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tmp_step2_employee.png', fullPage: true });
    
    // === STEP 3: Select Employee from Autocomplete ===
    console.log('\n=== STEP 3: Select Employee from Autocomplete ===');
    const firstSuggestion = page.locator('div[role="option"]').first();
    if (await firstSuggestion.count()) {
      const suggestionText = await firstSuggestion.textContent();
      console.log(`Found suggestion: ${suggestionText}`);
      await firstSuggestion.click();
      console.log('✓ Selected employee from suggestions');
    } else {
      console.log('⚠ No employee suggestions found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step3_employee_selected.png', fullPage: true });
    
    // === STEP 4: Select Status ===
    console.log('\n=== STEP 4: Select Status ===');
    const statusLabel = page.locator('label').filter({ hasText: /^Status/ });
    const statusDropdown = statusLabel.locator('..').locator('div[class*="oxd-select"]').first();
    console.log('Clicking Status dropdown...');
    await statusDropdown.click();
    await page.waitForTimeout(500);
    
    const enabledOption = page.locator('div[role="option"]').filter({ hasText: /^Enabled$/i }).first();
    if (await enabledOption.count()) {
      console.log('Found Enabled option, clicking...');
      await enabledOption.click();
      console.log('✓ Selected Enabled status');
    } else {
      console.log('⚠ Enabled option not found, trying alternative');
      await page.click('text=Enabled');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step4_status.png', fullPage: true });
    
    // === STEP 5: Enter Username ===
    console.log('\n=== STEP 5: Enter Username ===');
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0')
    ].join('');
    const username = `AutoUser_${timestamp}`;
    
    const usernameLabel = page.locator('label').filter({ hasText: /^Username/ });
    const usernameInput = usernameLabel.locator('..').locator('input').first();
    console.log(`Entering username: ${username}`);
    await usernameInput.fill(username);
    console.log('✓ Entered username');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step5_username.png', fullPage: true });
    
    // === STEP 6: Enter Password ===
    console.log('\n=== STEP 6: Enter Password ===');
    const passwordLabel = page.locator('label').filter({ hasText: /^Password/ });
    const passwordInput = passwordLabel.locator('..').locator('input[type="password"]').first();
    console.log('Entering password: Admin@12345');
    await passwordInput.fill('Admin@12345');
    console.log('✓ Entered password');
    
    await page.waitForTimeout(500);
    
    // === STEP 7: Enter Confirm Password ===
    console.log('\n=== STEP 7: Enter Confirm Password ===');
    const confirmPasswordLabel = page.locator('label').filter({ hasText: /^Confirm Password/ });
    const confirmPasswordInput = confirmPasswordLabel.locator('..').locator('input[type="password"]').first();
    console.log('Entering confirm password: Admin@12345');
    await confirmPasswordInput.fill('Admin@12345');
    console.log('✓ Entered confirm password');
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step6_credentials.png', fullPage: true });
    
    // === STEP 8: Click Save ===
    console.log('\n=== STEP 8: Click Save ===');
    const saveButton = page.locator('button').filter({ hasText: /^Save$/i }).first();
    if (await saveButton.count()) {
      console.log('Found Save button, clicking...');
      await saveButton.click();
      console.log('✓ Clicked Save button');
      
      // Wait for result
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'tmp_step7_after_save.png', fullPage: true });
      
      // Check for success message
      const successToast = page.locator('.oxd-toast').filter({ hasText: /success|saved|successfully/i }).first();
      if (await successToast.count()) {
        const message = await successToast.textContent();
        console.log(`✓✓✓ SUCCESS MESSAGE: ${message}`);
      } else {
        console.log('⚠ No success message visible');
      }
      
      // Check page URL changed to list
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);
      
      if (currentUrl.includes('viewSystemUsers')) {
        console.log('✓✓✓ USER CREATED SUCCESSFULLY - Redirected to Users List');
      }
      
    } else {
      console.log('❌ Save button not found');
    }
    
    console.log('\n✓ All steps completed! Check screenshots in workspace root.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    await page.screenshot({ path: 'tmp_error_debug.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
