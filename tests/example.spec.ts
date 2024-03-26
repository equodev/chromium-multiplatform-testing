import { test, expect, Keyboard } from '@playwright/test';
import { setup_ide } from './ide_setup';

test('Test example', async ({ page }) => {
  // IDE Setup
  const ide = process.env.IDE?.toLowerCase() ?? 'vscode'
  console.log(ide);

  await setup_ide(ide, page)

  await page.waitForSelector('g#workflow-diagram_0_task0');
  const pushbtn = page.locator(`[id=workflow-diagram_0_task0][data-svg-metadata-parent-id]`);
  await pushbtn.click()
  await page.keyboard.down("Delete");
  await page.waitForTimeout(5000)

})

