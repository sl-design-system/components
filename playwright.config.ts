import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,

  projects: [
    {
      name: 'angular',
      testDir: './tests/angular',
      use: {
        baseURL: 'http://localhost:6007'
      }
    },
    {
      testDir: './tests',
      name: 'storybook',
      use: {
        baseURL: 'http://localhost:6006'
      },
      testMatch: /storybook\/.*\.spec\.ts/
    },
    {
      name: 'website',
      testDir: './website/tests',
      use: {
        baseURL: 'http://localhost:8000'
      },
      testMatch: /website\/.*\.spec\.ts/
    }
  ]
});
