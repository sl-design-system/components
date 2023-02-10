export default {
  /** Globs to analyze */
  globs: ['./../../packages/core/**/*.ts'], // TODO: what about editor and grid coponents?
  /** Globs to exclude */
  // exclude: ['src/foo.js'],
  /** Directory to output CEM to */
  outdir: 'dist/site/test', // TODO: different for prod and dev
  /** Run in dev mode, provides extra logging */
  dev: true,
  /** Run in watch mode, runs on file changes */
  watch: true,
  /** Include third party custom elements manifests */
  dependencies: true,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: false,
  /** Enable special handling for litelement */
  litelement: true,
  /** Enable special handling for catalyst */
  catalyst: false,
  /** Enable special handling for fast */
  fast: false,
  /** Enable special handling for stencil */
  stencil: false,
  /** Provide custom plugins */
  plugins: [
    //myAwesomePlugin()
  ],

  /** Overrides default module creation: */
/*  overrideModuleCreation: ({ts, globs}) => {
    const program = ts.createProgram(globs, defaultCompilerOptions);
    const typeChecker = program.getTypeChecker();

    return program.getSourceFiles().filter(sf => globs.find(glob => sf.fileName.includes(glob)));
  },*/
}
