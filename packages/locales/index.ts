export * from './src/locale-codes.js';

// Re-export locale modules for direct access (these are lazy until explicitly imported)
export * as esES from './src/es-ES.js';
export * as it from './src/it.js';
export * as nl from './src/nl.js';
export * as pl from './src/pl.js';

// Lazy-loading map for dynamic locale loading
export const locales = {
  'es-ES': () => import('./src/es-ES.js'),
  it: () => import('./src/it.js'),
  nl: () => import('./src/nl.js'),
  pl: () => import('./src/pl.js')
} as const;

/**
 * Dynamically load a locale module.
 * @param locale - The locale code to load
 * @returns A promise that resolves to the locale module
 */
export async function loadLocale(locale: keyof typeof locales) {
  const loader = locales[locale];

  if (!loader) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return await loader();
}
