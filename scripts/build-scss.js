import fg from 'fast-glob';
import { promises as fs } from 'fs';
import { basename, dirname } from 'path';
import sass from 'sass';
import stylelint from 'stylelint';

const files = await fg([
  './packages/*/src/**/*.scss',
  '!./packages/core/**/*.scss',
  '!./packages/tokens/**/*.scss',
]);

const shared = process.argv.at(3) || '',
  sharedFile = basename(shared),
  sharedDir = dirname(shared);

await Promise.allSettled(
  files.map(async file => {
    try {
      // Step 1: compile SCSS to CSS
      const { css } = sass.compileString(
        `
          ${shared ? `@import '${sharedFile}';` : ''}

          ${await fs.readFile(file, 'utf8')}
        `,
        { loadPaths: shared ? [sharedDir] : undefined }
      );

      // Step 2: lint CSS
      let { output } = await stylelint.lint({ code: css, fix: true });

      output = output.toString().split('\n').map(str => `  ${str}`.trimEnd()).join('\n');
      
      // Step 3: write CSS to TS template
      await fs.writeFile(`${file}.ts`, `import { css } from 'lit';\n\nexport default css\`\n${output}\`;\n`);
    } catch (err) { 
      console.log(err); 
    }
  })
);
