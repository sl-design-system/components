/** @type {import('rollup').RollupOptions} */
export default {
  input: {
    'button/index': 'development/button/index.js',
    'button/register': 'development/button/register.js',
  },
  output: {
    dir: '.',
    preserveModules: true
  },
  // external: ['lit', 'lit/decorators.js', '@lit/localize', 'tslib']
};
