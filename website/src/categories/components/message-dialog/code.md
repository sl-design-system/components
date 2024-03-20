---
title: Message dialog code
tags: code
eleventyNavigation:
  parent: Message dialog
  key: MessageDialogCode
---

<section>
<div class="ds-example">

  <sl-button id="message-button">Show message</sl-button>
  <script>
    document.querySelector('#message-button')?.addEventListener('click', () => {
      MessageDialog.show({
        title: 'Custom buttons',
        message: 'This is a message with custom buttons. Are you sure you want to press any buttons?',
        buttons: [
          { text: 'No, run away!', value: 'NO' },
          { text: `Yes, I don't care what it does`, value: 'YES', variant: 'danger' }
        ]
      });
    });
  </script>

</div>

<div class="ds-code">

  ```html
  <sl-button>Show message</sl-button>
  <script>
    document.querySelector('sl-button')?.addEventListener('click', () => {
      const result = await MessageDialog.show({
        title: 'Custom buttons',
        message: 'This is a message with custom buttons. Are you sure you want to press any buttons?',
        buttons: [
          { text: 'No, run away!', value: 'NO' },
          { text: `Yes, I don't care what it does`, value: 'YES', variant: 'danger' }
        ]
      });

      if (result === 'YES') {
        // ...
      }
    });
  </script>
  ```

</div>
</section>

<ds-install-info link-in-navigation package="message-dialog"></ds-install-info>

<section>

## Alert

The `MessageDialog.alert()` API is used to show a message dialog with a single "OK" button. Use this for informing the user about something important. Do not use this just for anything, as you are interrupting the workflow of the user.

By default, the alert dialog will have a title of "Alert". You can change that by passing a second parameter specifying the title.

The method returns a promise that resolves when the user clicks "OK" or cancels the dialog.

</section>

<section>

## Confirm

The `MessageDialog.confirm()` API is used to show a message dialog with two buttons: "OK" and "Cancel". Use this for asking the user to confirm an action.

If you are using this, you probably want to customize the buttons further, since "Cancel" and "OK" are not very descriptive. If so, look at the `MessageDialog.show()` API below.

The method returns a promise that resolves with `true` if the user clicks "OK", `false` if the user clicks "Cancel" and `undefined` is the dialog is cancelled.

</section>

<section>

## Show

The `MessageDialog.show()` API is the most flexible of the three. It allows you to pass a configuration object with the following properties:

- `title` (string): The title of the dialog.
- `subtitle` (string): The subtitle of the dialog.
- `message` (string): The message of the dialog.
- `buttons` (array): An array of button objects. Each button object can have the following properties:
  - `text` (string): The text of the button.
  - `value` (string): The value of the button. This is what will be returned when the button is clicked.
  - `variant` (string): The variant of the button. This can be "primary", "success", "info", "warning", or "danger".
- `disableCancel` (boolean): Determines whether the user can cancel the message dialog using the Escape key or by clicking on the backdrop.

The `MessageDialog.show()` API returns a promise that resolves with the value of the button that was clicked. This allows you to perform different actions based on the button that was clicked.

</section>
