import { chromium, Browser, BrowserContext, Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

export class BrowserManager {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  async launch(headless = true) {
    this.browser = await chromium.launch({ headless });
    this.context = await this.browser.newContext({
      recordVideo: { dir: path.join(process.cwd(), 'videos') }
    });
    this.page = await this.context.newPage();
    return this.page;
  }

  async close() {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  async screenshotToFile(fileName: string) {
    if (!this.page) return '';
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
    const filePath = path.join(screenshotsDir, fileName);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  async getLastVideoPath(): Promise<string | null> {
    if (!this.page) return null;
    try {
      const video = this.page.video();
      if (!video) return null;
      const p = await video.path();
      return p;
    } catch (e) {
      return null;
    }
  }
}
