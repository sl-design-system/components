import { permutateThemes, registerTransforms, transformLineHeight } from '@tokens-studio/sd-transforms';
import { readFile } from 'fs/promises';
import { join } from 'path';
import StyleDictionary from 'style-dictionary';

const cwd = new URL('.', import.meta.url).pathname;

registerTransforms(StyleDictionary, {
  // options here if needed
});

StyleDictionary.registerFileHeader({
  name: 'sl/legal',
  fileHeader: () => {
    return [
      `Copyright ${new Date().getFullYear()} Sanoma Learning`,
      'SPDX-License-Identifier: Apache-2.0'
    ];
  }
});

StyleDictionary.registerTransform({
  name: 'sl/size/lineheight',
  type: 'value',
  matcher: token => (token.$type ?? token.type) === 'lineHeights',
  transformer: token => {
    const value = token.$value ?? token.value;

    return value?.endsWith('%') ? transformLineHeight(value) : `${value}px`;
  }
});

StyleDictionary.registerTransform({
  name: 'sl/size/css/paragraphspacing',
  type: 'value',
  matcher: token => (token.$type ?? token.type) === 'paragraphSpacing',
  transformer: token => {
    const value = token.$value ?? token.value;

    return typeof value === 'string' && !value.endsWith('px') ? `${value}px` : value;
  }
});

const build = async () => {
  const $themes = JSON.parse(await readFile(join(cwd, '../packages/tokens/src/$themes.json'), 'utf8'));

  const configs = Object
    .entries(permutateThemes($themes))
    .map(([name, tokensets]) => ({
      source: tokensets.map(tokenset => `../packages/tokens/src/${tokenset}.json`),
      platforms: {
        css: {
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab', 'sl/size/lineheight', 'sl/size/css/paragraphspacing'],
          prefix: 'sl',
          files: [
            {
              destination: `dist/${name}.css`,
              format: 'css/variables',
              options: {
                fileHeader: 'sl/legal',
                outputReferences: true
              }
            }
          ]
        }
      }
    }));

  configs.forEach(cfg => {
    const sd = new StyleDictionary(cfg);

    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
};

build();
