import { exec } from 'child_process';
import StyleDictionary from 'style-dictionary';
import * as FileHeaders from './lib/file-headers.js';
import * as Formats from './lib/formats.js';
import * as Transforms from './lib/transforms.js';
import * as TransformGroups from './lib/transform-groups.js';
import themes from './src/$themes.json' assert { type: 'json' };

const id = process.argv.at(2),
  [name, variant] = id.split('/'),
  theme = themes.find(theme => theme.name === id),
  output = `dist/${name}/${variant}.json`;

const tokenSets = Object
  .entries(theme.selectedTokenSets)
  .filter(([_, enabled]) => enabled === 'enabled')
  .map(([name]) => name);

await (async () => {
  return new Promise((resolve, reject) => {
    exec(`yarn run token-transformer src ${output} ${tokenSets.join(',')} --resolveReferences=false`, error => {
      if (error) {
        reject(error);
      }
    
      resolve();
    });
  });
})();

StyleDictionary
  .registerFileHeader(FileHeaders.legal)
  .registerFormat(Formats.cssVariables)
  .registerTransform(Transforms.palette)
  .registerTransform(Transforms.shadow)
  .registerTransform(Transforms.sizePx)
  .registerTransformGroup(TransformGroups.css)
  .extend({
    source: [output],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'sl',
        buildPath: './',
        files: [
          {
            destination: `dist/${name}/${variant}.css`,
            format: 'css/variables',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            }
          }
        ]
      }
    }
  })
  .buildAllPlatforms();
