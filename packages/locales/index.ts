export * from './src/locale-codes.js';
import * as esES from './src/es-ES.js';
import * as it from './src/it.js';
import * as nl from './src/nl.js';
import * as pl from './src/pl.js';

export { esES, it, nl, pl };

export const locales = {
  'es-ES': esES,
  it,
  nl,
  pl
};
