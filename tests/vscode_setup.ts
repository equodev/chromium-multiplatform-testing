import { test, Page } from '@playwright/test'; 
import { exec } from 'child_process';

let path = __dirname.split('tests')[0].replace(/\\/g, "/");

async function vscode_setup(page: Page) { 
    return new Promise<void>((resolve, reject) => {
        try {
            const result = exec('powershell.exe -command "code --no-sandbox serve-web"');

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

                    // Install GLSP Extension
                    await page.waitForSelector('a[aria-label="Extensions (Ctrl+Shift+X)"]');
                    await page.click('a[aria-label="Extensions (Ctrl+Shift+X)"]');
                    await page.waitForTimeout(3000);
                    await page.click('div.view-line');
                    await page.fill('textarea.inputarea', 'glsp');
                    await page.click("div.extension-list-item")
                    await page.waitForTimeout(3000);
                    await page.click('a.install');
                    await page.waitForTimeout(5000); // Wait for installation and refresh

                    // Navigate to file explorer and open GLSP workflow
                    await page.click('a[aria-label="Explorer (Ctrl+Shift+E)"]');
                    await page.click('div[aria-label="example"]');
                    await page.click('div[aria-label="workspace"]');
                    await page.click('div[aria-label="example1.wf"]');
                    await page.waitForTimeout(15000); // Wait for GLSP to render
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