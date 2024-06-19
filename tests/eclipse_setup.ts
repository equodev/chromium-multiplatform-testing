import { expect } from '@playwright/test';
import { chromium, Browser, Page } from 'playwright';

export async function eclipse_setup(page?: Page): Promise<Page> {
  let browser: Browser | undefined;

  try {
    console.log("Launching browser...");

    const browser: Browser = await chromium.connectOverCDP('http://localhost:8888');

    // Create a new browser context with a specific viewport size

    // Create a new page within the context
    const pages = browser.contexts()[0].pages();
    console.log(pages);
    
    // page = pages[0];
    // await pages[0].goto('http://localhost:8888');
    // Register the driver or perform additional actions here
    // this.ctx.registerDriver(page, null);

    return pages[0];
  } catch (error) {
    console.error('Error launching browser or creating a new page:', error);
    
    if (browser) {
    
      await browser.close();
    
      console.log("Browser closed due to error");
    }
    
    throw error;
  }
}
export default eclipse_setup;