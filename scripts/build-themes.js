import { permutateThemes, register, transformDimension, transformLineHeight } from '@tokens-studio/sd-transforms';
import cssnano from 'cssnano';
import { readFile, writeFile } from 'fs/promises';
import { argv } from 'node:process';
import { join } from 'path';
import postcss from 'postcss';
import StyleDictionary from 'style-dictionary';

// Match math expressions that are not wrapped in a `calc`, `rgb` or `hsl` function.
const mathPresent = /^(?!calc|color-mix|rgb|hsl).*\s[\+\-\*\/]\s.*/;

register(StyleDictionary);

StyleDictionary.registerFileHeader({
  name: 'sl/legal',
  fileHeader: () => {
    return [
      `Copyright ${new Date().getFullYear()} Sanoma Learning`,
      'SPDX-License-Identifier: Apache-2.0'
    ];
  }
});

// Convert `rgba` functions into `color-mix` so it works with hex colors
StyleDictionary.registerTransform({
  name: 'sl/color/transparentColorMix',
  type: 'value',
  transitive: true,
  filter: token => token.type === 'color' && token.original?.value?.startsWith('rgba'),
  transform: token => {
    const [_, color, opacity] = token.original?.value?.match(/rgba\((\S+)\s*,\s*(\S+)\)/) ?? [];

    if (color && opacity) {
      token.original.value = `color-mix(in srgb, ${color}  calc(${opacity} * 100%), transparent)`;
    }

    return token.$value ?? token.value;
  }
});

// Transform font families to kebab-case
StyleDictionary.registerTransform({
  name: 'sl/name/css/fontFamilies',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'fontFamilies',
  transform: token => (token.$value ?? token.value).replace(/\s+/g, '-').replaceAll('\'', '').toLowerCase()
});

// Transform line heights to px if they are not percentages
StyleDictionary.registerTransform({
  name: 'sl/size/css/lineHeight',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'lineHeights',
  transform: token => {
    const value = token.$value ?? token.value;

    return value?.endsWith('%') ? transformLineHeight(value) : `${value}px`;
  }
});

// Transform paragraph spacings to px
StyleDictionary.registerTransform({
  name: 'sl/size/css/paragraphSpacing',
  type: 'value',
  filter: token => (token.$type ?? token.type) === 'paragraphSpacing',
  transform: token => {
    const value = token.$value ?? token.value;

    return typeof value === 'string' && !value.endsWith('px') ? `${value}px` : value;
  }
});

// Overwrite the 'ts/size/px` transform to append 'px' to '0' values
StyleDictionary.registerTransform({
  name: 'sl/size/css/px',
  type: 'value',
  filter: token => {
    const type = token.$type ?? token.type;
    return (
      typeof type === 'string' &&
      ['sizing', 'spacing', 'borderRadius', 'borderWidth', 'fontSizes', 'dimension'].includes(
        type,
      )
    );
  },
  transform: token => {
    const value = token.$value ?? token.value;

    return parseFloat(value) === 0 ? `${value}px` : transformDimension(value);
  }
});

// Wrap math expressions in a `calc` function
StyleDictionary.registerTransform({
  name: 'sl/wrapMathInCalc',
  type: 'value',
  transitive: true,
  filter: token => typeof token.original?.value === 'string' && mathPresent.test(token.original.value),
  transform: token => {
    token.original.value = `calc(${token.original.value})`;

    return token.$value ?? token.value;
  }
});

const build = async (production = false) => {
  const cwd = new URL('.', import.meta.url).pathname,
    $themes = JSON.parse(await readFile(join(cwd, '../packages/tokens/src/$themes.json'), 'utf8'));

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
            outputReferences: !production
          }
        }
      ];

      if (production) {
        files.push(
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
        );
      }
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
              'sl/size/css/px',
              'sl/color/transparentColorMix',
              'sl/wrapMathInCalc'
            ].filter(Boolean),
            prefix: 'sl',
            files
          }
        },
        theme,
        variant
      };
    });

  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg);

    await sd.buildAllPlatforms();

    if (production) {
      const from = join(themeBase, cfg.theme, cfg.variant + '.css'),
        to = join(themeBase, cfg.theme, cfg.variant + '.min.css'),
        css = await readFile(from, 'utf8');

      const result = await postcss([
        cssnano({ preset: 'default' })
      ]).process(css, { from, to });

      await writeFile(to, result.css, 'utf8');
    }
  }
};

build(argv.includes('--production'));
