export * from './src/locale-codes.js';

// Lazy-loading map for dynamic imports (recommended for optimal performance)
export const locales = {
  'es-ES': () => import('./src/es-ES.js'),
  it: () => import('./src/it.js'),
  nl: () => import('./src/nl.js'),
  pl: () => import('./src/pl.js')
} as const;

/**
 * Dynamically load a locale module.
 *
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
