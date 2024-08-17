import { test, expect, Keyboard } from '@playwright/test';
import { setup_ide } from './ide_setup';

test('Test example', async ({ page }) => {
  // IDE Setup
  test.setTimeout(60000)
  const ide = process.env.IDE?.toLowerCase() ?? 'vscode'
  console.log("Currently running the tests on", ide);
  await setup_ide(ide, page)

  // Match IDE
  switch (ide) {
    case "vscode": {
      await page.frameLocator('iframe[class="webview ready"]')
        .frameLocator('iframe[title="undefined"]')
        .locator('#workflow-diagram_0')
        .getByText('Push').click();
      await page.keyboard.press("Delete");
      await page.waitForTimeout(5000);
      break;
    }
    case "theia": {
      await page.waitForSelector('g#workflow-diagram_0_task0');
      const pushbtn = page.locator(`[id=workflow-diagram_0_task0][data-svg-metadata-parent-id]`);
      await pushbtn.click();
      await page.keyboard.down("Delete");
      await page.waitForTimeout(2000);
      await page.keyboard.press('Control+Z');
      await page.waitForTimeout(2000);
      break;
    }
    default: {
      console.log("asd"); // Eclipse TODO
      break;
    }
  }
});
