import { test, expect, Keyboard } from '@playwright/test';
import { setup_ide } from './ide_setup';
import { exec } from 'child_process';

test('Test example', async ({ page }) => {
  // IDE Setup
  test.setTimeout(60000)

  const ideToSetup = process.env.IDE?.toLowerCase() ?? 'eclipse'

  console.log(ideToSetup);

  const example = await setup_ide(ideToSetup, page)

  let vscodeIframe;

  let vscode = ideToSetup === 'vscode';

  if (vscode) {
    vscodeIframe = example.frameLocator('iframe[class="webview ready"]').frameLocator('iframe[title="undefined"]')
  }

  let elementXpath = '//*[contains(@class, "heading sprotty-label") and text()="KeepTp"]';

  let svgElement = vscode ? await vscodeIframe.locator(elementXpath).first() : example.locator(elementXpath).first();

  let textbox = vscode ? vscodeIframe.getByRole('textbox') : example.getByRole('textbox');

  await svgElement?.click()

  await svgElement?.dblclick()

  await textbox.fill('Test');

  await textbox.press('Enter');

  await example.waitForTimeout(2000)

  let modifiedXpath = '//*[contains(@class, "heading sprotty-label") and text()="Test"]';

  expect(vscode ? vscodeIframe.locator(modifiedXpath).first() : example.locator(modifiedXpath).first()).toBeTruthy();

  await example.waitForTimeout(2000)

  if (ideToSetup === 'theia') {

    await example.keyboard.press('Control+Z');

    await example.waitForTimeout(2000)

    exec("kill -9 `lsof -t -i:3000`")
  } else if (vscode) {

    exec("kill -9 `lsof -t -i:8000`")

  } else if (ideToSetup === 'eclipse') {
    await example.keyboard.press('Control+Z');
    await example.waitForTimeout(2000)

  }
});