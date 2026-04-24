# Translations

Translations are an important part of our design system, allowing us to provide a consistent user experience across different languages and regions. 
In this document, we will outline the process for adding translations to our components, including the tools and libraries we use, as well as the structure of our translation files.

For the translations in Sanoma Learning Design System, we use [Lit Localize](https://lit.dev/docs/localization/overview/) library.

Translations are provided in the `locales` folder. The translations are stored in `xlif` files, one for each language.
The file names are the language codes (e.g., `en.json`, `nl.json`, etc.). 
Each `xlif` file contains key-value pairs, where the keys are the same across all languages, and the values are the translated strings.

## What do example translation look like?

For the translations we use our own message ids, not those generated automatically by Lit Localize.
This helps to prevent overriding translations accidentally.
For more details, see: [Lit Localization documentation](https://lit.dev/docs/localization/overview/#overriding-ids).

### Example of a translation

In the component:

```html
msg('Close', {id: 'sl.inlineMessage.close’});
```

In the xliff file:

```xml
<trans-unit id="sl.inlineMessage.close">
  <source>Close</source>
  <target>Sluiten</target>
</trans-unit>
```


## Id scheme naming

The basic structure of the `id` scheme is:

```
sl.packageName.textDescription
```

Every **id** will start with `sl.` to indicate that it is a Sanoma Learning Design System id. 
The `packageName` part will be the name of the package component in **camelCase**,
and the `textDescription` part will be a short description of the text (also in **camelCase**).

As a second part we can use `common` instead of the `packageName` to indicate that the text is not related to a specific component, is used in multiple components.

Example structure for **common** translation:

`sl.common.textDescription`

In some cases we will have additional part like `context` group.

For instance:

Validation: `sl.textField.validation.tooShort`

## Detailed ID Structure Guidelines

### Component-specific vs. Common Translations

- **Component-specific**: Use `sl.packageName.description` for translations that are unique to a component (package),
- **Common translations**: Use `sl.common.description` for shared text across multiple components.

### Context Groups

For better organization, we use these (example) standard context groups:

- **validation**: For validation error messages
  - `sl.textField.validation.valueMissing`
  - `sl.common.validation.invalidFormat`

### Best Practices

1. **Be specific**: Use detailed descriptions that clearly indicate the purpose
  - Good: `sl.datePicker.previousMonth`
  - Avoid: `sl.datePicker.previous`

2. **Consistency**: Use the same pattern for similar messages across components
  - For validation: always use `validation.tooShort`, not `tooFew` or `notEnough`.

3. **Reuse carefully**: Before creating a new ID, check if an existing `common` translation fits.

### Handling Variables

When using variables in translations:

```js
// Example with variables
msg(str`Please enter at least ${this.minLength} characters (you currently have ${length})`,
  { id: 'sl.textField.validation.tooShort' });
```

## Adding New Translations

1. Add the message in your component using the appropriate ID.

2. Update source files:

Run the following command in the root of the project:

```bash
yarn run extract-i18n
```

3. Add translations for all supported languages.

More information about the xliff files structure and generated translations can be found in the [Lit Localize documentation](https://lit.dev/docs/localization/overview/#extracting-messages).


## Supported Languages

The SL design system currently supports these languages:
- English (default)
- Spanish - Spain (es-ES)
- Italian (it)
- Dutch (nl)
- Polish (pl)

To add support for a new language, create a new xliff file with the appropriate language code.

## Loading Translations

The `@sl-design-system/locales` package provides multiple ways to load translations, depending on your needs.

### Recommended: Dynamic Loading with @lit/localize

For optimal bundle size and performance, use dynamic imports with `@lit/localize`:

```typescript
import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from '@sl-design-system/locales';

const { setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: async (locale) => {
    // Dynamic imports enable code-splitting per locale
    switch (locale) {
      case 'nl': return import('@sl-design-system/locales/nl.js');
      case 'it': return import('@sl-design-system/locales/it.js');
      case 'es-ES': return import('@sl-design-system/locales/es-ES.js');
      case 'pl': return import('@sl-design-system/locales/pl.js');
      default: return import('@sl-design-system/locales/nl.js');
    }
  }
});

// Switch locale at runtime
await setLocale('nl'); // Loads Dutch translations on-demand
```

**Benefits:**
- Each locale is in its own bundle chunk
- Locales are only loaded when needed
- Reduces initial bundle size

### Alternative: Using the loadLocale Helper

The package provides a `loadLocale` helper for convenience:

```typescript
import { loadLocale } from '@sl-design-system/locales';

// Load a specific locale
const dutchTranslations = await loadLocale('nl');
const closeText = dutchTranslations.templates['sl.common.close']; // "Sluiten"
```

### Direct Import (Static)

If you know which locale you need at build time:

```typescript
// Option 1: Import from main package (backward compatible)
import { nl } from '@sl-design-system/locales';

// Option 2: Import from subpath export
import * as nl from '@sl-design-system/locales/nl.js';

// Access translations directly
const closeText = nl.templates['sl.common.close']; // "Sluiten"
```

**Note:** Direct imports load the locale immediately. For better performance, prefer dynamic loading. Modern bundlers can tree-shake unused locales when importing from the main package.

### Accessing Locale Metadata

```typescript
import { sourceLocale, targetLocales, allLocales } from '@sl-design-system/locales';

console.log(sourceLocale);    // 'en'
console.log(targetLocales);   // ['es-ES', 'it', 'nl', 'pl']
console.log(allLocales);      // ['en', 'es-ES', 'it', 'nl', 'pl']
```
