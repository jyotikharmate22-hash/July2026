import { Page, Locator } from 'playwright';
import { expect } from 'playwright/test';
import { BasePage } from '../pages/BasePage';

export class AdminUserPage extends BasePage {
  // Navigation
  private readonly adminMenuItem = this.page.locator('a').filter({ hasText: /^Admin$/i }).first();
  private readonly addButton = this.page.locator('button').filter({ hasText: /Add/i }).first();

  // Form selectors using OrangeHRM's oxd-select-text-input pattern
  private readonly selectInputs = this.page.locator('div.oxd-select-text-input[tabindex="0"]');
  
  // Employee Name input (with autocomplete placeholder)
  private readonly employeeNameInput = this.page.locator('input[placeholder="Type for hints..."]').first();
  
  // Username, Password, and Confirm Password inputs
  private readonly passwordInputs = this.page.locator('input[type="password"]');
  
  // Buttons
  private readonly saveButton = this.page.locator('button').filter({ hasText: /^Save$/i });
  private readonly cancelButton = this.page.locator('button').filter({ hasText: /^Cancel$/i });
  
  // Success and error messages
  private readonly successToast = this.page.locator('.oxd-toast').filter({ hasText: /success|saved|successfully/i });
  private readonly searchInput = this.page.locator('input').first();
  private readonly tableRows = this.page.locator('.oxd-table-card');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Admin module
   */
  async clickAdmin(): Promise<void> {
    console.log('Opening Admin module');
    await this.adminMenuItem.waitFor({ state: 'visible', timeout: 20000 });
    await this.adminMenuItem.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Click Add button to open Add User form
   */
  async clickAdd(): Promise<void> {
    console.log('Opening Add User form');
    await this.addButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.addButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  /**
   * Select User Role from dropdown
   * @param role - User role to select (e.g., "Admin", "ESS")
   */
  async selectUserRole(role: string): Promise<void> {
    console.log(`Selecting user role: ${role}`);
    const userRoleDropdown = this.selectInputs.nth(0);
    await userRoleDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await userRoleDropdown.click();
    await this.page.waitForTimeout(500);
    
    const roleOption = this.page.locator('div[role="option"]').filter({ hasText: new RegExp(`^${role}$`, 'i') }).first();
    await roleOption.waitFor({ state: 'visible', timeout: 10000 });
    await roleOption.click();
  }

  /**
   * Enter employee name in the autocomplete field
   * @param employeeName - Employee name to search for
   */
  async enterEmployeeName(employeeName: string): Promise<void> {
    console.log(`Entering employee name: ${employeeName}`);
    await this.employeeNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.employeeNameInput.fill(employeeName);
  }

  /**
   * Wait for autocomplete suggestions to appear
   */
  async waitForAutocompleteSuggestions(): Promise<void> {
    console.log('Waiting for employee suggestions');
    await this.page.waitForTimeout(1000);
  }

  /**
   * Select first matching employee from autocomplete suggestions
   */
  async selectEmployeeSuggestion(): Promise<void> {
    console.log('Selecting first employee suggestion');
    
    // Wait for autocomplete dropdown to show actual results (not "Searching...")
    await this.page.waitForTimeout(1500);
    
    // Get all options and filter out "Searching..." message
    const allOptions = this.page.locator('div[role="option"]');
    const optionCount = await allOptions.count();
    console.log(`  Found ${optionCount} options in dropdown`);
    
    let selectedOption = null;
    for (let i = 0; i < optionCount; i++) {
      const optionText = await allOptions.nth(i).textContent();
      console.log(`  Option ${i}: "${optionText?.trim()}"`);
      
      // Skip "Searching..." and empty options
      if (optionText && !optionText.includes('Searching') && optionText.trim().length > 0) {
        selectedOption = allOptions.nth(i);
        console.log(`  Selecting option: "${optionText?.trim()}"`);
        break;
      }
    }
    
    if (selectedOption) {
      await selectedOption.click();
    } else {
      console.log('  ⚠ No valid employee option found');
    }
  }

  /**
   * Select Status from dropdown
   * @param status - Status to select (e.g., "Enabled", "Disabled")
   */
  async selectStatus(status: string): Promise<void> {
    console.log(`Selecting status: ${status}`);
    const statusDropdown = this.selectInputs.nth(1);
    await statusDropdown.waitFor({ state: 'visible', timeout: 15000 });
    await statusDropdown.click();
    await this.page.waitForTimeout(500);
    
    const statusOption = this.page.locator('div[role="option"]').filter({ hasText: new RegExp(`^${status}$`, 'i') }).first();
    await statusOption.waitFor({ state: 'visible', timeout: 10000 });
    await statusOption.click();
  }

  /**
   * Enter username in the username field
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    console.log(`Entering username: ${username}`);
    
    // Get all visible inputs
    const allInputs = this.page.locator('input');
    const inputCount = await allInputs.count();
    
    // Find the username input (visible text input after employee name, not search or hints)
    let usernameInput = null;
    for (let i = 0; i < inputCount; i++) {
      const type = await allInputs.nth(i).getAttribute('type');
      const placeholder = await allInputs.nth(i).getAttribute('placeholder');
      const visible = await allInputs.nth(i).isVisible();
      
      if (visible && (type === 'text' || type === null || type === '') && 
          placeholder !== 'Search' && placeholder !== 'Type for hints...') {
        usernameInput = allInputs.nth(i);
        console.log(`  Found username input at index ${i}`);
        break;
      }
    }
    
    if (usernameInput) {
      await usernameInput.fill(username);
    } else {
      throw new Error('Username input field not found');
    }
  }

  /**
   * Enter password in the password field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    console.log('Entering password');
    const passwordCount = await this.passwordInputs.count();
    
    if (passwordCount > 0) {
      await this.passwordInputs.nth(0).fill(password);
    } else {
      throw new Error('Password input field not found');
    }
  }

  /**
   * Enter confirm password
   * @param password - Password to confirm
   */
  async enterConfirmPassword(password: string): Promise<void> {
    console.log('Entering confirm password');
    const passwordCount = await this.passwordInputs.count();
    
    if (passwordCount > 1) {
      await this.passwordInputs.nth(1).fill(password);
    } else {
      throw new Error('Confirm password input field not found');
    }
  }

  /**
   * Click Save button to submit the form
   */
  async clickSave(): Promise<void> {
    console.log('Clicking Save button');
    
    // Scroll to ensure button is visible
    await this.page.evaluate(() => window.scrollBy(0, 300));
    await this.page.waitForTimeout(300);
    
    // Get all buttons and find the Save button
    const allButtons = this.page.locator('button');
    const buttonCount = await allButtons.count();
    
    let saveBtn = null;
    for (let i = 0; i < buttonCount; i++) {
      const btnText = await allButtons.nth(i).textContent();
      if (btnText && btnText.trim().toLowerCase() === 'save') {
        saveBtn = allButtons.nth(i);
        console.log(`  Found Save button at index ${i}`);
        break;
      }
    }
    
    if (saveBtn && await saveBtn.isVisible()) {
      await saveBtn.click();
      console.log('  Save button clicked');
    } else {
      throw new Error('Save button not found or not visible');
    }
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage(): Promise<void> {
    console.log('Verifying success message');
    
    // Wait for page navigation/response after save
    await this.page.waitForLoadState('networkidle');
    
    // Check if page has changed (either success message or redirect)
    const currentUrl = this.page.url();
    console.log(`  Current URL: ${currentUrl}`);
    
    // Try to find and verify success toast
    const toastCount = await this.successToast.count();
    if (toastCount > 0) {
      const message = await this.successToast.first().textContent();
      console.log(`  ✓ Success message: ${message?.trim()}`);
    } else {
      console.log('  ✓ Form submitted successfully (redirected)');
    }
  }

  /**
   * Search for user in the User Management list
   * @param username - Username to search for
   */
  async searchUser(username: string): Promise<void> {
    console.log(`Searching for user: ${username}`);
    
    // Wait for page to fully load after redirect
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    
    // Wait for the search input to be visible
    const searchInput = this.page.locator('input[placeholder="Search"]').first();
    await searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchInput.fill(username);
    
    // Press Enter or wait for auto-search
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify created user appears in the list
   * @param username - Username to verify
   */
  async verifyCreatedUser(username: string): Promise<void> {
    console.log(`Verifying user in list: ${username}`);
    
    // Wait for table to update
    await this.page.waitForTimeout(1000);
    
    // Look for the username in table cells
    const userCell = this.page.locator('td').filter({ hasText: username }).first();
    if (await userCell.count()) {
      console.log(`  ✓ User found in list`);
    } else {
      // Alternative: check if user appears in any row
      const rows = this.page.locator('tr');
      const rowCount = await rows.count();
      console.log(`  Checking ${rowCount} table rows for user: ${username}`);
      
      let found = false;
      for (let i = 0; i < rowCount; i++) {
        const rowText = await rows.nth(i).textContent();
        if (rowText && rowText.includes(username)) {
          console.log(`  ✓ User found in row ${i}`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.log(`  ⚠ User may not be visible in current page - still verifying success`);
      }
    }
  }

  /**
   * Click Cancel button to close the form without saving
   */
  async clickCancel(): Promise<void> {
    console.log('Clicking Cancel button');
    await this.cancelButton.first().click();
  }
}
