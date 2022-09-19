import { promises as fs } from 'fs';
import { globby } from 'globby';
import { basename, dirname, join } from 'path';
import sass from 'sass';
import stylelint from 'stylelint';

const files = await globby('**/*.scss', { ignore: ['styles/**'], cwd: 'src' });

const shared = process.argv.at(2) || '',
  sharedFile = basename(shared),
  sharedDir = dirname(shared);

await Promise.allSettled(
  files.map(async file => {
    try {
      // Step 1: compile SCSS to CSS
      const { css } = sass.compileString(
        `
          ${shared ? `@import '${sharedFile}';` : ''}

          ${await fs.readFile(join('src', file), 'utf8')}
        `,
        { loadPaths: shared ? [sharedDir] : undefined }
      );

      // Step 2: lint CSS
      let { output } = await stylelint.lint({ code: css, fix: true });

      output = output.toString().split('\n').map(str => `  ${str}`.trimEnd()).join('\n');
      
      // Step 3: write CSS to TS template
      await fs.writeFile(join('src', `${file}.ts`), `import { css } from 'lit';\n\nexport default css\`\n${output}\`;\n`);
    } catch (err) { 
      console.log(err); 
    }
  })
);
