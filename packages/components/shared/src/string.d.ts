/**
 * Returns the lowerCamelCase form of a string.
 *
 * ```javascript
 * camelize('innerHTML')          // 'innerHTML'
 * camelize('action_name')        // 'actionName'
 * camelize('css-class-name')     // 'cssClassName'
 * camelize('my favorite items')  // 'myFavoriteItems'
 * camelize('My Favorite Items')  // 'myFavoriteItems'
 * ```
 *
 * @method camelize
 * @param str The string to camelize.
 * @return the camelized string.
 */
export declare function camelize(str: string): string;
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
export declare function capitalize(str: string): string;
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
export declare function classify(str: string): string;
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
export declare function dasherize(str: string): string;
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
export declare function decamelize(str: string): string;
/**
 * Returns the Humanized form of a string
 *
 * ```javascript
 * humanize('innerHTML')         // 'Inner HTML'
 * humanize('action_name')       // 'Action name'
 * humanize('css-class-name')    // 'Css class name'
 * humanize('my favorite items') // 'My favorite items'
 * ```
 *
 * @method capitalize
 * @param str The string to humanize.
 * @return The humanized string.
 */
export declare function humanize(str: string): string;
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
export declare function underscore(str: string): string;
