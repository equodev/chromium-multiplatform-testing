// vscode_setup.ts
import { Page } from 'playwright'; // Import only Page, as BrowserContext is inferred
import { exec } from 'child_process';

const path = `${__dirname.split('tests')[0]}glsp-theia-integration`

async function theia_setup(page: Page) { // Remove BrowserContext from function signature

  try {
    const result = exec(`"cd" ${path} && "yarn" start`);
    result?.stdout?.on('data', async (data) => {  
      let url = '';
      if (await data.includes('Theia app listening on')) {
        const urlRegex = /(http?:\/\/(?:[^\s.]+\.)+[^\s.]+)(?:\.|$)/;
        url = await data?.match(urlRegex)[0].slice(0, -1);;
        await page.goto(url);
      }

    });
    result?.stderr?.on('data', async (data) => {
    });
    await page.waitForTimeout(80000000)
  } catch (error) {
    console.error('Error running command:', error);
  }
    // Navigate to the specified URL
}

export default theia_setup;