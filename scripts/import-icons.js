import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import { fadl } from '@fortawesome/duotone-light-svg-icons';
import { fadr } from '@fortawesome/duotone-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fasl } from '@fortawesome/sharp-light-svg-icons';
import { fasr } from '@fortawesome/sharp-regular-svg-icons';
import { fass } from '@fortawesome/sharp-solid-svg-icons';
import { fasdl } from '@fortawesome/sharp-duotone-light-svg-icons';
import { fasdr } from '@fortawesome/sharp-duotone-regular-svg-icons';
import { fasds } from '@fortawesome/sharp-duotone-solid-svg-icons';
import { exec } from 'child_process';
import { promisify } from 'util';
import fg from 'fast-glob';
import { promises as fs, existsSync } from 'fs';
import { basename, join } from 'path';

/**
 * Font awesome icons have 2 variables that determine which icon set is used:
 *
 * Pack: classic, sharp, duotone, sharp-duotone (and the more exotic ones like chisel, graphite,
 *
 * Style: regular, light, thin; (these are used in classic, sharp, duotone, sharp-duotone. Note; we
 * exclude "solid", this is set on an icon level and is not a stylistic choice for the theme)
 *
 * Type: solid, outline (internal for this script only)
 */

const execAsync = promisify(exec);

library.add(fas, far, fal, fad, fadl, fadr, fasdr, fasds, fasdl, fass, fasr, fasl);

const packPrefixes = {
  'Font Awesome 7 Pro': 'fa',
  'Font Awesome 7 Pro Sharp': 'fas',
  'Font Awesome 7 Pro Duotone': 'fad',
  'Font Awesome 7 Pro Sharp Duotone': 'fasd'
};
const stylePrefixes = {
  Solid: 's',
  Regular: 'r',
  Light: 'l'
};

const cwd = new URL('.', import.meta.url).pathname;
const iconsFilePath = join(cwd, '../packages/themes/');

const { default: coreIcons } = await import(join(iconsFilePath, 'core/icons.json'), {
  with: { type: 'json' }
});

const getCssCustomProperty = (source, propertyName) => {
  const propertyMatcher = new RegExp(`${propertyName}\\s*:\\s*([^;]+);`, 'g'),
    matches = [...source.matchAll(propertyMatcher)];

  if (!matches.length) {
    return undefined;
  }

  // CSS custom properties can be overwritten later in the source, so use the last match.
  return matches
    .at(-1)[1]
    .trim()
    .replace(/^['\"]|['\"]$/g, '');
};

const getFormattedIcons = (icons, collection) => {
  return Object.entries(icons).reduce((acc, cur) => {
    if (cur[0] === collection) {
      Object.entries(cur[1]).forEach(entry => (acc = { ...acc, [entry[0]]: entry[1] }));
    }
    return acc;
  }, {});
};

const convertToIconDefinition = (iconName, prefix) => {
  return findIconDefinition({ prefix, iconName });
};

const getColorToken = (pathCounter, prefix) => {
  return pathCounter === 0 && (prefix.match(/^fad/) || prefix.match(/^fasd/))
    ? 'accent'
    : 'default';
};

const findPrefix = (prefixes, key) => {
  const match = Object.keys(prefixes).find(k => k.toLowerCase() === key?.toLowerCase());

  return match ? prefixes[match] : undefined;
};

const getIconShorthand = (pack, style) => {
  const packPrefix = findPrefix(packPrefixes, pack) || 'fa';
  const stylePrefix = findPrefix(stylePrefixes, style) || 'r';

  return (packPrefix + stylePrefix).replace('fads', 'fad'); // duotone solid is the only shorthand that doesn't match the naming convention.
};

const buildIconTS = async theme => {
  // Get the font and style this theme uses for the icons
  // Theme token values are generated as CSS custom properties.
  const themeCssPath = join(iconsFilePath, theme, 'theme.css');

  if (!existsSync(themeCssPath)) {
    throw new Error(
      `[${theme}] theme.css not found at ${themeCssPath}. Run "yarn import-tokens" first.`
    );
  }

  // get all icons necessary for this theme
  const themeCss = await fs.readFile(themeCssPath, 'utf8');

  const iconPack =
    getCssCustomProperty(themeCss, '--sl-text-new-typeset-fontFamily-icon') || // actual theme pakc
    getCssCustomProperty(themeCss, '--sl-icon-typeset-fontFamily-classic') || // fallback to classic when pack is not set in theme, but it uses the correct FA version
    'Font Awesome 7 Pro'; // Fallback to default FA version no font family is set in theme. This is the default for all themes that don't have a custom icon font family.

  const iconStyle = getCssCustomProperty(themeCss, '--sl-brand-text-new-icon-outline-fontWeight');

  console.log(`Building icons for ${theme}, With pack: ${iconPack}, and style: ${iconStyle}...`);

  const themeIconsPath = join(cwd, `../packages/themes/${theme}/theme-icons.json`);
  let themeIcons;

  if (existsSync(themeIconsPath)) {
    const themeIconsModule = await import(themeIconsPath, { with: { type: 'json' } });
    themeIcons = themeIconsModule.default;
  }

  const icons = {
    ...coreIcons,
    ...(themeIcons || {})
  };
  // fetch all FA tokens and store these
  Object.entries(icons).forEach(([iconName, icon]) => {
    const tokenValue = icon['fa-icon'];

    if (!tokenValue) {
      // no fa-icon token value, so we can't find the icon in FA
      console.warn(`[${theme}] ${iconName} doesn't have a fa-icon value`);
      delete icons[iconName];
      return;
    }

    const faIcon = convertToIconDefinition(
      tokenValue,
      getIconShorthand(iconPack, icon.style || iconStyle)
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
      type: 'FontAwesome icon',
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
      Object.entries({ ...icons, ...iconsCustom }).sort()
      // Object.entries({ ...coreCustomIcons, ...icons, ...iconsCustom }).sort()
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
    .filter(theme => theme.indexOf('core') < 0 && theme.indexOf('_onhold') < 0);

  const buildPromises = themes.map(theme => buildIconTS(theme));

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

// const coreCustomIcons = await exportCoreIcons();
buildAllIcons();
