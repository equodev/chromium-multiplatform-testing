// vscode_setup.ts
import { Page } from 'playwright'; // Import only Page, as BrowserContext is inferred

const path = __dirname.split('tests')[0]

async function vscode_setup(page: Page) { // Remove BrowserContext from function signature
    // Navigate to the specified URL
    await page.goto('http://127.0.0.1:8000?tkn=3cd9d4be-ce75-4c0a-8583-c87fc82ec939');
    await page.goto(`http://127.0.0.1:8000/?folder=${path}/glsp-vscode-integration`);

    // Clicking on buttons and links
    await page.waitForSelector('button[name="Yes, I trust the authors"]');
    await page.click('button[name="Yes, I trust the authors"]');

    await page.waitForSelector('a[aria-label="Extensions (Ctrl+Shift+X)"]');
    await page.click('a[aria-label="Extensions (Ctrl+Shift+X)"]');

    await page.waitForTimeout(3000);
    await page.click('.view-line');

    await page.fill('input[placeholder="Search Extensions in"]', 'glsp');

    await page.waitForTimeout(3000);
    await page.click('button[name="Install"]');

    await page.waitForTimeout(5000);

    await page.click('a[aria-label="Explorer (Ctrl+Shift+E)"]');

    await page.waitForTimeout(3000);
    await page.click(`a[aria-label=${path}glsp-vscode-integration/example]`);

    await page.waitForTimeout(3000);
    await page.click(`a[aria-label="${path}/glsp-vscode-integration/example/workflow/workspace"]`);

    await page.waitForTimeout(3000);
    await page.click('a[aria-label="example1.wf"]');

    await page.waitForTimeout(30000)
    const frames = await page.frames()
    console.log(frames)
}

export default vscode_setup;
