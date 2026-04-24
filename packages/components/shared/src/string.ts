// https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/core/src/utils/strings.ts

const STRING_DASHERIZE_REGEXP = /[ _]/g,
  STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g,
  STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g,
  STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g,
  STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;

/**
 * Returns the lowerCamelCase form of a string.
 *
 * ```javascript
 * camelize('innerHTML')          // 'innerHTML'
 * camelize('action_name')        // 'actionName'
 * camelize('css-class-name')     // 'cssClassName'
 * camelize('object.path.name')   // 'objectPathName'
 * camelize('my favorite items')  // 'myFavoriteItems'
 * camelize('My Favorite Items')  // 'myFavoriteItems'
 * ```
 *
 * @method camelize
 * @param str The string to camelize.
 * @return the camelized string.
 */
export function camelize(str: string): string {
  return str
    .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr: string) => {
      return chr ? chr.toUpperCase() : '';
    })
    .replace(/^([A-Z])/, match => match.toLowerCase());
}

/**
 * Returns the Capitalized form of a string
 *
 * ```javascript
 * capitalize('innerHTML')         // 'InnerHTML'
 * capitalize('action_name')       // 'Action_name'
 * capitalize('css-class-name')    // 'Css-class-name'
 * capitalize('my favorite items') // 'My favorite items'
 * ```
 *
 * @method capitalize
 * @param str The string to capitalize.
 * @return The capitalized string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}

/**
 * Returns the UpperCamelCase form of a string.
 *
 * ```javascript
 * classify('innerHTML')          // 'InnerHTML'
 * classify('action_name')        // 'ActionName'
 * classify('css-class-name')     // 'CssClassName'
 * classify('my favorite items')  // 'MyFavoriteItems'
 * ```
 *
 * @method classify
 * @param str the string to classify
 * @return the classified string
 */
export function classify(str: string): string {
  return str
    .split('.')
    .map(part => capitalize(camelize(part)))
    .join('.');
}

/**
 * Replaces underscores, spaces, or camelCase with dashes.
 *
 * ```javascript
 * dasherize('innerHTML')         // 'inner-html'
 * dasherize('action_name')       // 'action-name'
 * dasherize('css-class-name')    // 'css-class-name'
 * dasherize('my favorite items') // 'my-favorite-items'
 * ```
 *
 * @method dasherize
 * @param str The string to dasherize.
 * @return the dasherized string.
 */
export function dasherize(str: string): string {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

/**
 * Converts a camelized string into all lower case separated by underscores.
 *
 * ```javascript
 * decamelize('innerHTML')         // 'inner_html'
 * decamelize('action_name')       // 'action_name'
 * decamelize('css-class-name')    // 'css-class-name'
 * decamelize('my favorite items') // 'my favorite items'
 * ```
 *
 * @method decamelize
 * @param str The string to decamelize.
 * @return the decamelized string.
 */
export function decamelize(str: string): string {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

/**
 * Returns the Humanized form of a string
 *
 * ```javascript
 * humanize('innerHTML')         // 'Inner html'
 * humanize('action_name')       // 'Action name'
 * humanize('css-class-name')    // 'Css class name'
 * humanize('my favorite items') // 'My favorite items'
 * ```
 *
 * @method humanize
 * @param str The string to humanize.
 * @return The humanized string.
 */
export function humanize(str: string): string {
  return capitalize(
    str
      .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr: string) => {
        return chr ? chr.toUpperCase() : ' ';
      })
      .replace(STRING_UNDERSCORE_REGEXP_1, '$1 $2')
      .replace(STRING_UNDERSCORE_REGEXP_2, ' ')
      .toLowerCase()
  );
}

/**
 * More general than decamelize. Returns the lower\_case\_and\_underscored
 * form of a string.
 *
 * ```javascript
 * underscore('innerHTML')          // 'inner_html'
 * underscore('action_name')        // 'action_name'
 * underscore('css-class-name')     // 'css_class_name'
 * underscore('my favorite items')  // 'my_favorite_items'
 * ```
 *
 * @method underscore
 * @param str The string to underscore.
 * @return the underscored string.
 */
export function underscore(str: string): string {
  return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
}

/**
 * Returns the appropriate plural suffix for the "character" word based on locale.
 * Uses Intl.PluralRules API to determine the correct plural form for the current locale.
 *
 * ```javascript
 * getCharacterPluralSuffix(1)  // '' (en: "character", pl: "znak")
 * getCharacterPluralSuffix(2)  // 's' (en: "characters", pl: "znaki" → 'i')
 * getCharacterPluralSuffix(5)  // 's' (en: "characters", pl: "znaków" → 'ów')
 * ```
 *
 * @method getCharacterPluralSuffix
 * @param count The number of characters
 * @return The plural suffix for the word "character" in the current locale
 */
export function getCharacterPluralSuffix(count: number): string {
  const locale = document.documentElement.lang || navigator.language || 'en';

  // For English (source locale), use simple pluralization
  if (locale === 'en') {
    return count > 1 ? 's' : '';
  }

  // For other locales, use Intl.PluralRules
  try {
    const pr = new Intl.PluralRules(locale);
    const rule = pr.select(count);

    // Polish pluralization rules for "znak" (character):
    // one (1) → "znak" (no suffix)
    // few (2-4, 22-24, 32-34, etc.) → "znaki" (suffix: 'i')
    // many (0, 5+, 11-14, etc.) → "znaków" (suffix: 'ów')
    if (locale === 'pl') {
      switch (rule) {
        case 'one':
          return '';
        case 'few':
          return 'i';
        case 'many':
          return 'ów';
        default:
          return 'ów';
      }
    }

    // Spanish pluralization rules for "carácter":
    // one (1) → "carácter" (no suffix)
    // other (0, 2+) → "caracteres" (suffix: 'es')
    if (locale.startsWith('es')) {
      return rule === 'one' ? 'carácter' : 'caracteres';
    }

    // Italian pluralization rules for "carattere":
    // one (1) → "carattere" (no suffix)
    // other (0, 2+) → "caratteri" (suffix: 'i')
    if (locale === 'it') {
      return rule === 'one' ? '' : 'i';
    }

    // For other languages (Dutch, English, etc.), fall back to simple plural logic
    return count > 1 ? 's' : '';
  } catch {
    // Fallback if Intl.PluralRules is not supported
    return count > 1 ? 's' : '';
  }
}
