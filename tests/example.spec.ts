import { chromium } from 'playwright';
import { test, expect } from '@playwright/test';
import { vscode_setup } from '/tests/vscode_setup.ts'


// TODO
// Path relativo al proyecto 
// 



test('Test example', async () => { 


  // await frames[0].frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Push').click();
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').getByRole('textbox').fill('Test');
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').getByRole('textbox').press('Enter');
  await page.frameLocator('iframe[name="ad32f55e-8fd7-4463-acde-97d13190a954"]').frameLocator('iframe[title="undefined"]').locator('#workflow-diagram_0').getByText('Test').click();

  await browser.close();
})