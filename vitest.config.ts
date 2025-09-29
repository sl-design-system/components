/// <reference types="@vitest/browser/providers/playwright" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    onConsoleLog: log => !(log.startsWith('Lit is in dev mode') || log === 'null'),
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: '.storybook' })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      },
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['packages/components/**/*.spec.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
                context: {
                  locale: 'en',
                  reducedMotion: 'reduce'
                }
              }
            ],
            viewport: { width: 1024, height: 768 }
          },
          setupFiles: 'vitest.setup.ts'
        }
      }
    ]
  }
});
