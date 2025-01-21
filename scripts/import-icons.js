import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fat } from '@fortawesome/pro-thin-svg-icons';
import { fasl } from '@fortawesome/sharp-light-svg-icons';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { exec } from 'child_process';
import pkg from 'eslint/use-at-your-own-risk';
import fg from 'fast-glob';
import { promises as fs, existsSync } from 'fs';
import { basename, join } from 'path';
import figmaIconPages from './figma-icon-pages.json' assert { type: 'json' };

library.add(fas, far, fal, fat, fad, fass, fasr, fasl);

const { FlatESLint } = pkg

const cwd = new URL('.', import.meta.url).pathname,
  eslint = new FlatESLint({ fix: true });

const {
  default: { icon: coreIcons }
} = await import('../packages/tokens/src/core.json', { assert: { type: 'json' } });

const getFormattedIcons = (icons, collection) => {
  return Object.entries(icons).reduce((acc, cur) => {
    if (cur[0] === collection) {
      Object.entries(cur[1]).forEach(entry => (acc = { ...acc, [entry[0]]: entry[1] }));
    }
    return acc;
  }, {});
};

const convertToIconDefinition = (iconName, style) => {
  return findIconDefinition({ prefix: getIconPrefixFromStyle(style), iconName });
};

const getColorToken = (pathCounter, style) => {
  return pathCounter === 0 && style === 'fad' ? 'accent' : 'default';
};

const getIconStyle = (iconName, text, style) => {
  const familyPrefix = text.typeset.fontFamily.icon.value === 'Font Awesome 6 Sharp' ? 'sharp-' : '',
    weight = style?.outline?.value
      ? style.outline.value.split('.').pop().replace('}', '').replace('icon-', '')
      : 'regular',
    outlineStyle = iconName?.indexOf('-solid') > 0 ? 'solid' : weight;

  return familyPrefix + outlineStyle;
};

const getIconPrefixFromStyle = style => {
  switch (style) {
    case 'solid':
      return 'fas';
    case 'light':
      return 'fal';
    case 'thin':
      return 'fat';
    case 'duotone':
      return 'fad';
    case 'sharp-light':
      return 'fasl';
    case 'sharp-solid':
      return 'fass';
    case 'sharp-regular':
      return 'fasr';
    default:
      return 'far';
  }
};

const buildIcons = async theme => {
  // 1. Get icon tokens from `base.json`
  const {
    default: { icon: { style, themeIcons }, text }
  } = await import(`../packages/tokens/src/${theme}/base.json`, { assert: { type: 'json' } });

  const icons = {
    ...getFormattedIcons(coreIcons, 'core'),
    ...themeIcons?getFormattedIcons({themeIcons},'themeIcons'):{}
  };

  // fetch all FA tokens and store these
  Object.entries(icons).map(([iconName, value]) => {
    const faIcon = convertToIconDefinition(value.value.replace('fa-', ''), getIconStyle(iconName, text, style));
    if (!faIcon) return;

    const {
        icon: [width, height, , , path]
      } = faIcon,
      paths = Array.isArray(path) ? path : [path];

    const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${paths.map((p, i) => `<path d="${p}" fill="var(--sl-icon-fill-${getColorToken(i, 'regular')})"></path>`).join('')}</svg>`;
      console.log(theme, iconName, svg);
    icons[iconName] = { ...value, svg };
  });

  const iconsFolderPath = join(cwd, `../packages/themes/${theme}/icons/`);
  if (!existsSync(iconsFolderPath)) {
    await fs.mkdir(iconsFolderPath);
  }

  for (const file of await fs.readdir(iconsFolderPath)) {
    await fs.unlink(join(iconsFolderPath, file));
  }

  // // load all custom icons from figma and store svgs
  // await new Promise((resolve, reject) => {
  //   console.log(`Extracting icons from Figma for ${theme}...`);
  //   exec(`yarn run figma-export use-config .figmaexportrc.js ${figmaIconPages[theme]} ${theme}`, { cwd }, error => {
  //     if (error) {
  //       reject(error);
  //     }

  //     resolve();
  //   });
  // });

  // 3. Convert downloaded icons to appropriate format?
  // We only need the `<path>` data for `<sl-icon>`

  const customIconFiles = await fs.readdir(iconsFolderPath);
  const iconsCustom = [];

  const filesToRead = customIconFiles.map(fileName => {
    const iconName = fileName.replace('icon=', '').replace('.svg', '');

    return fs
      .readFile(join(cwd, `../packages/themes/${theme}/icons/${fileName}`), 'utf8')
      .then(svg => {
        iconsCustom[iconName] = { svg: svg.replace('<svg ','<svg fill="var(--sl-icon-fill-default)" ') }
      });
  });

  console.log(filesToRead);
  await Promise.all(filesToRead);

  // 4. Write the output to `icons.json`???? Or just `icons.ts` which exports
  console.log(`Writing icons to ${theme}...`);
  // const filePath = join(cwd, `../packages/themes/${theme}/icons.ts`),
  //   sortedIcons = Object.fromEntries(Object.entries({ ...icons, ...coreCustomIcons, ...iconsCustom }).sort()),
  //   source = `export const icons = ${JSON.stringify(sortedIcons)||'{}'};`,
  //   results = await eslint.lintText(source, { filePath });

  //   console.log(results[0]);
  // await FlatESLint.outputFixes(results);

  // await fs.writeFile(filePath, results[0].output);
};

const buildAllIcons = async () => {
  const themes = (await fg('../packages/themes/*', { cwd, onlyDirectories: true })).filter(theme => theme.indexOf('core') < 0);

  themes.forEach(component => buildIcons(basename(component)));
};

const exportCoreIcons = async () => {
  const iconsFolderPath = join(cwd, `../packages/themes/core/icons/`);
  if (!existsSync(iconsFolderPath)) {
    await fs.mkdir(iconsFolderPath,{ recursive: true });
  }

  for (const file of await fs.readdir(iconsFolderPath)) {
    await fs.unlink(join(iconsFolderPath, file));
  }

  // load all custom icons from figma and store svgs
  await new Promise((resolve, reject) => {
    console.log(`Extracting icons from Figma for core...`);
    exec(`yarn run figma-export use-config .figmaexportrc.js Pbs7HEwKmwm6wAX9tfjk2N`, { cwd }, error => {
      if (error) {
        reject(error);
      }

      resolve();
    });
  });

  // 3. Convert downloaded icons to appropriate format?
  // We only need the `<path>` data for `<sl-icon>`

  const customIconFiles = await fs.readdir(iconsFolderPath);
  const iconsCustom = [];

  const filesToRead = customIconFiles.map(fileName => {
    const iconName = fileName.replace('icon=', '').replace('.svg', '');

    return fs
      .readFile(join(cwd, `../packages/themes/core/icons/${fileName}`), 'utf8')
      .then(svg => {
        svg = svg.replace('<svg ','<svg fill="var(--sl-icon-fill-default)" ');
        iconsCustom[iconName] = { svg }});
  });

  await Promise.all(filesToRead);

  return iconsCustom;
};

const coreCustomIcons  = await exportCoreIcons();
buildAllIcons();
// buildIcons('clickedu');
