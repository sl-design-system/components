import { exec } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import sass from 'sass';
import StyleDictionary from 'style-dictionary';
import * as FileHeaders from './lib/file-headers.js';
import * as Formats from './lib/formats.js';
import * as Transforms from './lib/transforms.js';
import * as TransformGroups from './lib/transform-groups.js';
import figmaThemes from './src/figma/$themes.json' assert { type: 'json' };

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

const cwd = new URL('.', import.meta.url).pathname;

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
  .registerFormat(Formats.cssTypography)
  .registerFormat(Formats.cssVariables)
  .registerFormat(Formats.scssTypography)
  .registerFormat(Formats.scssVariables)
  .registerTransform(Transforms.palette)
  .registerTransform(Transforms.shadow)
  .registerTransform(Transforms.sizePx)
  .registerTransformGroup(TransformGroups.css);

StyleDictionary.extend({
  source: ['base.json'],
  platforms: {
    base: {
      transformGroup: 'css',
      prefix: 'sl',
      files: [
        {
          destination: 'base.scss',
          format: 'custom/scss/variables',
          options: {
            fileHeader: 'sl/legal',
            mixinName: 'sl-theme-base',
            outputReferences: true
          }
        }
      ]
    },
    typography: {
      transformGroup: 'css',
      prefix: 'sl',
      files: [
        {
          destination: 'typography.scss',
          format: 'custom/scss/typography',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          }
        },
        {
          destination: 'typography.css',
          format: 'custom/css/typography',
          options: {
            fileHeader: 'sl/legal',
            outputReferences: true
          }
        }
      ]
    }
  }
}).buildAllPlatforms();

// Build base & light styles
StyleDictionary.extend({
  include: ['base.json'],
  source: ['light.json'],
  platforms: {
    variants: {
      transformGroup: 'css',
      prefix: 'sl',
      files: [
        {
          destination: 'light.scss',
          format: 'custom/scss/variables',
          options: {
            fileHeader: 'sl/legal',
            filterFile: 'light.json',
            mixinName: 'sl-theme-light',
            outputReferences: true
          }
        }
      ]
    }
  }
}).buildAllPlatforms();

// Build dark styles
StyleDictionary.extend({
  include: ['base.json'],
  source: ['dark.json'],
  platforms: {
    variants: {
      transformGroup: 'css',
      prefix: 'sl',
      files: [
        {
          destination: 'dark.scss',
          format: 'custom/scss/variables',
          options: {
            fileHeader: 'sl/legal',
            filterFile: 'dark.json',
            mixinName: 'sl-theme-dark',
            outputReferences: true
          }
        }
      ]
    }
  }
}).buildAllPlatforms();

// Build all.css
const { css } = sass.compileString(`
  @import 'base.scss';
  @import 'dark.scss';
  @import 'light.scss';
  
  :root {
    @include sl-theme-base;
  }
  
  @media (prefers-color-scheme: light) {
    :root {
      @include sl-theme-light;
    }
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      @include sl-theme-dark;
    }
  }
  `, { loadPaths: [join(cwd, `src/themes/${name}`)] });

await fs.writeFile(join(cwd, `src/themes/${name}/all.css`), css);

