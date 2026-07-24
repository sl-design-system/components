import fg from 'fast-glob';
import { cp, readFile, writeFile } from 'fs';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = theme => {
  const sourceGlobal = join(cwd, '../packages/themes/core/global.css');
  const destinationGlobal = join(cwd, `${theme}/global.css`);
  cp(sourceGlobal, destinationGlobal, () => console.log(`🌍 ✅ ${theme}`));

  const destinationTypography = join(cwd, `${theme}/typography.css`);

  const themeName = theme.split('/').pop();
  const sourceThemeFiles = [
    `./export/core-css/color/light.css`,
    `./export/core-css/color/dark.css`,
    `./export/core-css/system/default.css`,
    `./export/core-css/brand/${themeName}.css`
  ];

  const promises = sourceThemeFiles.map(file => {
    return new Promise((resolve, reject) => {
      readFile(join(cwd, file), 'utf8', (err, data) => {
        if (err) reject(err);
        else {
          let content = data;
          if (file.includes(`${themeName}.css`)) {
            content = content.replace(new RegExp(`\\[data-brand="${themeName}"\\]`, 'g'), ':root');
          }
          if (file.includes(`dark.css`)) {
            content = content.replace(new RegExp(`:root`, 'g'), 'body');
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
        else console.log(`🎨 ✅ ✍️${theme}`);
      });
    })
    .catch(err => console.error(`🎨 ⚠️ 👓 ${theme}:`, err));
};

const setupAllThemes = async () => {
  const themes = (await fg('../packages/themes/*', { cwd, onlyDirectories: true })).filter(
    theme => theme.indexOf('core') < 0
  );

  themes.forEach(theme => setupTheme(theme));
};

setupAllThemes();
