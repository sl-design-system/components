import fg from 'fast-glob';
import { cp, readFile, writeFile } from 'fs';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = theme => {
  const sourceGlobal = join(cwd, '../packages/themes/core/global.css');
  const destinationGlobal = join(cwd, `${theme}/global.css`);
  cp(sourceGlobal, destinationGlobal, () => console.log(`🌍 ✅ ${theme}`));

  const destinationTypography = join(cwd, `${theme}/typography.css`);

  const typographyCssFiles = [
    './export/core-css/Device/tablet.css',
    './export/core-css/Device/desktop.css',
    './export/core-css/Device/mobile.css',
    './export/core-css/User-Group/advanced.css',
    './export/core-css/User-Group/early.css',
    './export/core-css/User-Group/developing.css',
    '../packages/themes/core/typography.css'
  ];

  const promises = typographyCssFiles.map(file => {
    return new Promise((resolve, reject) => {
      readFile(join(cwd, file), 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  });

  // Combine both typography files
  Promise.all(promises)
    .then(parts => {
      writeFile(destinationTypography, parts.join('\n\n'), err => {
        if (err) console.error(`🔠 ⚠️ ✍️ ${theme}:`, err);
        else console.log(`🔠 ✅ ✍️${theme}`);
      });
    })
    .catch(err => console.error(`🔠 ⚠️ 👓 ${theme}:`, err));
};

const setupAllThemes = async () => {
  const themes = (await fg('../packages/themes/*', { cwd, onlyDirectories: true })).filter(
    theme => theme.indexOf('core') < 0
  );

  themes.forEach(theme => setupTheme(theme));
};

setupAllThemes();
