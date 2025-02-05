import { Page, chromium, Browser } from '@playwright/test';
import { exec } from 'child_process';
import { log } from 'console';
import * as path from "path"; 

let workflowPath = path.resolve(__dirname, "../resources/test-workflow/example1.wf");
workflowPath = workflowPath.replace(/\\/g, "/"); // Convert Windows backslashes to forward slashes
const encodedNewPath = encodeURIComponent(workflowPath);

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
                    console.log(data);
                    // Handle stderr data if needed
                });
            } catch (error) {
                reject(error);
            }
        });
}

export default eclipse_setup;

async function getEquoChromiumPageAndOpenWorkflow(pages: Page[]) {
    const page1 = pages.find(page => page.url().includes("diagram"));
    if (!page1) {
        console.error("No page found with 'diagram' in the URL.");
        return;
    }
    const url = page1.url();
    let updatedUrl;
    if (url.includes("path=")) {
        updatedUrl = url.replace(/path=[^&]*/, `path=${encodedNewPath}`);
    } else {
        const separator = url.includes("?") ? "&" : "?";
        updatedUrl = `${url}${separator}path=${encodedNewPath}`;
    }
    await page1.goto(updatedUrl);
    await page1.waitForTimeout(50)
    return page1;
}

async function connectToEquoChromiumWithinEclipse() {
    // Connect to the Equo Chromium browser within Eclipse
    const browser: Browser = await chromium.connectOverCDP('http://localhost:8888');
    const pages = browser.contexts()[0].pages();
    return pages;
}
