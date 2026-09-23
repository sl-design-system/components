import fg from 'fast-glob';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = async (theme, globalCss, typographyCss) => {
  await writeFile(join(cwd, `${theme}/global.css`), globalCss);
  console.log(`🌍 ✅ ✍️ ${theme}`);

  await writeFile(join(cwd, `${theme}/typography.css`), typographyCss);
  console.log(`🔠 ✅ ✍️ ${theme}`);

  const themeName = theme.split('/').pop();
  const sourceThemeFiles = [
    `./export/core-css/device/desktop.css`,
    `./export/core-css/device/tablet.css`,
    `./export/core-css/device/mobile.css`,
    `./export/core-css/user-group/early.css`,
    `./export/core-css/user-group/developing.css`,
    `./export/core-css/user-group/advanced.css`,
    `./export/core-css/user-group/superuser.css`,
    `./export/core-css/color/light.css`,
    `./export/core-css/color/dark.css`,
    `./export/core-css/system/default.css`,
    `./export/core-css/brand/${themeName}.css`
  ];

  try {
    const parts = await Promise.all(
      sourceThemeFiles.map(async file => {
        const data = await readFile(join(cwd, file), 'utf8');
        let content = `/* file: ${file} */\n` + data;
        if (file.includes(`${themeName}.css`)) {
          content = content.replace(
            new RegExp(`\\[data-brand=['"]${themeName}['"]\\]`, 'g'),
            'body'
          );
          content = content.replace(new RegExp(`Open Sans`, 'g'), 'open-sans');
          content = content.replace(new RegExp(`Proxima Nova`, 'g'), 'proxima-nova');
        }
        return content;
      })
    );

    await writeFile(join(cwd, `${theme}/theme.css`), parts.join('\n\n'));
    console.log(`🎨 ✅ ✍️ ${theme}`);
  } catch (err) {
    console.error(`🎨 ⚠️ ${theme}:`, err);
    throw err;
  }
};

const setupAllThemes = async () => {
  const themes = (await fg('../../packages/themes/*', { cwd, onlyDirectories: true })).filter(
    theme => theme.indexOf('core') < 0 && theme.indexOf('_onhold') < 0
  );

  console.log(`Setting up ${themes.length} themes...`);

  // Read the shared core files once, instead of once per theme concurrently.
  const globalCss = await readFile(join(cwd, '../../packages/themes/core/global.css'), 'utf8');
  const typographyCss = await readFile(
    join(cwd, '../../packages/themes/core/typography.css'),
    'utf8'
  );

  await Promise.all(themes.map(theme => setupTheme(theme, globalCss, typographyCss)));
  console.log('✅ All themes setup complete!');
};

await setupAllThemes();
