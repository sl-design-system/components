// @ts-check
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: true,
  rootDir: '.',
  
  files: [
    'packages/components/**/src/**/*.spec.ts',
  ],

  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [a11ySnapshotPlugin(), esbuildPlugin({ ts: true, target: 'es2021' })],

  coverageConfig: {
    report: true,
    exclude: ['**/index.ts', '**/register.ts', '**/*.scss.ts']
  },

  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
        <script src="/node_modules/@oddbird/popover-polyfill/dist/popover.min.js"></script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `
};

export default config;
