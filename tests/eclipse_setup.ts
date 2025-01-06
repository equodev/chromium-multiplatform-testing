import { test, Page, chromium, Browser } from '@playwright/test';

const path = `${__dirname.split('tests')[0]}glsp-theia-integration`

async function eclipse_setup(page: Page) { 
    console.log("Launching browser...");
    const browser: Browser = await chromium.connectOverCDP('http://localhost:8888');
    const pages = browser.contexts()[0].pages();
    return pages.find(page => page.url().includes('diagram'));       
}

export default eclipse_setup;