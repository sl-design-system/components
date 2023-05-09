import { join } from 'path';
import StyleDictionary from 'style-dictionary';
import * as FileHeaders from './lib/file-headers.js';
import * as Formats from './lib/formats.js';
import * as Transforms from './lib/transforms.js';
import * as TransformGroups from './lib/transform-groups.js';

StyleDictionary
  .registerFileHeader(FileHeaders.legal)
  .registerFormat(Formats.cssTypography)
  .registerFormat(Formats.scssTypography)
  .registerFormat(Formats.scssVariables)
  .registerTransform(Transforms.fontWeights)
  .registerTransform(Transforms.palette)
  .registerTransform(Transforms.boxShadow)
  .registerTransform(Transforms.sizePx)
  .registerTransformGroup(TransformGroups.css);

export const buildStyles = name => {
  const cwd = new URL('.', import.meta.url).pathname,
    path = join(cwd, `../packages/themes/${name}`);

  StyleDictionary.extend({
    source: [`${path}/base.json`],
    platforms: {
      base: {
        transformGroup: 'css',
        prefix: 'sl',
        files: [
          {
            destination: `${path}/base.scss`,
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
            destination: `${path}/typography.scss`,
            format: 'custom/scss/typography',
            options: {
              fileHeader: 'sl/legal',
              outputReferences: true
            }
          },
          {
            destination: `${path}/typography.css`,
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
    include: [`${path}/base.json`],
    source: [`${path}/light.json`],
    platforms: {
      variants: {
        transformGroup: 'css',
        prefix: 'sl',
        files: [
          {
            destination: `${path}/light.scss`,
            format: 'custom/scss/variables',
            options: {
              fileHeader: 'sl/legal',
              filterFile: `${path}/light.json`,
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
    include: [`${path}/base.json`],
    source: [`${path}/dark.json`],
    platforms: {
      variants: {
        transformGroup: 'css',
        prefix: 'sl',
        files: [
          {
            destination: `${path}/dark.scss`,
            format: 'custom/scss/variables',
            options: {
              fileHeader: 'sl/legal',
              filterFile: `${path}/dark.json`,
              mixinName: 'sl-theme-dark',
              outputReferences: true
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();  
};
