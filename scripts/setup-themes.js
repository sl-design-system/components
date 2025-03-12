import fg from 'fast-glob';
import {cp} from 'fs';
import { join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const setupTheme = (theme) => {
  const source = join(cwd, '../packages/themes/core/global.css');
  const destination = join(cwd, `${theme}/global.css`);
  cp(source, destination,() => console.log(`${theme} done`));

}

const setupAllThemes = async () => {
  const themes = (await fg('../packages/themes/*', { cwd, onlyDirectories: true })).filter(theme => theme.indexOf('core') < 0);

  themes.forEach(component => setupTheme(component));
};

setupAllThemes();
