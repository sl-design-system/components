import { RuntimeLitLocalizer } from '@lit/localize-tools/lib/modes/runtime.js';
import { stringifyDiagnostics } from '@lit/localize-tools/lib/typescript.js';
import fg from 'fast-glob';
import { basename, join } from 'path';

const cwd = new URL('.', import.meta.url).pathname;

const extract = async (component) => {
  const folder = join(cwd, `../packages/components/${component}`);

  const localizer = new RuntimeLitLocalizer({
    sourceLocale: 'en',
    targetLocales: ['nl'],
    inputFiles: join(folder, 'src/**/!(*.{d,spec,stories}).ts'),
    // tsConfig: 'tsconfig.json',
    output: {
      mode: 'runtime',
      outputDir: folder,
      localeCodesModule: 'locales/locale-codes.ts'
    },
    interchange: {
      format: 'xliff',
      xliffDir: 'locales/xliff'
    },
    resolve: path => {
      const result = join(folder, path);
      console.log(result);
      return result;
    }
  });

  const { messages, errors } = localizer.extractSourceMessages();
  if (errors.length > 0) {
    console.error(stringifyDiagnostics(errors));
  }

  console.log(`Extracted ${messages.length} messages from ${component}.`);

  await localizer.writeInterchangeFiles();
};

const extractAll = async () => {
  const components = await fg('../packages/components/*', { cwd, onlyDirectories: true });

  components.forEach(component => extract(basename(component)));
};

extractAll();
