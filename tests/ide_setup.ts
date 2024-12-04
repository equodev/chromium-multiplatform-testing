import { Page } from '@playwright/test';
import vscodeSetup from './vscode_setup';
import theiaSetup from './theia_setup';
import eclipseSetup from './eclipse_setup';

/**
 * Sets up the IDE environment based on the provided IDE name.
 *
 * @param {string} ide - The name of the IDE to set up ('vscode', 'theia', 'eclipse').
 * @param {Page} page - The Playwright page object.
 */
export async function ide_setup(ide: string, page: Page) {
  const ideName = ide.toLowerCase();

  switch (ideName) {
    case 'vscode':
      await vscodeSetup(page);
      break;

    case 'theia':
      await theiaSetup(page);
      break;

    case 'eclipse':
      await eclipseSetup(page);
      break;

    default:
      console.warn(`Unrecognized IDE "${ide}". Setting up Visual Studio Code as default.`);
      await vscodeSetup(page);
      break;
  }
}
