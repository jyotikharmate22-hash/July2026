const { chromium } = require('playwright');
const fs = require('fs');

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
    
    // Take screenshot before form filling
    await page.screenshot({ path: 'tmp_before_form_filling.png', fullPage: true });
    console.log('✓ Screenshot taken: tmp_before_form_filling.png');
    
    // Inspect all inputs and their properties
    const inputs = await page.$$('input');
    console.log(`\nFound ${inputs.length} input fields:`);
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      const testid = await input.getAttribute('data-testid');
      console.log(`  [${i}] type="${type}", name="${name}", placeholder="${placeholder}", id="${id}", data-testid="${testid}"`);
    }
    
    // Inspect dropdowns
    console.log('\nForm structure:');
    const formLabels = await page.$$('label');
    for (let label of formLabels) {
      const text = await label.textContent();
      console.log(`  Label: ${text}`);
    }

    // Try selecting User Role
    console.log('\n--- Selecting User Role ---');
    const userRoleDiv = page.locator('div').filter({ hasText: /User Role/i }).first();
    console.log('Clicking User Role dropdown...');
    await userRoleDiv.click();
    await page.waitForTimeout(500);
    
    // Take screenshot after role selection
    await page.screenshot({ path: 'tmp_after_role_selection.png', fullPage: true });
    console.log('✓ Screenshot: tmp_after_role_selection.png');
    
    // Select Admin role
    const roleOption = page.locator('div').filter({ hasText: /^Admin$/i }).last();
    await roleOption.click();
    console.log('✓ Selected Admin role');
    
    // Enter employee name
    console.log('\n--- Entering Employee Name ---');
    const employeeInput = page.locator('input').first();
    await employeeInput.fill('John');
    console.log('✓ Entered employee name: John');
    
    // Wait for autocomplete
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'tmp_after_employee_entry.png', fullPage: true });
    
    // Select first employee
    const suggestion = page.locator('div').filter({ hasText: /John|Smith/i }).first();
    if (await suggestion.count()) {
      await suggestion.click();
      console.log('✓ Selected employee suggestion');
    }
    
    // Select Status
    console.log('\n--- Selecting Status ---');
    const statusDiv = page.locator('div').filter({ hasText: /Status/i }).first();
    console.log('Clicking Status dropdown...');
    await statusDiv.click();
    await page.waitForTimeout(500);
    
    // Take screenshot of status dropdown
    await page.screenshot({ path: 'tmp_status_dropdown.png', fullPage: true });
    console.log('✓ Screenshot: tmp_status_dropdown.png');
    
    // Check what options are available
    const allDivs = await page.$$('div');
    console.log('\nSearching for status options...');
    let statusOptions = [];
    for (let div of allDivs) {
      const text = await div.textContent();
      if (text && (text.includes('Enabled') || text.includes('Disabled') || text === 'Enabled' || text === 'Disabled')) {
        statusOptions.push(text.trim());
      }
    }
    console.log('Found status options:', statusOptions.slice(0, 10));
    
    // Try with different approach
    const enabledOption = page.locator('text=Enabled').first();
    if (await enabledOption.count()) {
      console.log('Found "Enabled" text, clicking...');
      await enabledOption.click();
      console.log('✓ Selected Status: Enabled (using text locator)');
    } else {
      console.log('❌ Could not find "Enabled" option');
    }
    
    // Take screenshot before username
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'tmp_before_username.png', fullPage: true });
    console.log('\n✓ Screenshot: tmp_before_username.png');
    
    // Check current inputs again
    console.log('\nCurrent input fields:');
    const inputsAfter = await page.$$('input');
    for (let i = 0; i < inputsAfter.length; i++) {
      const input = inputsAfter[i];
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      console.log(`  [${i}] type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`);
    }
    
    // Fill Username
    console.log('\n--- Entering Username ---');
    const username = 'AutoUser_' + new Date().toISOString().replace(/[:-]/g, '').slice(0, 15);
    const usernameInput = page.locator('input[placeholder="Type for hints..."]').locator('..').locator('input').last();
    try {
      await usernameInput.fill(username);
      console.log(`✓ Entered username: ${username}`);
    } catch (e) {
      console.log(`❌ Error entering username: ${e.message}`);
    }
    
    // Fill Password
    console.log('\n--- Entering Password ---');
    const passwordInputs = await page.$$('input[type="password"]');
    if (passwordInputs.length > 0) {
      await page.locator('input[type="password"]').first().fill('Admin@12345');
      console.log('✓ Entered password');
    } else {
      console.log('❌ Password input not found');
    }
    
    // Fill Confirm Password
    console.log('\n--- Entering Confirm Password ---');
    if (passwordInputs.length > 1) {
      await page.locator('input[type="password"]').nth(1).fill('Admin@12345');
      console.log('✓ Entered confirm password');
    } else {
      console.log('❌ Confirm password input not found');
    }
    
    // Take screenshot before save
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tmp_before_save.png', fullPage: true });
    console.log('\n✓ Screenshot: tmp_before_save.png');
    
    // Click Save button
    console.log('\n--- Clicking Save ---');
    const saveButton = page.locator('button').filter({ hasText: /^Save$/i }).first();
    if (await saveButton.count()) {
      await saveButton.click();
      console.log('✓ Clicked Save button');
      
      // Wait for result
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'tmp_after_save.png', fullPage: true });
      console.log('✓ Screenshot: tmp_after_save.png');
      
      // Check for success message
      const successToast = page.locator('.oxd-toast').filter({ hasText: /success|saved|successfully/i }).first();
      if (await successToast.count()) {
        const message = await successToast.textContent();
        console.log(`✓ Success message: ${message}`);
      } else {
        console.log('❌ No success message found');
      }
    } else {
      console.log('❌ Save button not found');
    }
    
    console.log('\n✓ Debug complete! Check screenshots in workspace root.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await page.screenshot({ path: 'tmp_error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
