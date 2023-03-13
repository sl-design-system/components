import { promises as fs } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';

const cwd = new URL('.', import.meta.url).pathname,
  name = process.argv.at(2),
  page = process.argv.at(3);

// 1. Get icon tokens from `base.json`
const {
  default: { icon }
} = await import(`${cwd}src/themes/${name}/base.json`, { assert: { type: 'json' } });

const icons = Object.entries(icon).reduce((acc, cur) => {
  if(cur[0]!=='custom'){
    Object
    .entries(cur[1])
    .forEach(entry => acc = {...acc, [entry[0]]: entry[1] });
  }
  return acc;
}, {});

const iconsCustom = Object.entries(icon).reduce((acc, cur) => {
  if(cur[0]==='custom'){
    Object
    .entries(cur[1])
    .forEach(entry => acc = {...acc, [entry[0]]: entry[1] });
  }
  return acc;
}, {});

// 2. If tokens contain custom icons, get icons from Figma
if (Object.keys(iconsCustom).length) {
  await new Promise((resolve, reject) => {
    exec(`yarn run figma-export use-config .figmaexportrc.cjs ${page} ${name}`, { cwd }, error => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve();
    });
  });
}

// 3. Convert downloaded icons to appropriate format?
// We only need the `<path>` data for `<sl-icon>`

// const customIcons = new Map();
// await Promise.all(Object.entries(iconsCustom).map(async ([iconName, value]) => {
//   const svg = await fs.readFile(`${cwd}src/themes/${name}/icons/icon=${iconName}.svg`, "utf8");
//   customIcons.set(iconName,{...value, svg });
// }));

await Promise.all(Object.entries(iconsCustom).map(async ([iconName, value]) => {
  const svg = await fs.readFile(`${cwd}src/themes/${name}/icons/icon=${iconName}.svg`, "utf8");
  iconsCustom[iconName] = {...value, svg };
}));

// 4. Write the output to `icons.json`???? Or just `icons.ts` which exports 
// all the icons?????
// TODO .ts doesn't work (anymore?? who do we compile this?)
// TODO filter out everything that is not the right format
await fs.writeFile(join(`${cwd}src/themes/${name}`, `icons.js`), `export const icons = ${JSON.stringify({...icons,...iconsCustom})};`);

// 5. Expose the icons via the theme `IconResolver` in `index.ts`
// Either use the downloaded icons, or use FontAwesome NPM packages
