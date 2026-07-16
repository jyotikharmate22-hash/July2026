import { Page, Locator } from 'playwright';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'load', timeout: 60000 });
  }

  async click(locator: string | Locator) {
    if (typeof locator === 'string') await this.page.locator(locator).click();
    else await locator.click();
  }

  async type(locator: string | Locator, text: string) {
    if (typeof locator === 'string') await this.page.locator(locator).fill(text);
    else await locator.fill(text);
  }

  async waitForSelector(selector: string, timeout = 10000) {
    await this.page.waitForSelector(selector, { timeout });
  }
}
