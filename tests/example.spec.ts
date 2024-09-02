import { test, expect, Keyboard, Page } from '@playwright/test';
import { setup_ide } from './ide_setup';

test('Test example', async ({ page }) => {
  // IDE Setup
  test.setTimeout(30000)
  const ide = process.env.IDE?.toLowerCase() ?? 'vscode'
  console.log("Currently running the tests on", ide);
  await setup_ide(ide, page)

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
      await debugPage.keyboard.press('Control+Z');
      await debugPage.waitForTimeout(3000);
      break;
    }
    case "theia": {
      await page.waitForSelector('g#workflow-diagram_0_t ask0');
      const pushbtn = page.locator(`[id=workflow-diagram_0_task0][data-svg-metadata-parent-id]`);
      await pushbtn.click();
      await page.keyboard.down("Delete");
      await page.waitForTimeout(2000);
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(2000);
      break;
    }
    case "eclipse": {
      await page.waitForSelector('g#workflow-diagram_0_t ask0');
      const pushbtn = page.locator(`[id=workflow-diagram_0_task0][data-svg-metadata-parent-id]`);
      await pushbtn.click();
      await page.keyboard.down("Delete");
      await page.waitForTimeout(2000);
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(2000);
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