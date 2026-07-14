import fg from 'fast-glob';
import { cp, readFile, writeFile } from 'fs';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = theme => {
  const sourceGlobal = join(cwd, '../packages/themes/core/global.css');
  const destinationGlobal = join(cwd, `${theme}/global.css`);
  cp(sourceGlobal, destinationGlobal, () => console.log(`${theme} global done`));

  const sourceTypographyTokens = join(cwd, './export/typography.css');
  const sourceTypography = join(cwd, '../packages/themes/core/typography.css');
  const destinationTypography = join(cwd, `${theme}/typography.css`);

  // Combine both typography files
  Promise.all([
    new Promise((resolve, reject) =>
      readFile(sourceTypographyTokens, 'utf8', (err, data) => (err ? reject(err) : resolve(data)))
    ),
    new Promise((resolve, reject) =>
      readFile(sourceTypography, 'utf8', (err, data) => (err ? reject(err) : resolve(data)))
    )
  ])
    .then(([tokens, core]) => {
      writeFile(destinationTypography, `${tokens}\n\n${core}`, err => {
        if (err) console.error(`Error writing ${theme} typography:`, err);
        else console.log(`${theme} typography done`);
      });
    })
    .catch(err => console.error(`Error reading typography files for ${theme}:`, err));
};

const setupAllThemes = async () => {
  const themes = (await fg('../packages/themes/*', { cwd, onlyDirectories: true })).filter(
    theme => theme.indexOf('core') < 0
  );

  themes.forEach(theme => setupTheme(theme));
};

setupAllThemes();
