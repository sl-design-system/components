export * from './src/locale-codes.js';

// Re-export locale modules for backward compatibility
// Modern bundlers can tree-shake unused locales
export * as nl from './src/nl.js';
export * as it from './src/it.js';
export * as pl from './src/pl.js';
export * as esES from './src/es-ES.js';

// Lazy-loading map for dynamic imports (recommended for optimal performance)
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
export async function loadLocale(locale: string) {
  if (!Object.hasOwn(locales, locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const loader = locales[locale as keyof typeof locales];

  return await loader();
}
