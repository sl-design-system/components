import asSvg from '@figma-export/output-components-as-svg'
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import { argv } from 'node:process';
import { sep } from 'path';

const fileId = argv.at(4),
  theme = argv.at(5);

export default {
  commands: [
    [
      'components',
      {
        fileId,
        onlyFromPages: ['Custom Icons'], //this is case sensitive, make sure your Figma page name matches exactly
        transformers: [
          transformSvgWithSvgo({
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
          asSvg({
            output: `../packages/themes/${theme}/icons`,
            getDirname: (options) => `.${sep}${options.dirname}`
          })
        ]
      }
    ]
  ]
};
