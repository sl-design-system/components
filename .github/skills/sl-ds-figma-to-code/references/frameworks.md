# sl-ds per framework

Read this before using an sl-ds component the project does not use yet.
Follow how the project already uses sl-ds when it differs from this file, and say so in the summary.

## All frameworks

- Each component is its own package, `@sl-design-system/<name>`, with the same version line as the ones the project has; ask before adding one.
- `import '@sl-design-system/<name>/register.js'` once registers the `sl-<name>` tag; the class comes from `@sl-design-system/<name>` for types.
- Attributes and properties, slots, events (`sl-change`, `sl-blur` and others) and CSS custom properties are in the package's `custom-elements.json`; use only what is there.
- Form controls go inside `sl-form-field` for the label, hint and error, as in the component's stories.

## Angular

- `@sl-design-system/angular` wraps the components: import the standalone `<Name>Component` from `@sl-design-system/angular/<name>` (for example `ButtonComponent` from `@sl-design-system/angular/button`).
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
