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
- Dutch (nl)

To add support for a new language, create a new xliff file with the appropriate language code.