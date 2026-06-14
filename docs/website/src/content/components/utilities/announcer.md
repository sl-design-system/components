---
title: Announcer
layout: docs
eleventyNavigation:
  key: Announcer
  parent: Utilities
---

The announcer sends messages to assistive technology (such as screen readers) through an ARIA
[live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions).
Use it to communicate things that happen visually but would otherwise go unnoticed by screen reader
users — for example "5 results found", "Item added to cart" or "Changes saved".

There should be a single `<sl-announcer>` instance on the page (typically in your app shell). All
components and code share that one instance, so you never create it more than once.

```html
<sl-announcer></sl-announcer>
```

::: info
Avoid sending messages too quickly after one another — screen readers may skip messages that arrive
in rapid succession.
:::

## Sending messages

### With the `announce` function

The simplest way to announce something is the `announce` helper. The second argument is the urgency:
`polite` (the default) waits until the user is idle, while `assertive` interrupts immediately.

```js
import { announce } from '@sl-design-system/announcer';

announce('Your changes have been saved.');
announce('Error: could not save your changes.', 'assertive');
```

### With an event

You can also announce a message by emitting the `sl-announce` event on `document.body`. This is
handy when you don't want a direct dependency on the announcer in your code.

```js
document.body.dispatchEvent(
  new CustomEvent('sl-announce', {
    detail: { message: 'Your changes have been saved.' }
  })
);
```

## API

See the [API reference](/api-reference/sl-announcer) for all attributes, properties and events.
