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
export function camelize(str) {
  return str
    .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr) => {
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
export function capitalize(str) {
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
export function classify(str) {
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
export function dasherize(str) {
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
export function decamelize(str) {
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
export function humanize(str) {
  return capitalize(
    str
      .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr) => {
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
export function underscore(str) {
  return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
}
