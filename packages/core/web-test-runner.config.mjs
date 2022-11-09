// @ts-check
import { playwrightLauncher } from '@web/test-runner-playwright';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  nodeResolve: true,

  rootDir: '../../',

  files: [
    'dist/**/*.spec.js'
  ],

  browsers: [playwrightLauncher({ product: 'chromium' })]
};

export default config;
