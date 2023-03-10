import { exec } from 'child_process';

const cwd = new URL('.', import.meta.url).pathname,
  name = process.argv.at(2),
  page = process.argv.at(3);

// 1. Get icon tokens from `base.json`
const {
  default: { icon }
} = await import(`${cwd}/src/themes/${name}/base.json`, { assert: { type: 'json' } });
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

// 4. Write the output to `icons.json`???? Or just `icons.ts` which exports 
// all the icons?????

// 5. Expose the icons via the theme `IconResolver` in `index.ts`
// Either use the downloaded icons, or use FontAwesome NPM packages

// Object.entries(icons).forEach(([name, value]) => {
//   console.log({ name, value });
// });
