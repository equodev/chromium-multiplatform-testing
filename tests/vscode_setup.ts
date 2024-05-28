import { test, Page } from '@playwright/test'; 
import { exec } from 'child_process';

const path = __dirname.split('tests')[0];

async function vscode_setup(page: Page) { 
    return new Promise<void>((resolve, reject) => {
        try {
            const result = exec('"sh" /snap/code/current/usr/share/code/bin/code --no-sandbox serve-web');

            result.stdout?.on('data', async (data) => {  
                if (data.includes('Web UI available at')) {
                    const url = data.split('Web UI available at ')[1];
                    await page.goto(url);
                    await page.goto(`http://127.0.0.1:8000/?folder=${path}glsp-vscode-integration`);

                    await page.waitForSelector('text="Yes, I trust the authors"');
                    await page.click('text="Yes, I trust the authors"');

                    await page.waitForSelector('a[aria-label="Extensions (Ctrl+Shift+X)"]');
                    await page.click('a[aria-label="Extensions (Ctrl+Shift+X)"]');

                    await page.waitForTimeout(3000);

                    await page.click('div.view-line');

                    await page.fill('textarea.inputarea', 'glsp');

                    await page.click("div.extension-list-item")

                    await page.waitForTimeout(3000);
                    await page.click('a.install');

                    await page.waitForTimeout(5000);

                    await page.click('a[aria-label="Explorer (Ctrl+Shift+E)"]');

                    await page.click('div[aria-label="example"]');
                    await page.click('div[aria-label="workspace"]');
                    await page.click('div[aria-label="example1.wf"]');
                    await page.waitForTimeout(20000);
                    await page.frameLocator('iframe[class="webview ready"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
                    await page.keyboard.press("Delete");
                    await page.waitForTimeout(10000)
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