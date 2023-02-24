export default {
  /** Globs to analyze */
  globs: [
    './../../packages/core/src/**/*.ts',
    './../../packages/editor/src/**/*.ts',
    './../../packages/grid/src/**/*.ts'
  ],
  /** Directory to output CEM to */
  outdir: 'src/site/_data/custom-elements',
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Run in watch mode, runs on file changes */
  watch: false,
  /** Include third party custom elements manifests */
  dependencies: true,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: false,
  /** Enable special handling for litelement */
  litelement: true
}
