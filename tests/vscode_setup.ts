import { test, Page, BrowserContext, chromium } from '@playwright/test'; 
import { exec } from 'child_process';

let path = __dirname.split('tests')[0].replace(/\\/g, "/");

async function vscode_setup(page: Page) { 
    return new Promise<void>((resolve, reject) => {
        try {
            const result = exec('/usr/local/bin/code --no-sandbox --disable-https serve-web');

            result.stdout?.on('data', async (data) => {  
                if (data.includes('Web UI available at')) {
                    // Get Token
                    const url = data.split('Web UI available at ')[1];
                    await page.goto(url);
                    if (path.indexOf("/") > 0) path = "/" + path
                    await page.goto(`http://127.0.0.1:8000/?folder=${path}glsp-vscode-integration`);
                    
                    // Accept PopUp
                    await page.waitForSelector('text="Yes, I trust the authors"');
                    await page.click('text="Yes, I trust the authors"');
                    
                    // Open Debug
                    await page.waitForSelector('.codicon-run-view-icon');
                    await page.click('.codicon-run-view-icon');
                    await page.waitForSelector('.codicon-debug-start');
                    await page.click('.codicon-debug-start');
                    await page.waitForTimeout(2000);

                    // Switch to new page
                    const pages = page.context().pages()
                    const debugPage = pages[1]
                    await debugPage.bringToFront();
                    debugPage.waitForTimeout(1000); // Give time for backend to load

                    // Navigate to file explorer and open GLSP workflow
                    await debugPage.dblclick('div[aria-label="example1.wf"]');
                    resolve(); // Resolve the promise when 'Web UI' is available
                }
            });

            result.stderr?.on('data', (data) => {
                // Handle stderr data if needed
            });
        } catch (error) {
            reject(error);
        }
    });
}

export default vscode_setup;