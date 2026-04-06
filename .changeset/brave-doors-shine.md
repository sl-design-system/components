---
'@sl-design-system/button': major
---

Breaking changes:

- The component now renders a native `<button>` inside the shadow DOM, changing the DOM structure
- The `icon-only` attribute and `iconOnly` property have been removed in favor of the `:state(icon-only)` CSS custom state

The new DOM structure with the `<button>` element now allows us to use the new [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) via the `command` and `commandfor` properties, which enables declarative opening and closing of dialogs without needing JavaScript. For example, setting `command="--show-modal"` and `commandfor="my-dialog"` on a button will automatically open the referenced `<sl-dialog>` when clicked. Alternatively, you can set `commandForElement` directly to an element reference instead of using a DOM id. Note: you also need to update `@sl-design-system/dialog` to the latest version for command support.

The `delegatesFocus` option is used to delegate focus to the inner button, ensuring proper keyboard navigation and accessibility. We also no longer need custom keyboard handling or ARIA role setup, as the native button will handle this for us.

Finally, the `icon-only` attribute and `iconOnly` property were never meant to be public API. If you were manually adding the `icon-only` attribute, you can safely remove that now.
