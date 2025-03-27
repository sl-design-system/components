import asSvgPerPage from './output-pages-to-folders-svg.js'
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo';
import { argv } from 'node:process';
import { sep } from 'path';

const fileId = argv.at(4);

export default {
  commands: [
    [
      'components',
      {
        fileId,
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
          asSvgPerPage({
            output: `../packages/themes`,
            getDirname: (options) => `.${sep}${options.dirname}`
          })
        ]
      }
    ]
  ]
};
