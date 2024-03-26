import { test, expect, Keyboard } from '@playwright/test';
import { setup_ide } from './ide_setup';

test('Test example', async ({ page }) => {
  // IDE Setup
  test.setTimeout(60000)
  const ide = process.env.IDE?.toLowerCase() ?? 'vscode'
  console.log(ide);

  await setup_ide(ide, page)

  // await page.frameLocator('iframe[class="webview ready"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  // Interact with the element inside the iframe
  // await elementInsideIframe.click();
  // await iframe.keyboard.press("Delete");
  // await page.waitForTimeout(5000);
});
