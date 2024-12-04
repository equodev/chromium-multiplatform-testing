import { test, Page } from '@playwright/test'; 
import { exec } from 'child_process';

const path = `${__dirname.split('tests')[0]}glsp-theia-integration`

async function eclipse_setup(page: Page) { 
    // page.pause();
    await page.goto('localhost:8888');
    await page.click('#items > p > a')
    const pushbtn = page.locator('#workflow_Editor_1_task0_automated')
    console.log(pushbtn);
    await pushbtn.click()
    await page.keyboard.down("Delete");        
}

export default eclipse_setup;