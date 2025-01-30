import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    // Add more projects for other browsers if needed
  ],
};

export default config;
