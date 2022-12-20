// @ts-check
import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: true,

  rootDir: '../../',

  files: [
    'dist/**/*.spec.js'
  ],

  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [a11ySnapshotPlugin()]
};

export default config;
