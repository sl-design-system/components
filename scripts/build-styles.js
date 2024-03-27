import fg from 'fast-glob';
import { promises as fs } from 'fs';
import { basename, dirname } from 'path';
import { compileString } from 'sass';
import stylelint from 'stylelint';

const files = await fg('./packages/{checklist,components}/**/*.scss');

const shared = process.argv.at(3) || '',
  sharedFile = basename(shared),
  sharedDir = dirname(shared);

await Promise.allSettled(
  files.map(async file => {
    try {
      const loadPaths = ['node_modules'];

      // Step 1: compile SCSS to CSS
      const { css } = compileString(
        `
          ${shared ? `@import '${sharedFile}';` : ''}

          ${await fs.readFile(file, 'utf8')}
        `,
        { loadPaths: shared ? [...loadPaths, sharedDir] : loadPaths }
      );

      // Step 2: lint CSS
      let { code } = await stylelint.lint({ code: css, fix: true });

      code = code.toString().split('\n').map(str => `  ${str}`.trimEnd()).join('\n');

      // Step 3: write CSS to TS template
      await fs.writeFile(`${file}.ts`, `import { css } from 'lit';\n\nexport default css\`\n${code}\`;\n`);
    } catch (err) {
      console.log(err);
      process.exitCode = 1;
    }
  })
);
