import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { BrowserManager } from '../utils/BrowserManager';
import * as fs from 'fs';
import * as path from 'path';

// Set default step timeout
setDefaultTimeout(60 * 1000);

Before(async function () {
  this.browserManager = new BrowserManager();
  this.page = await this.browserManager.launch(true);
});

After(async function (scenario) {
  const world: any = this;
  if (scenario.result && scenario.result.status === Status.FAILED) {
    try {
      const screenshotBuffer = await world.page.screenshot({ fullPage: true });
      await world.attach(screenshotBuffer, 'image/png');

      const videoPath = await world.browserManager.getLastVideoPath();
      if (videoPath && fs.existsSync(videoPath)) {
        const videoBuffer = fs.readFileSync(videoPath);
        await world.attach(videoBuffer, 'video/mp4');
        // copy to artifacts folder
        const dest = path.join(process.cwd(), 'videos', path.basename(videoPath));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(videoPath, dest);
      }
    } catch (e) {
      // ignore attach errors
    }
  }

  try {
    if (world.browserManager) await world.browserManager.close();
  } catch (e) {
    // ignore
  }
});
