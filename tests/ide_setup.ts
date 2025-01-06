import { Page } from '@playwright/test';
import vscode_setup from './vscode_setup';
import theia_setup from './theia_setup';
import eclipse_setup from './eclipse_setup';

// Function to setup the IDE environment based on the provided IDE name
export async function setup_ide(ide: string, page: Page) {
    // Check which IDE is provided and call the respective setup function
    switch (ide) {
        case 'vscode':
            const vscodePage = await vscode_setup(page); 
            return vscodePage;
        case 'theia':
            const theiaPage = await theia_setup(page); 
            return theiaPage;
        case 'eclipse':
            const eclipsePage = await eclipse_setup(page);
            return eclipsePage;
    }
}
