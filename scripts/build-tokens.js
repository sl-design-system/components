import { promises as fs } from 'fs';
import { join } from 'path';
import { argv } from 'node:process';
import * as sass from 'sass';
import stylelint from 'stylelint';
import figmaThemes from '../packages/tokens/src/$themes.json' assert { type: 'json' };
import { buildStyles } from './style-dictionary.js';
import { transformAllTokens } from './token-transformer.js';

const TEMPLATES = [
  {
    input: `
      @import 'base.scss';
      @import 'dark.scss';
      @import 'light.scss';

      :root {
        @include sl-theme-base;
      }

      @media (prefers-color-scheme: light) {
        :root {
          @include sl-theme-light;
        }
      }

      @media (prefers-color-scheme: dark) {
        :root {
          @include sl-theme-dark;
        }
      }
      `,
    output: 'all.css'
  },
  {
    input: `
      @import 'base.scss';

      :root {
        @include sl-theme-base;
      }
    `,
    output: 'base.css'
  },
  {
    input: `
      @import 'light.scss';

      :root {
        @include sl-theme-light;
      }
    `,
    output: 'light.css'
  },
  {
    input: `
      @import 'dark.scss';

      :root {
        @include sl-theme-dark;
      }
    `,
    output: 'dark.css'
  }
];

const cwd = new URL('.', import.meta.url).pathname;

const buildTokens = async name => {
  buildStyles(name);

  for (const { input, output } of TEMPLATES) {
    const folder = join(cwd, `../packages/themes/${name}`),
      { css } = sass.compileString(input, { loadPaths: [folder] });

    await fs.writeFile(`${folder}/${output}`, css);
  }

  await stylelint.lint({
    cwd,
    files: [
      `../packages/themes/${name}/*.css`,
      `../packages/themes/${name}/*.scss`
    ],
    fix: true
  });
};

const buildAllTokens = async (themesToBuild) => {
  const themes = figmaThemes
    .filter(({ name }) => themesToBuild.length === 0 || themesToBuild.includes(name))
    .map(({ name: nameVariant, selectedTokenSets }) => {
      const [name, mode] = nameVariant.split('/');

      return {
        name,
        mode,
        tokenSets: Object.entries(selectedTokenSets)
          .filter(([_, enabled]) => enabled === 'enabled')
          .filter(([name]) => name !== 'core' && !name.endsWith('/base'))
          .map(([name]) => name)
      };
    });

  figmaThemes
    .reduce((acc, { name }) => {
      if (themesToBuild.length === 0 || themesToBuild.includes(name)) {
        const id = name.split('/')[0];

        return acc.includes(id) ? acc : [...acc, id];
      } else {
        return acc;
      }
    }, [])
    .forEach(id => {
      themes.push({
        name: id,
        mode: 'base',
        tokenSets: ['core', `${id}/base`]
      });
    });

  await transformAllTokens(themes);

  themes.map(({ name }) => buildTokens(name));
};

buildAllTokens(argv.slice(2));
