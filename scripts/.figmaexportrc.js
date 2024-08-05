import { sep } from 'path';

const fileId = process.argv.at(4);
  theme = process.argv.at(5);

module.exports = {
  commands: [
    [
      'components',
      {
        fileId,
        onlyFromPages: ['Custom Icons'], //this is case sensitive, make sure your Figma page name matches exactly
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
            output: `../packages/themes/${theme}/icons`,
            getDirname: (options) => `.${sep}${options.dirname}`
          })
        ]
      }
    ]
  ]
};
