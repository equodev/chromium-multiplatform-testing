import { Page } from '@playwright/test'; 
import { exec } from 'child_process';

const theiaPath = `${__dirname.split('tests')[0]}glsp-theia-integration`

async function theia_setup(page: Page) { 
    return new Promise<Page>((resolve, reject) => {
        try {
            const result = exec(`cd ${theiaPath} && "yarn" browser start`);
            result.stdout?.on('data', async (data) => {  
                if (data.includes('Theia app listening on')) {
                    await goToWorkflowUrlAndOpenIt(data, page);
                    await page.waitForTimeout(3000) // Wait for GLSP to render
                    resolve(page);
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

async function goToWorkflowUrlAndOpenIt(data: any, page: Page) {
    const folderPath = `${__dirname.split('tests')[0]}resources/test-workflow`
    const urlRegex = /(http?:\/\/(?:[^\s.]+\.)+[^\s.]+)(?:\.|$)/;
    const url = await data?.match(urlRegex)[0].slice(0, -1);;
    
    await page.goto(url + '#' + folderPath);
    await page.click('li#shell-tab-explorer-view-container');
    await page.dblclick('//div[contains(text(), "example1.wf")]');
}
