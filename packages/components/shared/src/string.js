const STRING_DASHERIZE_REGEXP = /[ _]/g,
  STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g,
  STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g,
  STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g,
  STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;
export function camelize(str) {
  return str
    .replace(STRING_CAMELIZE_REGEXP, (_match, _separator, chr) => {
      return chr ? chr.toUpperCase() : '';
    })
    .replace(/^([A-Z])/, match => match.toLowerCase());
}
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
export function classify(str) {
  return str
    .split('.')
    .map(part => capitalize(camelize(part)))
    .join('.');
}
export function dasherize(str) {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}
export function decamelize(str) {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}
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
export function underscore(str) {
  return str
    .replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2')
    .replace(STRING_UNDERSCORE_REGEXP_2, '_')
    .toLowerCase();
}
const pluralRulesCache = /* @__PURE__ */ new Map();
let litLocalizeActiveLocale;
if (typeof window !== 'undefined') {
  window.addEventListener('lit-localize-status', event => {
    if (event.detail?.status === 'ready') {
      litLocalizeActiveLocale = event.detail.readyLocale;
    }
  });
}
export function getCharacterPluralSuffix(count, locale) {
  locale ??=
    litLocalizeActiveLocale ||
    (typeof document !== 'undefined' && document.documentElement.lang) ||
    (typeof navigator !== 'undefined' && navigator.language) ||
    'en';
  if (locale === 'en' || locale.startsWith('en-')) {
    return count === 1 ? '' : 's';
  }
  try {
    let pr = pluralRulesCache.get(locale);
    if (!pr) {
      pr = new Intl.PluralRules(locale);
      pluralRulesCache.set(locale, pr);
    }
    const rule = pr.select(count);
    if (locale === 'pl' || locale.startsWith('pl-')) {
      switch (rule) {
        case 'one':
          return '';
        case 'few':
          return 'i';
        case 'many':
          return '\xF3w';
        default:
          return '\xF3w';
      }
    }
    if (locale.startsWith('es')) {
      return rule === 'one' ? 'car\xE1cter' : 'caracteres';
    }
    if (locale === 'it' || locale.startsWith('it-')) {
      return rule === 'one' ? 'e' : 'i';
    }
    return count === 1 ? '' : 's';
  } catch {
    return count === 1 ? '' : 's';
  }
}
export function getPluralCategory(count) {
  const locale =
    litLocalizeActiveLocale ||
    (typeof document !== 'undefined' && document.documentElement.lang) ||
    (typeof navigator !== 'undefined' && navigator.language) ||
    'en';
  try {
    let pr = pluralRulesCache.get(locale);
    if (!pr) {
      pr = new Intl.PluralRules(locale);
      pluralRulesCache.set(locale, pr);
    }
    return pr.select(count);
  } catch {
    return count === 1 ? 'one' : 'other';
  }
}
//# sourceMappingURL=string.js.map
