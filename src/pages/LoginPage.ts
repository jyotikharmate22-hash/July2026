import { Page } from 'playwright';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  usernameInput = 'input[name="username"]';
  passwordInput = 'input[name="password"]';
  loginButton = 'button[type="submit"]';

  constructor(page: Page) {
    super(page);
  }

  async open(url: string) {
    await this.navigate(url);
  }

  async enterUsername(username: string) {
    await this.type(this.usernameInput, username);
  }

  async enterPassword(password: string) {
    await this.type(this.passwordInput, password);
  }

  async clickLogin() {
    await this.click(this.loginButton);
  }

  async isDashboardDisplayed(): Promise<boolean> {
    try {
      await this.page.waitForSelector('text=Dashboard', { timeout: 10000 });
      return true;
    } catch (e) {
      return false;
    }
  }
}
