---
title: Popover
layout: docs
eleventyNavigation:
  key: Popover
  parent: Overlay
---

`<sl-popover>` is a lightweight, anchored container that appears on top of other content to show
extra information or actions. Unlike a [dialog](/components/overlay/dialog) it is non-modal: the rest
of the page stays interactive. Unlike a [tooltip](/components/overlay/tooltip) it can contain rich,
interactive content.

Anchor the popover to a trigger with the `anchor` attribute (the trigger's `id`), and control its
placement with `position`.

## Usage

The popover is built on the native [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API),
so you toggle it by calling `togglePopover()` (or `showPopover()` / `hidePopover()`).

```html
<sl-button id="trigger">Toggle popover</sl-button>

<sl-popover anchor="trigger" position="bottom">
  <header>Hello! I am a popover.</header>
  <p>I can hold text, actions, or other rich content.</p>
</sl-popover>

<script type="module">
  const button = document.getElementById('trigger');
  const popover = button.nextElementSibling;

  button.addEventListener('click', () => popover.togglePopover());
</script>
```

## Position

Use the `position` attribute to place the popover relative to its anchor. Besides `top`, `right`,
`bottom` and `left`, each side also has `-start` and `-end` variants.

```html
<sl-popover anchor="trigger" position="right-start">…</sl-popover>
```

## Rich content

Because the popover is non-modal and accepts any markup, you can include headings, paragraphs and
interactive controls such as buttons.

```html
<sl-popover anchor="trigger" position="bottom">
  <header style="font: var(--sl-text-heading-sm);">Filters</header>
  <p>Refine the results shown in the list.</p>
  <sl-button variant="primary">Apply</sl-button>
</sl-popover>
```

## API

See the [API reference](/api-reference/sl-popover) for all attributes and properties.
