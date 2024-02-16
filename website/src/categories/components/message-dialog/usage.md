---
title: Message dialog usage
tags: usage
eleventyNavigation:
  parent: Message dialog
  key: MessageDialogUsage
---

<section>
<div class="ds-example">
  <sl-button>Show message</sl-button>
  <script>
    document.querySelector('sl-button')?.addEventListener('click', () => {
      MessageDialog.alert('This is a message dialog');
    });
  </script>
</div>

<div class="ds-code">

```html
  <sl-button>Show message</sl-button>
  <script type="module">
    import { MessageDialog } from '@sl-design-system/message-dialog';

    document.querySelector('sl-button')?.addEventListener('click', () => {
      MessageDialog.alert('This is a message dialog');
    });
  </script>
```

</div>
</section>

<section>

## When to use

The message dialog should be used to present critical information or ask for decisions. For instance, when confirming a high-risk action (e.g., deleting data), a message dialog ensures user attention.

</section>

<section>

## When not to use

The message dialog should not be used to present complex data or complex interactions. Keep them concise. If have a need for complex interactions, consider using the [dialog](../dialog/) component.

You should also not use this component to interrupt the user unnecessarily. Only show a message dialog when the user explicitly triggers it and when there is no other alternative (for example an [inline-message](../inline-message)).

</section>

