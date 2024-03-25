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

StyleDictionary.registerFormat({
  name: 'sl/scss-mixins',
  formatter: ({ dictionary, options }) => {
    return `${options.header}\n${dictionary.allTokens.map(token => `  $sl-${token.name}: ${token.value};`).join('\n')}${options.footer}\n`;
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

  const splitSources = configs.map(({ source }) => {
    const [core, base, theme] = source,
      name = theme.split('/').at(-2),
      mode = theme.match(/.*(light|dark)\.json/)[1];

    return {
      [name]: {
        base: [core, base],
        [mode]: [theme]
      }
    };
  }).reduce((acc, val) => {
    const [name, sources] = Object.entries(val)[0];

    if (acc[name]) {
      acc[name] = { ...acc[name], ...sources };

      return acc;
    } else {
      return { ...acc, [name]: sources };
    }
  }, {});

  const splitConfigs = Object.entries(splitSources).flatMap(([name, { base, light, dark }]) => {
    return [base, light, dark].filter(Boolean).map((sources, index) => {
      const variant = sources.at(-1)?.match(/.*(light|dark)\.json/)?.at(1) ?? 'base',
        destination = `dist/${name}/scss/${variant}.scss`;

      return {
        source: sources,
        platforms: {
          css: {
            transformGroup: 'tokens-studio',
            transforms: ['name/kebab', 'sl/size/lineheight', 'sl/size/css/paragraphspacing'],
            files: [
              {
                destination,
                format: 'css/variables',
                options: {
                  // header: `@mixin sl-theme-${variant} {`,
                  // footer: '}',
                  outputReferences: true,
                  selector: `@mixin sl-theme-${variant}`
                }
              }
            ]
          }
        }
      };
    });
  });

  console.log(splitConfigs.at(-14));

  // [...configs, ...splitConfigs].forEach(cfg => {
  [splitConfigs.at(-14)].forEach(cfg => {
    const sd = new StyleDictionary(cfg);

    // sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
};

build();
