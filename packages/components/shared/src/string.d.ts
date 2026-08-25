/**
 * Returns the lowerCamelCase form of a string.
 *
 * ```javascript
 * camelize('innerHTML'); // 'innerHTML'
 * camelize('action_name'); // 'actionName'
 * camelize('css-class-name'); // 'cssClassName'
 * camelize('object.path.name'); // 'objectPathName'
 * camelize('my favorite items'); // 'myFavoriteItems'
 * camelize('My Favorite Items'); // 'myFavoriteItems'
 * ```
 *
 * @function camelize
 * @param str The string to camelize.
 * @returns The camelized string.
 */
export declare function camelize(str: string): string;
/**
 * Returns the Capitalized form of a string
 *
 * ```javascript
 * capitalize('innerHTML'); // 'InnerHTML'
 * capitalize('action_name'); // 'Action_name'
 * capitalize('css-class-name'); // 'Css-class-name'
 * capitalize('my favorite items'); // 'My favorite items'
 * ```
 *
 * @function capitalize
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export declare function capitalize(str: string): string;
/**
 * Returns the UpperCamelCase form of a string.
 *
 * ```javascript
 * classify('innerHTML'); // 'InnerHTML'
 * classify('action_name'); // 'ActionName'
 * classify('css-class-name'); // 'CssClassName'
 * classify('my favorite items'); // 'MyFavoriteItems'
 * ```
 *
 * @function classify
 * @param str The string to classify
 * @returns The classified string
 */
export declare function classify(str: string): string;
/**
 * Replaces underscores, spaces, or camelCase with dashes.
 *
 * ```javascript
 * dasherize('innerHTML'); // 'inner-html'
 * dasherize('action_name'); // 'action-name'
 * dasherize('css-class-name'); // 'css-class-name'
 * dasherize('my favorite items'); // 'my-favorite-items'
 * ```
 *
 * @function dasherize
 * @param str The string to dasherize.
 * @returns The dasherized string.
 */
export declare function dasherize(str: string): string;
/**
 * Converts a camelized string into all lower case separated by underscores.
 *
 * ```javascript
 * decamelize('innerHTML'); // 'inner_html'
 * decamelize('action_name'); // 'action_name'
 * decamelize('css-class-name'); // 'css-class-name'
 * decamelize('my favorite items'); // 'my favorite items'
 * ```
 *
 * @function decamelize
 * @param str The string to decamelize.
 * @returns The decamelized string.
 */
export declare function decamelize(str: string): string;
/**
 * Returns the Humanized form of a string
 *
 * ```javascript
 * humanize('innerHTML'); // 'Inner html'
 * humanize('action_name'); // 'Action name'
 * humanize('css-class-name'); // 'Css class name'
 * humanize('my favorite items'); // 'My favorite items'
 * ```
 *
 * @function humanize
 * @param str The string to humanize.
 * @returns The humanized string.
 */
export declare function humanize(str: string): string;
/**
 * More general than decamelize. Returns the lower_case_and_underscored form of a string.
 *
 * ```javascript
 * underscore('innerHTML'); // 'inner_html'
 * underscore('action_name'); // 'action_name'
 * underscore('css-class-name'); // 'css_class_name'
 * underscore('my favorite items'); // 'my_favorite_items'
 * ```
 *
 * @function underscore
 * @param str The string to underscore.
 * @returns The underscored string.
 */
export declare function underscore(str: string): string;
/**
 * Returns the locale-specific pluralized form used for the "character" label. Uses Intl.PluralRules
 * API to determine the correct plural form for the current locale.
 *
 * Note: despite the historical name, this helper does not always return a literal suffix. Some
 * locales can require a full localized word or form rather than an English-style ending.
 *
 * ```javascript
 * getCharacterPluralSuffix(1)  // '' in English ("character"), but may be a full singular form in other locales
 * getCharacterPluralSuffix(2)  // 's' in English ("characters"), but may be a different localized plural form
 * getCharacterPluralSuffix(5)  // 's' in English ("characters"), but may be a different localized plural form
 *
 * @function getCharacterPluralSuffix
 * @param count The number of characters
 * @param locale Optional locale override. If omitted, uses the active @lit/localize locale,
 *   then falls back to document.documentElement.lang or navigator.language.
 * @returns The plural suffix for the word "character" in the current locale
 * ```
 */
export declare function getCharacterPluralSuffix(count: number, locale?: string): string;
/**
 * Returns the CLDR plural category for the given count and locale. Uses Intl.PluralRules to
 * determine the category. Falls back to a simple 'one'/'other' distinction if Intl.PluralRules is
 * not supported.
 *
 * ```javascript
 * getPluralCategory(1); // 'one'
 * getPluralCategory(2); // 'other' in English, 'few' in Polish
 * getPluralCategory(5); // 'other' in English, 'many' in Polish
 * ```
 *
 * @function getPluralCategory
 * @param count The number to determine the plural category for.
 * @returns The CLDR plural category: 'zero', 'one', 'two', 'few', 'many', or 'other'.
 */
export declare function getPluralCategory(count: number): Intl.LDMLPluralRule;
