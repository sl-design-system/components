import { importCssSheet } from '@sl-design-system/rolldown-plugin-css-sheet';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [importCssSheet()],
  test: {
    onConsoleLog: log => {
      return !(
        log === 'null' ||
        log == '[Error: ResizeObserver loop completed with undelivered notifications.]' ||
        log.startsWith('Lit is in dev mode')
      );
    },
    projects: [
      {
        extends: true,
        plugins: [
          importCssSheet(),
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: '.storybook' })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }]
          }
        }
      },
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['packages/components/**/*.spec.ts', 'examples/lit/**/*.spec.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              contextOptions: {
                locale: 'en',
                reducedMotion: 'reduce'
              }
            }),
            instances: [{ browser: 'chromium' }],
            viewport: { width: 1024, height: 768 }
          },
          setupFiles: 'vitest.setup.ts'
        }
      }
    ]
  }
});
