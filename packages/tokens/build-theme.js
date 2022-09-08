import { exec } from 'child_process';
import StyleDictionary from 'style-dictionary';
import * as FileHeaders from './lib/file-headers.js';
import * as Transforms from './lib/transforms.js';
import * as TransformGroups from './lib/transform-groups.js';
import themes from './src/$themes.json' assert { type: 'json' };

const name = process.argv.at(2),
  theme = themes.find(theme => theme.name === name);

const tokenSets = Object
  .entries(theme.selectedTokenSets)
  .filter(([_, enabled]) => enabled === 'enabled')
  .map(([name]) => name);

await (async () => {
  return new Promise((resolve, reject) => {
    exec(`yarn run token-transformer .. tokens.json ${tokenSets.join(',')} --resolveReferences=false`, error => {
      if (error) {
        reject(error);
      }
    
      resolve();
    });
  })
});

StyleDictionary
  .registerFileHeader(FileHeaders.legal)
  .registerTransform(Transforms.shadow)
  .registerTransform(Transforms.sizePx)
  .registerTransformGroup(TransformGroups.css)
  .extend({
    source: ['tokens.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'sl',
        buildPath: './',
        files: [
          {
            destination: 'tokens.css',
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
