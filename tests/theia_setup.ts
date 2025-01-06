import { test, Page } from '@playwright/test'; 
import { exec } from 'child_process';

const path = `${__dirname.split('tests')[0]}glsp-theia-integration`
const path2 = `${__dirname.split('tests')[0]}test-workflow`

async function theia_setup(page: Page) { 
    return new Promise<Page>((resolve, reject) => {
        try {
            const result = exec(`"cd" ${path} && "yarn" browser start`);
            result.stdout?.on('data', async (data) => {  
                // Get token
                if (data.includes('Theia app listening on')) {
                    const urlRegex = /(http?:\/\/(?:[^\s.]+\.)+[^\s.]+)(?:\.|$)/;
                    const url = await data?.match(urlRegex)[0].slice(0, -1);;
                    // Open browser
                    // await page.goto(url);
                    await page.goto(url + '#' + path2);
                    await page.click('li#shell-tab-explorer-view-container');
                    await page.dblclick('//div[contains(text(), "example1.wf")]');
                    await page.waitForTimeout(3000) // Wait for GLSP to render
                    resolve(page); // Resolve the promise when 'Web UI' is available
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

export default theia_setup;