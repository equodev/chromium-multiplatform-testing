import { test, ElementHandle } from '@playwright/test'; 
import { chromium, Browser, Page } from '@playwright/test';
import { exec } from 'child_process';

const path = `${__dirname.split('tests')[0]}glsp-theia-integration`

// import { chromium, Browser, Page } from 'playwright';
async function eclipse_setup(page: Page) { 

const windowSize = { width: 1920, height: 1080 };

class ConnectToAp {
  private browser: Browser | undefined;
  private page: Page | undefined;

  async connectToAp() {
    try {
      this.browser = await chromium.launch({
        headless: false,
        args: [
          `--window-size=${windowSize.width},${windowSize.height}`
        ]
      });
console.log("amshcbsakchabkahbakhbasbhbhkbasbjasjabsh");

      this.page = await this.browser.newPage();
      await this.page.setViewportSize(windowSize);
      await this.registerPage(this.page);
      return this.page;
    } catch (error) {
      console.error('Error launching browser or creating a new page:', error);
      throw error;
    }
  }

  private async registerPage(page: Page) {
    // Implement the logic to register the page with the context if needed
    console.log("Page registered:", page.url());
    return page;
  }
}

// Example usage
(async () => {
  const connector = new ConnectToAp();
  try {
    const page = await connector.connectToAp();

    // Navigate to an example URL to verify everything is working correctly
    await page.goto('https://example.com');
    console.log(`Page title: ${await page.title()}`);

    // Close the browser after performing the tests
    await page.context().browser()?.close();
  } catch (error) {
    console.error('Error in connecting to AP:', error);
  }
})();
    // page.pause();
    // await page.goto('localhost:8888');
    // await page.click('#items > p > a')
    // await page.waitForTimeout(3000)
    // await page.getByRole('treeitem', { name: '<div id=​"workflow_Editor_1"' }).dblclick();
    // await page.waitForTimeout(1000);
    // await page.getByRole('treeitem', { name: '<div tabindex=​"1" aria-label' }).dblclick();
    // await page.waitForTimeout(1000);
    // await page.getByText('data-svg-metadata-api').dblclick();
    // await page.waitForTimeout(1000);
    // await page.getByRole('treeitem', { name: '<svg class=​"sprotty-graph"' }).dblclick();
    // await page.waitForTimeout(1000);
    // await page.getByText('style="height: 100%;"').dblclick();
    // await page.waitForTimeout(1000);
    // // await page.pause()
    // await page.getByRole('treeitem', { name: '<g transform=​"scale(1)​' }).dblclick();
    // await page.waitForTimeout(1000);
    // await page.getByRole('treeitem', { name: '<g transform=​"scale(1)​' }).dblclick();
    // await page.waitForTimeout(1000);
    // await page.getByRole('treeitem', { name: '<g id=​"workflow_Editor_1_task0" transform=​"translate(70, 140)​" data-svg-' }).dblclick();
    // await page.keyboard.press('Delete')
    // await page.waitForTimeout(3000)
    // await page.keyboard.press('Control+Z');
    // await page.waitForTimeout(3000)
}

export default eclipse_setup;