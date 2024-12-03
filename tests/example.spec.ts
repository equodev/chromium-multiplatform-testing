// import { test, expect, Keyboard, Page, Browser} from '@playwright/test';
import { test, Browser, Page } from '@playwright/test';
import { setup_ide } from './ide_setup';
import { execSync } from 'child_process';
import { platform } from 'os';

const isMac = () => platform() === 'darwin';
const ide = process.env.IDE?.toLowerCase() ?? 'theia';

test.afterEach(async () => {
  try {
    // Run the kill command to terminate the process using port 3000
    switch (ide) {
      case "vscode":
        execSync('kill -9 $(lsof -t -i:8000)', { stdio: 'ignore' });
        console.log('Process on port 8000 terminated.');
        break;
        case "theia":
          execSync('kill -9 $(lsof -t -i:3000)', { stdio: 'ignore' });
          console.log('Process on port 3000 terminated.');
          break;
      default:
        break;
    }    
  } catch (error) {
    console.error('Failed to kill process on port 3000:', error);
  }
});

test('Test example', async ({ page }) => {
  // IDE Setup
  test.setTimeout(30000);
  console.log("Currently running the tests on", ide);
  await setup_ide(ide, page);

  // Match IDE
  switch (ide) {
    case "vscode": {
      const debugPage = await switchTab(page);
      await debugPage.frameLocator('iframe[class="webview ready"]')
        .frameLocator('iframe[title="undefined"]')
        .locator('#workflow-diagram_0')
        .getByText('Push').click();
      await debugPage.keyboard.press("Delete");
      await debugPage.waitForTimeout(2000);

      if (isMac()) {
        await debugPage.keyboard.press('Meta+Z');
      } else {
        await debugPage.keyboard.press('Control+Z');
      }

      await debugPage.waitForTimeout(2000);
      await page.close();
      await debugPage.close();

      break;
    }
    case "theia": {
      await page.waitForSelector('g#workflow-diagram_0_task_Push');
      const pushbtn = page.locator(`[id=workflow-diagram_0_task_Push][data-svg-metadata-parent-id]`);
      await pushbtn.click();
      await page.keyboard.down("Delete");
      await page.waitForTimeout(2000);

      if (isMac()) {
        await page.keyboard.press('Meta+Z');
      } else {
        await page.keyboard.press('Control+Z');
      }
      await page.waitForTimeout(2000);
      await page.close();

      break;
    }
    case "eclipse": {
      await page.waitForSelector('g#workflow-diagram_0_task_Push');
      const pushbtn = page.locator(`[id=workflow-diagram_0_task_Push][data-svg-metadata-parent-id]`);
      await pushbtn.click();
      await page.keyboard.down("Delete");
      await page.waitForTimeout(2000);

      if (isMac()) {
        await page.keyboard.press('Meta+Z');
      } else {
        await page.keyboard.press('Control+Z');
      }

      await page.waitForTimeout(2000);
      await page.close();
      break;
    }
    default: {
      console.log("Please input desired IDE");
      break;
    }
  }
});

async function switchTab(page: Page) {
  const pages = page.context().pages();
  const debugPage = pages[1];
  await debugPage.bringToFront();
  return debugPage;
}
