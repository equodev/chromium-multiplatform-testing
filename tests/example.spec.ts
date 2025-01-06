// import { test, expect, Keyboard, Page, Browser} from '@playwright/test';
import { test, Browser, Page } from '@playwright/test';
import { setup_ide } from './ide_setup';
import { execSync } from 'child_process';
import { platform } from 'os';

const isMac = () => platform() === 'darwin';
const ide = process.env.IDE?.toLowerCase() ?? 'vscode';

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
  test.setTimeout(30000);
  console.log("Currently running the tests on", ide);
  let testPage: any = await setup_ide(ide, page);
  let vscodeIframe;
  if (ide === 'vscode') {
    vscodeIframe = testPage.frameLocator('iframe.webview.ready').frameLocator('iframe');
  }
  const nodeClass = 'g.node.task.manual.classForTestingPurposes'
  await removeNodeAndUndo(testPage, vscodeIframe, nodeClass);
  await page.close();
});

async function removeNodeAndUndo(debugPage, iframe, nodeClass) {
  const targetLocator = iframe ?? debugPage;
  await targetLocator.locator(nodeClass).first().click();
  await debugPage.keyboard.press("Delete");
  await debugPage.waitForTimeout(2000);
  await debugPage.keyboard.press(`${isMac() ? 'Meta' : 'Control'}+Z`);
  await debugPage.waitForTimeout(2000);
  ide === 'vscode' ? await debugPage.close() : '';
}


