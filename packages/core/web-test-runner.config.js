// @ts-check
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: true,

  rootDir: '../../',

  files: [
    'src/**/*.spec.ts'
  ],

  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [a11ySnapshotPlugin(), esbuildPlugin({ ts: true, target: 'auto' })],

  testRunnerHtml: testFramework => `
    <html>
      <body>
        <script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `
};

export default config;
