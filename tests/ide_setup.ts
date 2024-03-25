import { Page } from '@playwright/test';
import vscode_setup from './vscode_setup'; // Import setup function for Visual Studio Code
// import eclipse_setup from './eclipse_setup'; // Import setup function for Eclipse
// import theia_setup from './theia_setup'; // Import setup function for Theia

// Function to setup the IDE environment based on the provided IDE name
export async function setup_ide(ide: string, page: Page) {
    // Check which IDE is provided and call the respective setup function
    if (ide === 'vscode') {
        vscode_setup(page); // Setup for Visual Studio Code
    } else if (ide === 'theia') {
        theia_setup(page); // Setup for Theia
    } else if (ide === 'eclipse') {
        eclipse_setup(page); // Setup for Eclipse
    } else {
        // If the IDE name is not recognized or blank, set up all IDEs
        vscode_setup(page); // Setup for Visual Studio Code
        // theia_setup(page); // Setup for Theia
        // eclipse_setup(page); // Setup for Eclipse
    }
}
