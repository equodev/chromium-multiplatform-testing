import { Page } from '@playwright/test'; 
import { exec } from 'child_process';
import os from 'os';

let path = __dirname.split('tests')[0].replace(/\\/g, "/");

async function vscode_setup(page: Page) { 
    return new Promise(async (resolve, reject) => {
        try {


            let command: string;

            switch (os.platform()) {
            case 'win32':
                command = 'powershell.exe -command "code --no-sandbox serve-web"';
                break;
            case 'darwin':
                command = 'sh /Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code --no-sandbox serve-web';
                break;
            case 'linux':
                command = 'sh /snap/code/current/usr/share/code/bin/code --no-sandbox serve-web';
                break;
            default:
                throw new Error('Unsupported platform');
            }

            const result = exec(command);
            // const result = exec('powershell.exe -command "code --no-sandbox serve-web"');
            // const result = exec('"sh" /snap/code/current/usr/share/code/bin/code --no-sandbox serve-web');
            // macOS code command

            result.stdout?.on('data', async (data) => {
                if (data.includes('Web UI available at')) {
                    // Get Token
                    const url = data.split('Web UI available at ')[1];
                    await page.goto(url);
                    if (path.indexOf("/") > 0) path = "/" + path;
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
                    const pages = page.context().pages();
                    const debugPage = pages[1];
                    await debugPage.bringToFront();
                    await debugPage.waitForTimeout(1000); // Give time for backend to load

                    // const testPage = page.context().pages()[1];
                    await debugPage.bringToFront();
                    const workflowPath = replaceFolderPathInUrl(debugPage.url(), __dirname.split('tests')[0].replace(/\\/g, "/") + 'test-workflow')
                    await debugPage.goto(workflowPath);
                    await debugPage.waitForSelector('text="Yes, I trust the authors"');
                    await debugPage.click('text="Yes, I trust the authors"');
                    
                    // Navigate to file explorer and open GLSP workflow
                    await debugPage.dblclick('div[aria-label="example1.wf"]');
                    await debugPage.waitForTimeout(6000);
                    

                    // Resolve the promise with debugPage
                    resolve(debugPage);
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

function replaceFolderPathInUrl(url: string, newPath: string): string {
    const isWindows = process.platform === 'win32';
    const adjustedPath = isWindows ? `/${newPath}` : newPath;
    const regex = /(?<=folder=)([^&]*)/;
    return url.replace(regex, adjustedPath);
  }

export default vscode_setup;