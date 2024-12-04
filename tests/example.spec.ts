import { test, expect, Keyboard, Page } from '@playwright/test';
import { ide_setup } from './ide_setup';
import { execSync } from 'child_process';
import { platform } from 'os';

const isMac = () => platform() === 'darwin';
const ide = process.env.IDE?.toLowerCase() ?? 'vscode';

test.beforeEach(async () => {
  try {
    // Run the kill command to terminate the server process
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
  await ide_setup(ide, page);

  // Match IDE
  switch (ide) {
    case "vscode": {
      const debugPage = await switchTab(page);
      const element = debugPage.frameLocator('iframe[class="webview ready"]')
      .frameLocator('iframe[title="undefined"]')
      .locator('#workflow-diagram_0')
      .getByText('Push')
      await element.click();
      await debugPage.keyboard.press("Delete");

      // Assert element has been deleted
      await expect(element).toBeHidden();
      await debugPage.waitForTimeout(1000);

      // Assert element is present again
      if (isMac()) {
        await debugPage.keyboard.press('Meta+Z');
      } else {
        await debugPage.keyboard.press('Control+Z');
      }
      await expect(element).toBeVisible();

      // Teardown
      await page.close();
      await debugPage.close();

      break;
    }
    case "theia": {
      await page.waitForSelector('g#workflow-diagram_0_task_Push');
      const pushbtn = page.locator(`[id=workflow-diagram_0_task_Push][data-svg-metadata-parent-id]`);
      await pushbtn.click();
      await page.keyboard.down("Delete");
      await expect(pushbtn).toBeHidden();
      await page.waitForTimeout(2000);

      if (isMac()) {
        await page.keyboard.press('Meta+Z');
      } else {
        await page.keyboard.press('Control+Z');
      }
      await expect(pushbtn).toBeVisible();
      await page.waitForTimeout(4000);
      // await page.close();

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
