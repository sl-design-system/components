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
  name: 'sl/name/css/fontFamilies',
  type: 'value',
  matcher: token => (token.$type ?? token.type) === 'fontFamilies',
  transformer: token => (token.$value ?? token.value).replace(/\s+/g, '-').toLowerCase()
});

StyleDictionary.registerTransform({
  name: 'sl/size/css/lineHeight',
  type: 'value',
  matcher: token => (token.$type ?? token.type) === 'lineHeights',
  transformer: token => {
    const value = token.$value ?? token.value;

    return value?.endsWith('%') ? transformLineHeight(value) : `${value}px`;
  }
});

StyleDictionary.registerTransform({
  name: 'sl/size/css/paragraphSpacing',
  type: 'value',
  matcher: token => (token.$type ?? token.type) === 'paragraphSpacing',
  transformer: token => {
    const value = token.$value ?? token.value;

    return typeof value === 'string' && !value.endsWith('px') ? `${value}px` : value;
  }
});

StyleDictionary.registerTransform({
  name: 'sl/wrapMathInCalc',
  type: 'value',
  transitive: true,
  matcher: token => typeof token.attributes?.original?.value === 'string',
  transformer: (token, config, options) => {
    if (token.attributes.original.value.match(/^(?!calc|rgb|hsl).*\s[\+\-\*\/]\s.*/)) {
      token.attributes.original.value = `calc(${token.attributes.original.value})`;
    }

    return token.$value ?? token.value;
  }
});

const build = async () => {
  const $themes = JSON.parse(await readFile(join(cwd, '../packages/tokens/src/$themes.json'), 'utf8'));

  const filterFiles = files => async token => {
    const filePath = token.filePath ?? token.attributes.filePath;

    return files.some(file => filePath.endsWith(file));
  };

  const themeBase = join(cwd, '../packages/themes');

  const configs = Object
    .entries(permutateThemes($themes))
    .map(([name, tokensets]) => {
      const [theme, variant] = name.split('/');

      const files = [
        {
          destination: `${themeBase}/${theme}/${variant}.css`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          }
        },
        {
          destination: `${themeBase}/${theme}/css/base.css`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          },
          filter: filterFiles(['core.json', 'base.json'])
        },
        {
          destination: `${themeBase}/${theme}/scss/base.scss`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true,
            selector: '@mixin sl-theme-base'
          },
          filter: filterFiles(['core.json', 'base.json'])
        },
        {
          destination: `${themeBase}/${theme}/css/${variant}.css`,
          format: 'css/variables',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          },
          filter: filterFiles([`${variant}.json`])
        },
        {
          destination: `${themeBase}/${theme}/scss/${variant}.scss`,
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
        log: {
          warnings: 'disabled'
        },
        source: tokensets.map(tokenset => join(cwd, `../packages/tokens/src/${tokenset}.json`)),
        platforms: {
          css: {
            transformGroup: 'tokens-studio',
            transforms: [
              'name/kebab',
              'sl/name/css/fontFamilies',
              'sl/size/css/lineHeight',
              'sl/size/css/paragraphSpacing',
              'sl/wrapMathInCalc'
            ],
            prefix: 'sl',
            files
          }
        }
      };
    });

  // for (const cfg of configs) {
    const sd = new StyleDictionary(configs[13]);

    await sd.buildAllPlatforms();
  // }
};

build();
