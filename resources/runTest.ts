const { execSync } = require("child_process");
const os = require("os");

async function runTests(ide) {
    try {
        // Set environment variable in Node.js
        process.env.IDE = ide;

        // Run Playwright test command
        execSync(`npx playwright test tests/example.spec.ts --headed`, { stdio: "inherit", env: process.env });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    const ide = process.argv[2] || "eclipse"; // Default to "eclipse"
    runTests(ide);
}

module.exports = { runTests };
