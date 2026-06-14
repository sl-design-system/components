---
title: Message dialog
layout: docs
eleventyNavigation:
  key: Message dialog
  parent: Overlay
---

The message dialog is a convenience API for showing simple alert and confirmation dialogs — the
design system equivalent of `window.alert()` and `window.confirm()`. Rather than placing an element
in your markup, you call a static method that shows the dialog and returns a promise.

For richer, custom modals, use the [dialog](/components/overlay/dialog) component instead.

## Alert

`MessageDialog.alert()` shows a message with a single OK button. It resolves when the user
dismisses it.

```js
import { MessageDialog } from '@sl-design-system/message-dialog';

await MessageDialog.alert('Your changes have been saved.');

// With a custom title
await MessageDialog.alert('Your changes have been saved.', 'Success');
```

## Confirm

`MessageDialog.confirm()` shows a message with OK and Cancel buttons and resolves to a boolean
indicating the user's choice.

```js
import { MessageDialog } from '@sl-design-system/message-dialog';

const confirmed = await MessageDialog.confirm('Are you sure you want to delete this item?', 'Delete item');

if (confirmed) {
  // proceed with the deletion
}
```

## Custom dialogs

For full control over the message, title and buttons, use `MessageDialog.show()` with a
configuration object.

```js
import { MessageDialog } from '@sl-design-system/message-dialog';

const result = await MessageDialog.show({
  title: 'Unsaved changes',
  message: 'You have unsaved changes. What would you like to do?',
  buttons: [
    { text: 'Discard', value: 'discard', variant: 'danger' },
    { text: 'Keep editing', value: 'keep', variant: 'primary' }
  ]
});
```

## API

See the [API reference](/api-reference/sl-message-dialog) for all properties and methods.
