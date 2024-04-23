---
"@sl-design-system/angular": minor
---

Various improvements:

- Remove the `FormsModule` and make all form directives standalone

This is a breaking change and the reason for the minor version bump. If you are using the `FormsModule` in
your Angular app, you will need to remove it and import the form directives you are using individually.

- Generate Angular wrappers for all public web components

This will make it easier to use the components in Angular apps. You only need to import a specific component
to be able to get Angular bindings and type safety. This also removes the need for specifying the `CUSTOM_ELEMENTS_SCHEMA`
everywhere.

- Add `slTooltip` directive for ease-of-use in Angular

This is syntactic sugar for the `sl-tooltip` web component. It allows you to use the `slTooltip` directive on any
element by passing in the tooltip content as an input.
