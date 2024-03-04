module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      'tsconfig.json'
    ]
  },
  ignorePatterns: [
    'src/vendor/**/*'
  ]
};
