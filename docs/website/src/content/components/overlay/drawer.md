---
title: Drawer
layout: component
eleventyNavigation:
  key: Drawer
  parent: Overlay
---

```html
<sl-button id="open">Show drawer</sl-button>

<sl-drawer>
  <h2 slot="title">More information</h2>
  <p>The content of the drawer goes here.</p>
</sl-drawer>

<script type="module">
  const button = document.getElementById('open');
  const drawer = button.nextElementSibling;

  button.addEventListener('click', () => drawer.showModal());
</script>
```

## Usage

`<sl-drawer>` is a panel that slides in from the edge of the screen. Use it for secondary content or
tasks that benefit from more room than a [dialog](/components/overlay/dialog) — such as filters,
details or settings — while keeping the user in context.

Put a heading in the `title` slot and the panel content in the default slot.

Open the drawer by calling `showModal()` on it, and close it with `close()`.

## Examples

### Attachment

Use the `attachment` attribute to choose which edge the drawer slides in from. It defaults to
`right`.

```html
<sl-drawer attachment="left">
  <h2 slot="title">Left drawer</h2>
  <p>This drawer slides in from the left.</p>
</sl-drawer>
```

### Disable close

By default the drawer can be dismissed with the Escape key or by clicking the backdrop. Add
`disable-close` to require the user to close it explicitly.

```html
<sl-drawer disable-close>
  <h2 slot="title">Important</h2>
  <p>This drawer can only be closed with a button inside it.</p>
</sl-drawer>
```

## API

See the [API reference](/api-reference/sl-drawer) for all attributes and properties.
