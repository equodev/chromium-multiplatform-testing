import { test, expect, Keyboard, Page, Browser} from '@playwright/test';
import { setup_ide } from './ide_setup';
import { execSync } from 'child_process';
import os, { platform } from 'os';

const ide = process.env.IDE?.toLowerCase() ?? 'vscode';

test.afterEach(async () => {
  const port = ide === "vscode" ? 8000 : ide === "theia" ? 3000 : null;

  if (port) {
    try {
      let command: string;
      const platform = os.platform();
      if (platform === 'win32') {
        // Windows: use netstat to find the PID and taskkill to terminate the process
        command = `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /PID %a /F`;
      } else {
        // macOS/Linux: use lsof and kill to terminate the process
        command = `kill -9 $(lsof -t -i:${port})`;
      }
      // Execute the command to terminate the process on the specified port
      execSync(command, { stdio: 'ignore' });
      console.log(`Process on port ${port} terminated.`);
    } catch (error) {
      console.error(`Failed to kill process on port ${port ?? 'unknown'}:`);
    }
  }
});

test('Renaming node example with DOM manipulation', async ({ page }) => {
  test.setTimeout(300000); // 30 seconds timeout
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
  await debugPage.keyboard.press("Enter");

  // Assert text has been changed accordingly
  await debugPage.waitForTimeout(1000);
  const element = await targetLocator.locator(nodeClass).first();
  const textContent = await element.textContent();
  await expect(textContent).toContain("Hello");

  // Change text back to initial state
  await targetLocator.locator(nodeClass).first().dblclick();
  await targetLocator.locator('input').first().fill("Push");
  await debugPage.keyboard.press("Enter");

  // Assert text has been changed accordingly
  await debugPage.waitForTimeout(1000);
  const updatedTextContent = await element.textContent();
  await expect(updatedTextContent).toContain("Push");

  // Close browser
  ide === 'vscode' ? await debugPage.close() : '';
}