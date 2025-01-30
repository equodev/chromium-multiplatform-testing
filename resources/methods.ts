import { expect } from '@playwright/test';
import { execSync } from 'child_process';
import os from 'os';

export async function assertTextHasBeenReplaced(debugPage: any, nodeClass: any, text: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const element = await debugPage.locator(nodeClass).first();
  const textContent = await element.textContent();
  expect(textContent).toContain(text);
}

export async function replaceNodeText(debugPage: any, nodeClass: any, text: string) {
  await debugPage.locator(nodeClass).first().dblclick();
  await debugPage.locator('input').first().fill(text);
  await debugPage.locator('input').first().press("Enter");
}

export async function terminateProcessOnPort(ide: string | undefined) {
  const port = ide === "vscode" ? 8000 : ide === "theia" ? 3000 : null;
  const platform = os.platform();

  if (port) {
    try {
      let command: string;
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
  if (ide === 'eclipse') {
    try {
      let command: string;
      if (platform === 'win32') {
        // Windows: Use taskkill to close Eclipse by name
        command = `taskkill /IM eclipse.exe /F`;  // Force kill eclipse.exe
      } else if (platform === 'darwin') {
        // macOS: Use killall to close Eclipse by name
        command = `killall eclipse`;
      } else {
        // Linux: Use killall to close Eclipse by name
        command = `killall eclipse`;
      }
      // Execute the command to terminate the Eclipse process
      execSync(command, { stdio: 'ignore' });
      console.log('Eclipse process terminated.');
    } catch (error) {
      console.error('Failed to terminate Eclipse process.');
    }
  }
}