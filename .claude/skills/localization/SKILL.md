---
name: localization
description: Add or update localized strings in SL Design System web components using @lit/localize. Covers msg() usage, ID naming, XLIFF translation files, the extract/build pipeline, and LocaleMixin for locale-aware formatting.
---

# Localization for: $ARGUMENTS

You are adding or updating translated strings in an SL Design System Lit 3 web component. The project uses `@lit/localize` in **runtime mode** with a single target locale (`nl`). All source strings are authored in English.

## When to use localization

Add localization to a component when it renders any user-visible string that is not supplied by the consumer via a slot or property — for example: built-in button labels, ARIA labels, validation messages, placeholder text, or status announcements.

Do **not** localize strings that are purely developer-facing (error messages thrown to the console, JSDoc, etc.).

## Step 1: Component setup

### 1a. Imports and decorator

Add three imports and the `@localized()` decorator to the component:

```ts
import { localized, msg, str } from '@lit/localize';

@localized()
export class MyComponent extends LitElement {
```

Use `LocaleMixin` as well when the component needs locale-aware number/date formatting (e.g. `Intl.DateTimeFormat`, `Intl.NumberFormat`):

```ts
import { LocaleMixin } from '@sl-design-system/shared';
import { localized, msg, str } from '@lit/localize';

@localized()
export class MyComponent extends LocaleMixin(LitElement) {
  // this.locale is now available and reactive to <html lang> changes
}
```

### 1b. Package dependencies

If the component does not already depend on `@lit/localize`, add it to `package.json`:

```json
"devDependencies": {
  "@lit/localize": "^0.12.2"
},
"peerDependencies": {
  "@lit/localize": "^0.12.1"
}
```

Look up the currently installed version by checking another localized component (e.g. `packages/components/date-field/package.json`) and use the same version range.

## Step 2: Wrapping strings with `msg()`

### Simple static string

```ts
msg('Close', { id: 'sl.myComponent.close' })
```

### String with dynamic values — use `str` tagged template

```ts
import { msg, str } from '@lit/localize';

msg(str`Please enter a value between ${this.min} and ${this.max}.`, {
  id: 'sl.myComponent.rangeError'
})
```

`str` is a tagged template literal that preserves the interpolation placeholders in the XLIFF file so translators see them as `<x id="0" equiv-text="${this.min}"/>`.

### In HTML templates

```ts
html`<button aria-label=${msg('Open calendar', { id: 'sl.myComponent.openCalendar' })}>
       <sl-icon name="calendar"></sl-icon>
     </button>`
```

### Pluralization

`@lit/localize` does not have built-in plural support. Use `Intl.PluralRules` directly:

```ts
const rules = new Intl.PluralRules(this.locale);
const label = rules.select(this.count) === 'one'
  ? msg(str`${this.count} item selected`, { id: 'sl.myComponent.selectedOne' })
  : msg(str`${this.count} items selected`, { id: 'sl.myComponent.selectedMany' });
```

## Step 3: ID naming convention

Message IDs follow a strict naming pattern — wrong IDs will cause extraction to create duplicates:

```
sl.<componentName>.<messageName>
```

- `<componentName>`: lowerCamelCase name of the component without the `sl-` prefix (e.g. `dateField`, `messageDialog`, `numberField`).
- `<messageName>`: lowerCamelCase description of the string's purpose (e.g. `close`, `openCalendar`, `valueMissing`).

**Examples from existing components:**

| ID | String |
|---|---|
| `sl.breadcrumbs.home` | `'Home'` |
| `sl.common.close` | `'Close'` |
| `sl.dateField.selectDate` | `'Select date'` |
| `sl.messageDialog.cancelButton` | `'Cancel'` |
| `sl.numberField.validation.exceedsMaximum` | `'The value must be less than or equal to ${this.max}.'` |

Use `sl.common.*` for strings that are semantically identical across multiple components (e.g. "Close", "Cancel", "OK") — check `packages/locales/src/nl.xlf` first before creating a new ID.

## Step 4: Extract and build translations

After adding or changing `msg()` calls, run the extract step to update the XLIFF file:

```bash
yarn lit-localize extract
```

This reads `lit-localize.json` and updates `packages/locales/src/nl.xlf`. New strings appear as `<trans-unit>` elements **without** a `<target>` — these are untranslated and must be filled in.

### Add Dutch translations to `nl.xlf`

Open `packages/locales/src/nl.xlf` and find the new `<trans-unit>` elements. Add a `<target>` for each:

```xml
<trans-unit id="sl.myComponent.close">
  <source>Close</source>
  <target>Sluiten</target>
</trans-unit>

<trans-unit id="sl.myComponent.rangeError">
  <source>Please enter a value between <x id="0" equiv-text="${this.min}"/> and <x id="1" equiv-text="${this.max}"/>.</source>
  <target>Voer een waarde in tussen <x id="0" equiv-text="${this.min}"/> en <x id="1" equiv-text="${this.max}"/>.</target>
</trans-unit>
```

The `<x .../>` placeholders for dynamic values must be preserved exactly as generated — only translate the surrounding text.

### Build the locale modules

After editing `nl.xlf`, regenerate the TypeScript locale modules:

```bash
yarn lit-localize build
```

This writes `packages/locales/src/nl.ts`. Do not edit that file by hand — it is always overwritten by the build.

### Verify

Check that the generated `nl.ts` contains your new message IDs:

```bash
grep "myComponent" packages/locales/src/nl.ts
```

## Step 5: `LocaleMixin` for date/number formatting

When a component needs locale-aware formatting (date display, number display), extend with `LocaleMixin` from `@sl-design-system/shared`. This mixin:

- Exposes a reactive `locale` property that defaults to `document.documentElement.lang` or `navigator.language`.
- Re-renders the component automatically when `<html lang>` changes.
- Allows consumers to override the locale per-instance: `<sl-date-field locale="de">`.

```ts
import { LocaleMixin } from '@sl-design-system/shared';

export class MyComponent extends LocaleMixin(LitElement) {
  #formatter?: Intl.DateTimeFormat;

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('locale') || changed.has('value')) {
      this.#formatter = new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' });
    }
  }

  override render(): TemplateResult {
    return html`<span>${this.value ? this.#formatter!.format(this.value) : nothing}</span>`;
  }
}
```

Import `LocaleMixin` from shared and add `@sl-design-system/shared` as a dependency in `package.json` if not already present.

## Checklist

- [ ] `@localized()` decorator is applied to the component class
- [ ] All user-visible built-in strings are wrapped with `msg()`
- [ ] All dynamic strings use the `str` tagged template
- [ ] Message IDs follow the `sl.<componentName>.<messageName>` convention
- [ ] Reused strings reference an existing `sl.common.*` ID where appropriate
- [ ] `yarn lit-localize extract` has been run and `nl.xlf` is updated
- [ ] Dutch `<target>` translations are added for all new `<trans-unit>` elements
- [ ] `yarn lit-localize build` has been run and `nl.ts` is regenerated
- [ ] `LocaleMixin` is used when the component needs locale-aware `Intl.*` formatting
- [ ] `@lit/localize` is listed in `devDependencies` and `peerDependencies` in `package.json`
