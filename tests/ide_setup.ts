import { Page } from '@playwright/test';
import vscode_setup from './vscode_setup'; // Import setup function for Visual Studio Code
import theia_setup from './theia_setup';
import eclipse_setup from './eclipse_setup ';

// Function to setup the IDE environment based on the provided IDE name
export async function setup_ide(ide: string, page: Page) {
    // Check which IDE is provided and call the respective setup function
    switch (ide) {
        case 'vscode':
            await vscode_setup(page); 
            break;
        case 'theia':
            await theia_setup(page); 
            break;
        case 'eclipse':
            await eclipse_setup(page);
            break;
        default:
            // If the IDE name is not recognized or blank, set up all IDEs
            await vscode_setup(page); // Setup for Visual Studio Code
            // theia_setup(page); // Setup for Theia
            // eclipse_setup(page); // Setup for Eclipse
            break;
    }
}
