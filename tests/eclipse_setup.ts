import { Page, chromium, Browser } from '@playwright/test';
import { exec } from 'child_process';

const path = `${__dirname.split('tests')[0]}/resources/test-workflow/example1.wf`;
const encodedNewPath = encodeURIComponent(path);

async function eclipse_setup(page: Page) { 
    return new Promise<Page | undefined>((resolve, reject) => {
            try {
                const result = exec("bash ./setup_glsp_integration.sh");
                result.stdout?.on('data', async (data) => {  
                    // Get token
                    if (data.includes('Launching Eclipse with workspace')) {
                        await page.waitForTimeout(15000);
                        const pages = await connectToEquoChromiumWithinEclipse();
                        const workflowPage = getEquoChromiumPageAndOpenWorkflow(pages);
                        resolve(workflowPage);       
                    }
                });
                result.stderr?.on('data', (data) => {
                    // console.log(data);
                    // Handle stderr data if needed
                });
            } catch (error) {
                reject(error);
            }
        });
}

export default eclipse_setup;

function getEquoChromiumPageAndOpenWorkflow(pages: Page[]) {
    const page1 = pages.find(page => page.url().includes('diagram'));
    const url = page1?.url();
    const updatedUrl = url?.replace(/path=[^&]+/, `path=${encodedNewPath}`);
    page1?.goto(updatedUrl ? updatedUrl : '');
    return page1;
}

async function connectToEquoChromiumWithinEclipse() {
    // Connect to the Equo Chromium browser within Eclipse
    const browser: Browser = await chromium.connectOverCDP('http://localhost:8888');
    const pages = browser.contexts()[0].pages();
    return pages;
}
