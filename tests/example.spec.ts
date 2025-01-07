// import { test, expect, Keyboard, Page, Browser} from '@playwright/test';
import { test, Browser, Page, expect } from '@playwright/test';
import { setup_ide } from './ide_setup';
import { execSync } from 'child_process';
import { platform } from 'os';

const isMac = () => platform() === 'darwin';
const ide = process.env.IDE?.toLowerCase() ?? 'eclipse';

test.afterEach(async () => {
  const port = ide === "vscode" ? 8000 : ide === "theia" ? 3000 : null;
  try {
    if (port) {
      execSync(`kill -9 $(lsof -t -i:${port})`, { stdio: 'ignore' });
      console.log(`Process on port ${port} terminated.`);
    }
  } catch (error) {
    console.error(`Failed to kill process on port ${port ?? 'unknown'}:`, error);
  }
});

test('Remove first node', async ({ page }) => {
  test.setTimeout(15000);
  console.log("Currently running the tests on", ide);
  let testPage: any = await setup_ide(ide, page);
  let vscodeIframe;
  if (ide === 'vscode') {
    vscodeIframe = testPage.frameLocator('iframe.webview.ready').frameLocator('iframe');
  }
  const nodeClass = 'g.node.task.manual.classForTestingPurposes'
  await renameNodeExample(testPage, vscodeIframe, nodeClass);
  await page.close();
});

async function renameNodeExample(debugPage, iframe, nodeClass) {
  const targetLocator = iframe ?? debugPage;

  // Change initial node text
  await targetLocator.locator(nodeClass).first().dblclick();
  await targetLocator.locator('input').first().fill("Hello");
  await targetLocator.keyboard.press("Enter");

  // Assert text has been changed accordingly
  const element = await targetLocator.locator(nodeClass).first();
  const textContent = await element.textContent();
  await expect(textContent).toContain("Hello");

  // Change text back to initial state
  await targetLocator.locator(nodeClass).first().dblclick();
  await targetLocator.locator('input').first().fill("Push");
  await targetLocator.keyboard.press("Enter");

  // Assert text has been changed accordingly
  const updatedTextContent = await element.textContent();
  await expect(updatedTextContent).toContain("Push");

  // Close browser
  ide === 'vscode' ? await debugPage.close() : '';
}

