import { exec } from 'child_process';
import StyleDictionary from 'style-dictionary';
import * as FileHeaders from './lib/file-headers.js';
import * as Formats from './lib/formats.js';
import * as Transforms from './lib/transforms.js';
import * as TransformGroups from './lib/transform-groups.js';
import figmaThemes from './src/figma/$themes.json' assert { type: 'json' };

const cwd = new URL('.', import.meta.url).pathname;

// The name, e.g. "sanoma-learning"
const name = process.argv.at(2);

// The theme variants, extracted from "$themes.json"
const themes = figmaThemes
  .filter(theme => theme.name.startsWith(name + '/'))
  .map(({ name: themeName, selectedTokenSets }) => {
    return {
      variant: themeName.substring(name.length + 1),
      tokenSets: Object
        .entries(selectedTokenSets)
        .filter(([_, enabled]) => enabled === 'enabled')
        .map(([name]) => name)
    };
  });

// Remove "core" and "base" from the specific variants
themes.forEach(theme => {
  theme.tokenSets = theme.tokenSets.filter(set => {
    return set !== 'core' && !set.endsWith('/base');
  });
});

// Add a "base" variant for optimization
themes.push({
  variant: 'base',
  tokenSets: ['core', `${name}/base`]
});

// Run the token transformer for all variants
await Promise.all(themes.map(({ variant, tokenSets }) => {
  return new Promise((resolve, reject) => {
    const output = `src/themes/${name}/${variant}.json`;

    exec(`yarn run token-transformer src/figma ${output} ${tokenSets.join(',')} --resolveReferences=false`, { cwd }, error => {
      if (error) {
        console.log(error);
        reject(error);
      }
    
      resolve();
    });
  });
}));

StyleDictionary
  .registerFileHeader(FileHeaders.legal)
  .registerFormat(Formats.cssAllInOne)
  .registerFormat(Formats.cssClasses)
  .registerFormat(Formats.cssVariables)
  .registerFormat(Formats.scssMixins)
  .registerTransform(Transforms.palette)
  .registerTransform(Transforms.shadow)
  .registerTransform(Transforms.sizePx)
  .registerTransformGroup(TransformGroups.css)
  .extend({
    source: ['base.json', 'light.json', 'dark.json'],
    platforms: {
      all: {
        transformGroup: 'css',
        prefix: 'sl',
        buildPath: './',
        files: [
          {
            destination: 'all.css',
            format: 'css/all-in-one',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            }
          }
        ]
      },
      global: {
        transformGroup: 'css',
        prefix: 'sl',
        buildPath: './',
        files: [
          {
            destination: 'global.css',
            format: 'css/classes',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            }
          }
        ]
      },
      mixins: {
        transformGroup: 'css',
        files: [
          {
            destination: 'mixins.scss',
            format: 'scss/mixins',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            }
          }
        ]
      },
      variants: {
        transformGroup: 'css',
        prefix: 'sl',
        buildPath: './',
        files: themes.map(theme => {
          return {
            destination: `${theme.variant}.css`,
            format: 'css/variables',
            filter: token => token.filePath.startsWith(theme.variant),
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            }
          };
        })
      }
    }
  })
  .buildAllPlatforms();
