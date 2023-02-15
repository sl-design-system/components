import { exec } from 'child_process';

const cwd = new URL('.', import.meta.url).pathname,
  name = process.argv.at(2),
  page = process.argv.at(3);

const {
  default: { icon }
} = await import(`${cwd}/src/themes/${name}/base.json`, { assert: { type: 'json' } });

const icons = Object.entries(icon).reduce((acc, cur) => {
  Object
    .entries(cur[1])
    .forEach(entry => acc = {...acc, [entry[0]]: entry[1] });

  return acc;
}, {});

if (Object.keys(icons).length) {
  await new Promise((resolve, reject) => {
    exec(`yarn run figma-export use-config .figmaexportrc.cjs ${page}`, { cwd }, error => {
      if (error) {
        console.log(error);
        reject(error);
      }

      resolve();
    });
  });
}


Object.entries(icons).forEach(([name, value]) => {
  console.log({ name, value });
});
