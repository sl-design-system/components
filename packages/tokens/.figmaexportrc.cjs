const path = require('path'),
  fileId = process.argv.at(-1);

module.exports = {
  commands: [
    [
      'components',
      {
        fileId,
        onlyFromPages: ['Custom Icons'],
        transformers: [
          require('@figma-export/transform-svg-with-svgo')({
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false
                  }
                }
              },
              {
                name: 'removeAttrs',
                params: {
                  attrs: 'fill'
                }
              },
              {
                name: 'removeDimensions',
                active: true
              }
            ]
          })
        ],
        outputters: [
          require('@figma-export/output-components-as-svg')({
            output: './icons',
            getDirname: (options) => `.${path.sep}${options.dirname}`
          })
        ]
      }
    ]
  ]
};
