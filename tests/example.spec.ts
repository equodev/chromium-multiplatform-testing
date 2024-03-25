import { chromium } from 'playwright';
import { test, expect } from '@playwright/test';


// TODO
// Path relativo al proyecto 
// 
// 
// 
// 



test('Visual Studio Code', async () => { 
  const browser = await chromium.launch();
  const context = await browser.newContext();
  test.setTimeout(120000)
  // Open a new page
  const page = await context.newPage();

  // Navigate to the specified URL
  await page.goto('http://127.0.0.1:8000?tkn=d9b98637-0da9-4be3-8045-9940be90fe5f');
  await page.goto('http://127.0.0.1:8000/?folder=/home/fran/Desktop/glsp/glsp-vscode-integration');
  await page.getByRole('button', { name: 'Yes, I trust the authors' }).click();
  await page.getByRole('tab', { name: 'Extensions (Ctrl+Shift+X)' }).locator('a').click();
  await page.waitForTimeout(3000)
  await page.locator('.view-line').click();
  await page.getByLabel('Search Extensions in').fill('glsp');
  await page.waitForTimeout(3000)
  await page.getByLabel('Workflow GLSP Example, 0.1.0').getByRole('button', { name: 'Install' }).click();
  await page.waitForTimeout(5000)
  await page.getByRole('tab', { name: 'Explorer (Ctrl+Shift+E)' }).locator('a').click();
  await page.waitForTimeout(3000)
  await page.getByLabel('~/Desktop/glsp/glsp-vscode-integration/example').locator('a').click();
  await page.waitForTimeout(3000)
  await page.getByLabel('~/Desktop/glsp/glsp-vscode-integration/example/workflow/workspace').locator('a').click();
  await page.waitForTimeout(3000)
  await page.getByLabel('example1.wf', { exact: true }).locator('a').click();
  await page.waitForTimeout(30000)
  const frames = await page.frames()
  console.log(frames)
  // await frames[0].frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').getByRole('textbox').fill('Test');
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').getByRole('textbox').press('Enter');
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Test').click();

  await browser.close();
})