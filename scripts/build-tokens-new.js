import { permutateThemes, registerTransforms, transformLineHeight } from '@tokens-studio/sd-transforms';
import { readFile } from 'fs/promises';
import { join } from 'path';
import StyleDictionary from 'style-dictionary';

const cwd = new URL('.', import.meta.url).pathname;

registerTransforms(StyleDictionary);

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

  const filterFiles = files => async token => {
    const filePath = token.filePath ?? token.attributes.filePath;

    return files.some(file => filePath.endsWith(file));
  };

  const configs = Object
    .entries(permutateThemes($themes))
    .map(([name, tokensets]) => {
      const [theme, variant] = name.split('/');

      console.log(`Building ${theme}/${variant}`);

      const files = [
        {
          destination: `dist/${theme}/${variant}.css`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          }
        },
        {
          destination: `dist/${theme}/css/base.css`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          },
          filter: filterFiles(['core.json', 'base.json'])
        },
        {
          destination: `dist/${theme}/scss/base.scss`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true,
            selector: '@mixin sl-theme-base'
          },
          filter: filterFiles(['core.json', 'base.json'])
        },
        {
          destination: `dist/${theme}/css/${variant}.css`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          },
          filter: filterFiles([`${variant}.json`])
        },
        {
          destination: `dist/${theme}/scss/${variant}.scss`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true,
            selector: `@mixin sl-theme-${variant}`
          },
          filter: filterFiles([`${variant}.json`])
        }
      ];

      return {
        source: tokensets.map(tokenset => `../packages/tokens/src/${tokenset}.json`),
        platforms: {
          css: {
            transformGroup: 'tokens-studio',
            transforms: ['name/kebab', 'sl/size/lineheight', 'sl/size/css/paragraphspacing'],
            prefix: 'sl',
            files
          }
        }
      };
    });

  configs.forEach(cfg => {
    // const sd = new StyleDictionary(cfg, { verbosity: 'silent' });
    const sd = new StyleDictionary(cfg);

    sd.buildAllPlatforms();
  });
};

build();
