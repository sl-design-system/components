import fg from 'fast-glob';
import { copyFile, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = async theme => {
  const sourceGlobal = join(cwd, '../../packages/themes/core/global.css');
  const destinationGlobal = join(cwd, `${theme}/global.css`);
  await copyFile(sourceGlobal, destinationGlobal);
  console.log(`🌍 ✅ ✍️ ${theme}`);

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
    `./export/core-css/brand/${themeName}.css`,
    `../../packages/themes/core/typography.css`
  ];

  // If the theme has its own override folder in export/core-css, add its files (in alphabetical
  // order) right after the brand css file, so the theme can override the core-css files.
  const subthemesFolder = `./export/core-css/${themeName}-subthemes`;
  console.log(
    `Checking for subthemes folder: ${subthemesFolder}`,
    existsSync(join(cwd, subthemesFolder)) ? 'found' : 'not found'
  );
  if (existsSync(join(cwd, subthemesFolder))) {
    const themeOverrideFiles = (await fg('*.css', { cwd: join(cwd, subthemesFolder) })).sort();

    const brandIndex = sourceThemeFiles.findIndex(file => file.includes(`${themeName}.css`));
    sourceThemeFiles.splice(
      brandIndex + 1,
      0,
      ...themeOverrideFiles.map(file => `${subthemesFolder}/${file}`)
    );
  }

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
  }
};

const setupAllThemes = async () => {
  const themes = (await fg('../../packages/themes/*', { cwd, onlyDirectories: true })).filter(
    theme => theme.indexOf('core') < 0 && theme.indexOf('_onhold') < 0
  );

  console.log(`Setting up ${themes.length} themes...`);
  await Promise.all(themes.map(theme => setupTheme(theme)));
  console.log('✅ All themes setup complete!');
};

await setupAllThemes();
