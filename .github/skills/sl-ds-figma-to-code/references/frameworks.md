# sl-ds per framework

Read this before using an sl-ds component the project does not use yet.
Follow how the project already uses sl-ds when it differs from this file, and say so in the summary.

## All frameworks

- Components come in packages, `@sl-design-system/<package>`, and a package can hold several tags, so the tag name does not give the package.
  Find it by the tag's `tagName` in `node_modules/@sl-design-system/*/custom-elements.json`, else in `packages/components/*/src/register.ts` on `main`.
  For example, `sl-form-field`, `sl-label`, `sl-hint` and `sl-error` are in `form`; `sl-option` and `sl-option-group` in `listbox`; `sl-radio` in `radio-group`; `sl-checkbox-group` in `checkbox`; `sl-tab`, `sl-tab-group` and `sl-tab-panel` in `tabs`; `sl-menu-item` and `sl-menu-button` in `menu`; `sl-accordion-item` in `accordion`.
- Each package has its own version: never take a version from another sl-ds package.
  Ask before adding one, then install it without a version so the package manager picks the latest release; if the project uses `@sl-design-system/angular`, use the range its `peerDependencies` give for that package, when they list it.
- `import '@sl-design-system/<package>/register.js'` once registers every tag in that package; the classes come from `@sl-design-system/<package>` for types.
- Attributes and properties, slots, events (`sl-change`, `sl-blur` and others) and CSS custom properties are in the package's `custom-elements.json`; use only what is there.
- Form controls go inside `sl-form-field` for the label, hint and error, as in the component's stories.

## Angular

- `@sl-design-system/angular` wraps the components: import the standalone `<Class>Component` from `@sl-design-system/angular/<package>`, named after the package, not the tag (for example `ButtonComponent` from `@sl-design-system/angular/button`, `FormFieldComponent` from `@sl-design-system/angular/form` and `OptionComponent` from `@sl-design-system/angular/listbox`; there is no `angular/form-field` or `angular/option`).
  It imports `register.js` for you; bind events by their DOM name, such as `(sl-change)`, as the Angular stories do.
- With `ngModel` or reactive forms, also import the matching directive from `@sl-design-system/angular/forms` (`TextFieldDirective`, `SelectDirective`, `CheckboxDirective` and the others); without it the control has no value accessor.
- `DialogService`, `MessageDialogService` and `TooltipDirective` come from `@sl-design-system/angular`; use the services to open dialogs from code.
- Projects that use the plain tags with `CUSTOM_ELEMENTS_SCHEMA` instead of the wrappers: keep doing that, with the `register.js` import, and mention the wrappers once in the summary.
- The theme's `setup()` goes in `main.ts`, its `theme.css` in the `styles` of `angular.json`.

## Lit and plain web components

- The `register.js` import in the module that renders the tag.
- Events with `@sl-change=${...}`; properties with `.value=${...}` where the value is not a string.

## React and others

- No wrappers: use the tags with the `register.js` import.
  React 19 passes properties and events to custom elements; older React needs a ref for properties and `addEventListener` for `sl-*` events.
- SSR is not supported: render sl-ds components on the client only.
