export default {
  /** Globs to analyze */
  globs: ['../packages/components/**/*.ts'],
  exclude: ['../packages/components/**/*.{d,spec,stories}.ts'],
    /** Directory to output CEM to */
  outdir: 'src/site/_data/custom-elements',
  /** Enable special handling for litelement */
  litelement: true
}
