import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

export class BrowserManager {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  async launch(headless?: boolean) {
    const envHeadless = process.env.HEADLESS;
    const envBrowser = process.env.BROWSER; // 'chromium' | 'firefox' | 'webkit' | 'chrome'
    const useHeadless = typeof headless === 'boolean' ? headless : envHeadless !== 'false';

    const launchOptions: any = { headless: useHeadless };

    const browserKey = (envBrowser || 'chromium').toLowerCase();
    if (browserKey === 'firefox') {
      this.browser = await firefox.launch(launchOptions);
    } else if (browserKey === 'webkit') {
      this.browser = await webkit.launch(launchOptions);
    } else if (browserKey === 'chrome') {
      // use Chromium with Chrome channel if available
      launchOptions.channel = 'chrome';
      this.browser = await chromium.launch(launchOptions);
    } else {
      this.browser = await chromium.launch(launchOptions);
    }
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
