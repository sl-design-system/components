export * from './src/locale-codes.js';

// Locale modules are intentionally not re-exported from the package entrypoint
// to avoid making every locale a static dependency. Use the lazy-loading map
// below, or import locale modules via their subpath when direct access is needed.
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
  if (!(locale in locales)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const loader = locales[locale as keyof typeof locales];

  return await loader();
}
