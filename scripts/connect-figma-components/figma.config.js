/** @type {import('@figma/code-connect').CodeConnectConfig} */
module.exports = {
  codeConnect: {
    include: ['**/*.figma.ts'],
    exclude: ['**/node_modules/**'],
    parser: 'custom'
  }
};
