import fg from 'fast-glob';
import { cp, readFile, writeFile } from 'fs';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = theme => {
  const sourceGlobal = join(cwd, '../packages/themes/core/global.css');
  const destinationGlobal = join(cwd, `${theme}/global.css`);
  cp(sourceGlobal, destinationGlobal, () => console.log(`🌍 ✅ ✍️ ${theme}`));

  const themeName = theme.split('/').pop();
  const sourceThemeFiles = [
    `./export/core-css/device/desktop.css`,
    `./export/core-css/device/tablet.css`,
    `./export/core-css/device/mobile.css`,
    `./export/core-css/user-group/early.css`,
    `./export/core-css/user-group/developing.css`,
    `./export/core-css/user-group/advanced.css`,
    `./export/core-css/color/light.css`,
    `./export/core-css/color/dark.css`,
    `./export/core-css/system/default.css`,
    `./export/core-css/brand/${themeName}.css`,
    `../packages/themes/core/typography.css`
  ];

  const promises = sourceThemeFiles.map(file => {
    return new Promise((resolve, reject) => {
      readFile(join(cwd, file), 'utf8', (err, data) => {
        if (err) reject(err);
        else {
          let content = `/* file: ${file} */\n` + data;
          if (file.includes(`${themeName}.css`)) {
            content = content.replace(
              new RegExp(`\\[data-brand=['"]${themeName}['"]\\]`, 'g'),
              'body'
            );
            content = content.replace(new RegExp(`Open Sans`, 'g'), 'open-sans');
            content = content.replace(new RegExp(`Proxima Nova`, 'g'), 'proxima-nova');
          }
          resolve(content);
        }
      });
    });
  });
  Promise.all(promises)
    .then(parts => {
      writeFile(join(cwd, `${theme}/theme.css`), parts.join('\n\n'), err => {
        if (err) console.error(`🎨 ⚠️ ✍️ ${theme}:`, err);
        else console.log(`🎨 ✅ ✍️ ${theme}`);
      });
    })
    .catch(err => console.error(`🎨 ⚠️ 👓 ${theme}:`, err));
};

const setupAllThemes = async () => {
  const themes = (await fg('../packages/themes/*', { cwd, onlyDirectories: true })).filter(
    theme => theme.indexOf('core') < 0 && theme.indexOf('_onhold') < 0
  );

  themes.forEach(theme => setupTheme(theme));
};

setupAllThemes();
