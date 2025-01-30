import { Page } from '@playwright/test'; 
import { exec } from 'child_process';
import os from 'os';

let path = __dirname.split('tests')[0].replace(/\\/g, "/");

async function vscode_setup(page: Page) { 
    return new Promise(async (resolve, reject) => {
        try {
            const result = exec(getVSCodeExcutionCommand());
            result.stdout?.on('data', async (data) => {
                if (data.includes('Web UI available at')) {
                    const debugPage = await runGLSPInDebugAndOpenExampleFile(data, page);
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

function getVSCodeExcutionCommand() {
    switch (os.platform()) {
        case 'win32':
            return 'powershell.exe -command "code --no-sandbox serve-web"';
        case 'darwin':
            return 'sh /Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code --no-sandbox serve-web';
        case 'linux':
            return 'sh /snap/code/current/usr/share/code/bin/code --no-sandbox serve-web';
        default:
            throw new Error('Unsupported platform');
    }
}

async function runGLSPInDebugAndOpenExampleFile(data: any, page: Page) {
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
    const workflowPath = replaceFolderPathInUrl(debugPage.url(), __dirname.split('tests')[0].replace(/\\/g, "/") + 'resources/test-workflow');
    await debugPage.goto(workflowPath);
    await debugPage.waitForSelector('text="Yes, I trust the authors"');
    await debugPage.click('text="Yes, I trust the authors"');

    // Navigate to file explorer and open GLSP workflow
    await debugPage.dblclick('div[aria-label="example1.wf"]');
    await debugPage.waitForTimeout(6000);
    return debugPage;
}

function replaceFolderPathInUrl(url: string, newPath: string): string {
        const isWindows = process.platform === 'win32';
        const adjustedPath = isWindows ? `/${newPath}` : newPath;
        const regex = /(?<=folder=)([^&]*)/;
        return url.replace(regex, adjustedPath);
    }

export default vscode_setup;