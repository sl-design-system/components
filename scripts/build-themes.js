import { permutateThemes, register, transformLineHeight } from '@tokens-studio/sd-transforms';
import { kebabCase } from 'change-case';
import cssnano from 'cssnano';
import { readFile, writeFile } from 'fs/promises';
import { log } from 'node:console';
import { argv } from 'node:process';
import { join } from 'path';
import postcss from 'postcss';
import StyleDictionary from 'style-dictionary';

// Match math expressions that are not wrapped in a `calc`, `rgb` or `hsl` function.
const mathPresent = /^(?!calc|color-mix|rgb|hsl).*\s[\+\-\*\/]\s.*/;

register(StyleDictionary);

StyleDictionary.registerTransform({
  name: 'name/kebabWithCamel',
  type: 'name',
  transform: function (token, config) {
    const { filePath, path } = token;

    // If the token is a new contextual token, do not kebab-case it
    if (filePath && (filePath.includes('primitives.json') || filePath.includes('system.json') || filePath.endsWith('-new.json'))) {
      return [config.prefix].concat(path).join('-');
    } else {
      return kebabCase([config.prefix].concat(path).join(' '));
    }
  }
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

// Convert `rgba` functions into `color-mix` so it works with hex colors
StyleDictionary.registerTransform({
  name: 'sl/color/transparentColorMix',
  type: 'value',
  transitive: true,
  filter: token => token.type === 'color' && token.original?.value?.startsWith('rgba'),
  transform: token => {
    const [_, color, opacity] = token.original?.value?.match(/rgba\(\s*(\S+)\s*,\s*(\S+)\)/) ?? [];

    if (color && opacity) {
      if (opacity.endsWith('%')) {
        token.original.value = `color-mix(in srgb, ${color} ${opacity}, transparent)`;
      } else {
        token.original.value = `color-mix(in srgb, ${color} calc(${opacity} * 100%), transparent)`;
      }
    }

    return token.value;
  }
});

// Transform font families to kebab-case
StyleDictionary.registerTransform({
  name: 'sl/name/css/fontFamilies',
  type: 'value',
  filter: token => token.type === 'fontFamily',
  transform: token => token.value.replace(/\s+/g, '-').replaceAll('\'', '').toLowerCase()
});

// Transform line heights to px if they are not percentages
StyleDictionary.registerTransform({
  name: 'sl/size/css/lineHeight',
  type: 'value',
  transitive: true,
  filter: token => token.type === 'lineHeight',
  transform: token => {
    const value = token.value;

    return value?.endsWith('%') ? transformLineHeight(value) : `${value}px`;
  }
});

// Transform paragraph spacings to px
StyleDictionary.registerTransform({
  name: 'sl/size/css/paragraphSpacing',
  type: 'value',
  filter: token => token.type === 'paragraphSpacing',
  transform: token => {
    const value = token.value;

    return typeof value === 'string' && !value.endsWith('px') ? `${value}px` : value;
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

    return token.value;
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

  /**
   * Filter out the `space.<number>` tokens since they are just aliases
   * for `size.<number>`. We don't want to generate CSS variables for them.
   *
   * Commented out for now, until there are no more references to `space.<number>`.
   */
  const excludeSpaceTokens = token => {
    if (token.type !== 'dimension') {
      return true;
    } else {
      const [name, number] = token.path;

      return !(name === 'space' && !Number.isNaN(Number(number)));
    }
  };

  const configs = Object
    .entries(permutateThemes($themes))
    .map(([name, tokensets]) => {
      const [theme, variant] = name.split('/');

      const files = [
        {
          destination: `${themeBase}/${theme}/${variant}.css`,
          // filter: excludeSpaceTokens,
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
            // filter: excludeSpaceTokens,
            format: 'css/variables',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            },
            filter: filterFiles(['core.json', 'base.json'])
          },
          {
            destination: `${themeBase}/${theme}/scss/base.scss`,
            // filter: excludeSpaceTokens,
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
            // filter: excludeSpaceTokens,
            format: 'css/variables',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            },
            filter: filterFiles([`${variant}.json`])
          },
          {
            destination: `${themeBase}/${theme}/scss/${variant}.scss`,
            // filter: excludeSpaceTokens,
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
          verbosity: argv.includes('--verbose') ? 'verbose' : undefined,
          warnings: 'disabled'
        },
        source: tokensets.map(tokenset => join(cwd, `../packages/tokens/src/${tokenset}.json`)),
        preprocessors: ['tokens-studio'],
        platforms: {
          css: {
            transformGroup: 'tokens-studio',
            transforms: [
              'name/kebabWithCamel',
              'sl/name/css/fontFamilies',
              'sl/size/css/lineHeight',
              'sl/size/css/paragraphSpacing',
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
