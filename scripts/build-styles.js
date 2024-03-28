import fg from 'fast-glob';
import { promises as fs } from 'fs';
import { argv } from 'node:process';
import { compileString } from 'sass';
import stylelint from 'stylelint';

const files = await fg(argv.at(2) || '**/*.scss');

await Promise.allSettled(
  files.map(async file => {
    try {
      // Step 1: compile SCSS to CSS
      const { css } = compileString(
        `${await fs.readFile(file, 'utf8')}`,
        { loadPaths: ['node_modules'] }
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
