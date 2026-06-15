---
title: Dialog
layout: component
eleventyNavigation:
  key: Dialog
  parent: Overlay
---

```html {.example .show-source}
<sl-button command="--show-modal" commandfor="example-dialog" variant="primary">Open dialog</sl-button>

<sl-dialog id="example-dialog" close-button>
  <span slot="title">Dialog title</span>
  <p>This is the body of the dialog. Use it for focused tasks or important messages.</p>
  <sl-button slot="primary-actions" command="--close" commandfor="example-dialog">Cancel</sl-button>
  <sl-button slot="primary-actions" variant="primary" command="--close" commandfor="example-dialog">Confirm</sl-button>
</sl-dialog>
```

`<sl-dialog>` is a modal window that appears on top of the page for a focused task, such as
confirming an action or filling in a short form. It has a `title` slot, a body (the default slot)
and slots for action buttons. For simple alert/confirm messages, the
[message dialog](/components/overlay/message-dialog) is more convenient.

## Opening and closing

The dialog works with the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API),
so you can open and close it from buttons without writing any JavaScript. Point a button at the
dialog with `commandfor` and use the `--show-modal` and `--close` commands.

You can also open it from JavaScript by calling `showModal()` on the dialog, and close it with
`close()`.

## Examples

### Actions

Place buttons in the `primary-actions` slot, and less prominent actions in the `secondary-actions`
slot. Add `sl-dialog-close` (or a `--close` command) to a button to close the dialog when it is
clicked.

```html {.example .show-source}
<sl-button command="--show-modal" commandfor="actions-dialog" variant="primary">Open dialog</sl-button>

<sl-dialog id="actions-dialog">
  <span slot="title">Delete item</span>
  <p>Are you sure you want to delete this item? This action cannot be undone.</p>
  <sl-button fill="outline" slot="secondary-actions" command="--close" commandfor="actions-dialog">Help</sl-button>
  <sl-button slot="primary-actions" command="--close" commandfor="actions-dialog">Cancel</sl-button>
  <sl-button slot="primary-actions" variant="primary" command="--close" commandfor="actions-dialog">Delete</sl-button>
</sl-dialog>
```

### Close button

Add the `close-button` attribute to show a close (×) button in the top corner.

```html {.example .show-source}
<sl-button command="--show-modal" commandfor="close-dialog" variant="primary">Open dialog</sl-button>

<sl-dialog id="close-dialog" close-button>
  <span slot="title">With a close button</span>
  <p>This dialog has a close button in the top corner.</p>
</sl-dialog>
```

### Disable cancel

By default the dialog can be dismissed with the Escape key or by clicking the backdrop. Add
`disable-cancel` to require the user to use one of the action buttons.

```html {.example .show-source}
<sl-button command="--show-modal" commandfor="nocancel-dialog" variant="primary">Open dialog</sl-button>

<sl-dialog id="nocancel-dialog" disable-cancel>
  <span slot="title">Disable cancel</span>
  <p>You can only close this dialog with the button below.</p>
  <sl-button slot="primary-actions" variant="primary" command="--close" commandfor="nocancel-dialog">Close</sl-button>
</sl-dialog>
```

## API

See the [API reference](/api-reference/sl-dialog) for all attributes and properties.
