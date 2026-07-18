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
    
    // Step 1: Select User Role
    console.log('\n=== STEP 1: Select User Role ===');
    const userRoleDiv = page.locator('div').filter({ hasText: /User Role/i });
    console.log('Looking for User Role field...');
    const userRoleField = userRoleDiv.locator('..').locator('div[role="button"]').first();
    console.log('Clicking User Role dropdown...');
    await userRoleField.click();
    await page.waitForTimeout(500);
    
    // Find Admin option
    console.log('Looking for Admin option...');
    const adminOption = page.locator('div[role="option"]').filter({ hasText: /^Admin$/i }).first();
    if (await adminOption.count()) {
      await adminOption.click();
      console.log('✓ Selected Admin role');
    } else {
      console.log('❌ Admin option not found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step1_user_role.png', fullPage: true });
    
    // Step 2: Enter Employee Name
    console.log('\n=== STEP 2: Enter Employee Name ===');
    const employeeInput = page.locator('input[placeholder="Type for hints..."]').first();
    console.log('Filling employee name...');
    await employeeInput.fill('John');
    await page.waitForTimeout(1000);
    console.log('✓ Entered employee name');
    
    // Take screenshot to see suggestions
    await page.screenshot({ path: 'tmp_step2_employee.png', fullPage: true });
    
    // Step 3: Select employee from suggestions
    console.log('\n=== STEP 3: Select Employee from Autocomplete ===');
    const firstSuggestion = page.locator('div[role="option"]').first();
    if (await firstSuggestion.count()) {
      const suggestionText = await firstSuggestion.textContent();
      console.log(`Found suggestion: ${suggestionText}`);
      await firstSuggestion.click();
      console.log('✓ Selected employee from suggestions');
    } else {
      console.log('❌ No employee suggestions found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step3_employee_selected.png', fullPage: true });
    
    // Step 4: Select Status
    console.log('\n=== STEP 4: Select Status ===');
    const statusDiv = page.locator('div').filter({ hasText: /^Status$/ });
    const statusField = statusDiv.locator('..').locator('div[role="button"]').first();
    console.log('Clicking Status dropdown...');
    await statusField.click();
    await page.waitForTimeout(500);
    
    console.log('Looking for Enabled option...');
    const enabledOption = page.locator('div[role="option"]').filter({ hasText: /^Enabled$/i }).first();
    if (await enabledOption.count()) {
      await enabledOption.click();
      console.log('✓ Selected Enabled status');
    } else {
      console.log('❌ Enabled option not found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step4_status.png', fullPage: true });
    
    // Step 5: Fill Username
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
    
    const usernameLabel = page.locator('label').filter({ hasText: /^Username$/ });
    const usernameInput = usernameLabel.locator('..').locator('input').first();
    console.log(`Entering username: ${username}`);
    await usernameInput.fill(username);
    console.log('✓ Entered username');
    
    await page.waitForTimeout(500);
    
    // Step 6: Fill Password
    console.log('\n=== STEP 6: Enter Password ===');
    const passwordInputs = page.locator('input[type="password"]');
    const passwordCount = await passwordInputs.count();
    console.log(`Found ${passwordCount} password inputs`);
    
    if (passwordCount > 0) {
      await passwordInputs.first().fill('Admin@12345');
      console.log('✓ Entered password');
    } else {
      console.log('❌ Password input not found');
    }
    
    // Step 7: Fill Confirm Password
    console.log('\n=== STEP 7: Enter Confirm Password ===');
    if (passwordCount > 1) {
      await passwordInputs.nth(1).fill('Admin@12345');
      console.log('✓ Entered confirm password');
    } else {
      console.log('❌ Confirm password input not found');
    }
    
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_step5_credentials.png', fullPage: true });
    
    // Step 8: Click Save
    console.log('\n=== STEP 8: Click Save ===');
    const saveButton = page.locator('button').filter({ hasText: /^Save$/i }).first();
    if (await saveButton.count()) {
      console.log('Clicking Save button...');
      await saveButton.click();
      console.log('✓ Clicked Save button');
      
      // Wait for result
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'tmp_step6_after_save.png', fullPage: true });
      
      // Check for success message
      const successToast = page.locator('.oxd-toast').filter({ hasText: /success|saved|successfully/i }).first();
      if (await successToast.count()) {
        const message = await successToast.textContent();
        console.log(`✓ Success message: ${message}`);
      } else {
        console.log('⚠ No success message found (but Save was clicked)');
      }
    } else {
      console.log('❌ Save button not found');
    }
    
    console.log('\n✓ All steps completed! Check screenshots in workspace root.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'tmp_error_debug.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
