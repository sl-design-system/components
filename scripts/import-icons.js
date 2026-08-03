import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { fadr } from '@fortawesome/duotone-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fat } from '@fortawesome/pro-thin-svg-icons';
import { fasl } from '@fortawesome/sharp-light-svg-icons';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { exec } from 'child_process';
import { promisify } from 'util';
import fg from 'fast-glob';
import { promises as fs, existsSync } from 'fs';
import { basename, join } from 'path';

const execAsync = promisify(exec);

library.add(fas, far, fal, fat, fad, fadr, fass, fasr, fasl);

const cwd = new URL('.', import.meta.url).pathname;

const {
  default: { icon: coreIconTokens }
} = await import('../packages/tokens/src/tokens/core.json', { with: { type: 'json' } });

const coreIcons = coreIconTokens; // Keep the full icon object for getFormattedIcons
const coreIconFontFamily = coreIconTokens.fontFamily;

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

const getColorToken = (pathCounter, prefix) => {
  return pathCounter === 0 && (prefix === 'fad' || prefix === 'fadr') ? 'accent' : 'default';
};

const getIconStyle = (iconName, text, style) => {
  const familyPrefix =
      text.typeset.fontFamily.icon.value === 'Font Awesome 6 Sharp' ? 'sharp-' : '',
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
    case 'duotone-regular':
      return 'fadr';
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

const buildIconsFromBaseNew = async theme => {
  // 1. Get icon tokens from `base-new.json` which uses routing prefixes
  const baseNewModule = await import(`../packages/tokens/src/tokens/${theme}/base-new.json`, {
    with: { type: 'json' }
  });
  const baseNewData = baseNewModule.default;

  // Find the routing prefix that contains icon data (e.g., 'II-F', 'I-A', etc.)
  const routingPrefix = Object.keys(baseNewData).find(key => baseNewData[key]?.icon);

  if (!routingPrefix) {
    console.warn(`No icon data found in base-new.json for ${theme}`);
    return;
  }

  const {
    icon: { typeset: iconTypeset }
  } = baseNewData[routingPrefix];

  const themeIconsPath = join(cwd, `../packages/themes/${theme}/theme-icons.json`);
  let themeIcons;

  if (existsSync(themeIconsPath)) {
    const themeIconsModule = await import(themeIconsPath, { with: { type: 'json' } });
    themeIcons = themeIconsModule.default;
  }

  // Create a style object compatible with the existing getIconStyle function
  // In base-new.json, the structure is icon.typeset.fontWeight.{solid, regular}
  const style = {
    solid: iconTypeset?.fontWeight?.solid,
    outline: iconTypeset?.fontWeight?.regular
  };

  // Create a text object compatible with getIconStyle - use core icon font family
  const text = {
    typeset: {
      fontFamily: {
        icon: {
          value: coreIconFontFamily.classic.$value
        }
      }
    }
  };

  const icons = {
    ...getFormattedIcons(coreIcons, 'core'),
    ...(themeIcons ? getFormattedIcons({ themeIcons }, 'themeIcons') : {})
  };

  // fetch all FA tokens and store these
  Object.entries(icons).forEach(([iconName, value]) => {
    const tokenValue = value['$value'] || value.value;
    if (!tokenValue) {
      delete icons[iconName];
      return;
    }

    const faIcon = convertToIconDefinition(
      tokenValue.replace('fa-', ''),
      getIconStyle(iconName, text, style)
    );
    if (!faIcon) {
      console.warn(`[${theme}] FontAwesome icon not found: ${tokenValue} (${iconName})`);
      delete icons[iconName];
      return;
    }

    const {
        prefix,
        icon: [width, height, , , path]
      } = faIcon,
      paths = Array.isArray(path) ? path : [path];

    const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${paths.map((p, i) => `<path d="${p}" fill="var(--sl-icon-fill-${getColorToken(i, prefix)})"></path>`).join('')}</svg>`;

    icons[iconName] = {
      value: tokenValue,
      type: value['$type'] || value.type,
      description: value['$description'] || value.description,
      svg
    };
  });

  const iconsFolderPath = join(cwd, `../packages/themes/${theme}/icons/`);
  if (!existsSync(iconsFolderPath)) {
    await fs.mkdir(iconsFolderPath);
  }

  // 3. Convert downloaded icons to appropriate format?
  // We only need the `<path>` data for `<sl-icon>`

  const customIconFiles = await fs.readdir(iconsFolderPath);
  const iconsCustom = {};

  const filesToRead = customIconFiles.map(fileName => {
    const iconName = fileName.replace('icon=', '').replace('.svg', '');

    return fs
      .readFile(join(cwd, `../packages/themes/${theme}/icons/${fileName}`), 'utf8')
      .then(svg => {
        iconsCustom[iconName] = {
          svg: svg.replace('<svg ', '<svg fill="var(--sl-icon-fill-default)" ')
        };
      });
  });

  await Promise.all(filesToRead);

  // 4. Write the output to `icons.json`???? Or just `icons.ts` which exports
  console.log(`Writing icons to ${theme}...`);
  const filePath = join(cwd, `../packages/themes/${theme}/icons.ts`),
    sortedIcons = Object.fromEntries(
      Object.entries({ ...coreCustomIcons, ...icons, ...iconsCustom }).sort()
    ),
    source = `// This is a generated file, do not edit. Edit the core.json and theme-icons.json files instead.
export const icons = ${JSON.stringify(sortedIcons, null, 2)};
`;

  await fs.writeFile(filePath, source);
  await execAsync(`npx oxfmt ${filePath}`, { cwd: join(cwd, '..') });
};

const buildAllIcons = async () => {
  const folders = await fg('../packages/themes/*', { cwd, onlyDirectories: true });

  const themes = folders
    .map(folder => basename(folder))
    .filter(theme => theme.indexOf('core') < 0)
    .filter(theme => existsSync(join(cwd, `../packages/tokens/src/tokens/${theme}/base-new.json`)));

  const buildPromises = themes.map(theme => {
    const hasBaseNewJson = existsSync(
      join(cwd, `../packages/tokens/src/tokens/${theme}/base-new.json`)
    );

    return buildIconsFromBaseNew(theme);
  });

  await Promise.all(buildPromises);
};

const exportCoreIcons = async () => {
  const iconsFolderPath = join(cwd, `../packages/themes/core/icons/`);
  if (!existsSync(iconsFolderPath)) {
    await fs.mkdir(iconsFolderPath, { recursive: true });
  }

  for (const file of await fs.readdir(iconsFolderPath)) {
    await fs.unlink(join(iconsFolderPath, file));
  }

  // load all custom icons from figma and store svgs
  await new Promise((resolve, reject) => {
    console.log(`Extracting icons from Figma for core...`);
    // Pbs7HEwKmwm6wAX9tfjk2N is the page id in figma where the icons are stored
    exec(
      `yarn run figma-export use-config .figmaexportrc.js Pbs7HEwKmwm6wAX9tfjk2N`,
      { cwd },
      error => {
        if (error) {
          reject(error);
        }

        resolve();
      }
    );
  });

  // 3. Convert downloaded icons to appropriate format?
  // We only need the `<path>` data for `<sl-icon>`

  const customIconFiles = await fs.readdir(iconsFolderPath);
  const iconsCustom = [];

  const filesToRead = customIconFiles.map(fileName => {
    const iconName = fileName.replace('icon=', '').replace('.svg', '');

    return fs.readFile(join(cwd, `../packages/themes/core/icons/${fileName}`), 'utf8').then(svg => {
      svg = svg.replace('<svg ', '<svg fill="var(--sl-icon-fill-default)" ');
      iconsCustom[iconName] = { svg };
    });
  });

  await Promise.all(filesToRead);

  return iconsCustom;
};

const coreCustomIcons = await exportCoreIcons();
buildAllIcons();
