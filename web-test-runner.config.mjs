// @ts-check
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { readFile } from 'fs/promises';
import { env } from 'node:process';

const styles = await readFile('./packages/themes/sanoma-learning/light.css', 'utf-8');

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: true,
  rootDir: '.',

  files: [
    'packages/components/**/src/**/*.spec.ts',
  ],

  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [a11ySnapshotPlugin(), esbuildPlugin({ ts: true, tsconfig: './tsconfig.base.json' })],

  filterBrowserLogs: ({ type, args }) => {
    if (type === 'warn' && args?.at(0)?.startsWith('Lit is in dev mode.')) {
      return false;
    }

    return true;
  },
  staticLogging: env.CI === 'true',

  coverageConfig: {
    report: true,
    include: ['**/*.ts'],
    exclude: ['**/index.ts', '**/register.ts', '**/*.scss.ts']
  },

  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
        <script type="module" src="${testFramework}"></script>
        <style>${styles}</style>
      </body>
    </html>
  `
};

export default config;
