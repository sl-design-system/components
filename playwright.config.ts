import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30 * 1000,

  projects: [
    {
      name: 'storybook',
      use: {
        baseURL: 'http://localhost:6006'
      },
      testMatch: /storybook\/.*\.spec\.ts/
    },
    {
      name: 'website',
      use: {
        baseURL: 'http://localhost:8000'
      },
      testMatch: /website\/.*\.spec\.ts/
    }
  ]
});
