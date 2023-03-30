import { promises as fs } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { findIconDefinition , library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fat } from '@fortawesome/pro-thin-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fass } from '@fortawesome/sharp-solid-svg-icons'
import { fasr } from '@fortawesome/sharp-regular-svg-icons'
import { fasl } from '@fortawesome/sharp-light-svg-icons'

const formattedIcons = (icons, collection) => {
  return Object.entries(icons).reduce((acc, cur) => {
    if(cur[0]===collection){
      Object
      .entries(cur[1])
      .forEach(entry => acc = {...acc, [entry[0]]: entry[1] });
    }
    return acc;
  }, {})
};

const convertToIconDefinition = (iconName, style) => {
  console.log(style);
  return findIconDefinition({ prefix: getIconPrefixFromStyle(style), iconName });
};

const getColorToken = (pathCounter, style) => {
  return pathCounter === 0 && style === 'fad' ? 'accent' : 'default';
};

const getIconPrefixFromStyle = (style) => {
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
    case 'sharp':
      return 'fasr';
    default:
      return 'far';
  }
};

library.add(fas, far, fal, fat, fad, fass, fasr, fasl);

const cwd = new URL('.', import.meta.url).pathname,
  name = process.argv.at(2),
  page = process.argv.at(3);

// 1. Get icon tokens from `base.json`
const {
  default: { icon }
} = await import(`${cwd}src/themes/${name}/base.json`, { assert: { type: 'json' } });

const icons = formattedIcons(icon,'core');
const iconsCustom = formattedIcons(icon,'custom');

// fetch all FA tokens and store these
Object.entries(icons).map(([iconName, value]) =>{
  console.log(value);
  const faIcon = convertToIconDefinition(value.value.replace('fa-',''), value.style??'regular');
  if(!faIcon) return;
  const {
    icon: [width, height, , , path]
  } = faIcon,
  paths = Array.isArray(path) ? path : [path];
  const svg =  `<svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">${paths.map((p, i) => `<path d="${p}" fill="var(--fill-${getColorToken(i, 'regular')})"></path>`).join('')}</svg>`;
  icons[iconName] = {...value, svg };
});

// load all custom icons from figma and store svgs
await new Promise((resolve, reject) => {
  exec(`yarn run figma-export use-config .figmaexportrc.cjs ${page} ${name}`, { cwd }, error => {
    console.log('after fun of figma export', error);
    if (error) {
      reject(error);
    }
    resolve();
  });
});


// 3. Convert downloaded icons to appropriate format?
// We only need the `<path>` data for `<sl-icon>`
const customIconFiles = await fs.readdir(`${cwd}src/themes/${name}/icons/`)
console.log('customIconFiles, files we need to read:', customIconFiles);

const filesToRead = customIconFiles.map(fileName => {
  const iconName = fileName.replace('icon=','').replace('.svg','');
  return fs.readFile(`${cwd}src/themes/${name}/icons/${fileName}`, "utf8")
  .then(svg => iconsCustom[iconName] = { svg });
});
await Promise.all(filesToRead);

// 4. Write the output to `icons.json`???? Or just `icons.ts` which exports 
// all the icons?????
// TODO .ts doesn't work (anymore?? who do we compile this?)
// TODO filter out everything that is not the right format
// export type SLIconName = '${Object.keys({...icons,...iconsCustom}).join(`' | '`)}';

await fs.writeFile(join(`${cwd}src/themes/${name}`, `icons.ts`), `export const icons = ${JSON.stringify({...icons,...iconsCustom})};`);
// 5. Expose the icons via the theme `IconResolver` in `index.ts`
// Either use the downloaded icons, or use FontAwesome NPM packages

