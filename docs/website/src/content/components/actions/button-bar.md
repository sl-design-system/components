---
title: Button bar
layout: component
issueNumber: 2315
storybook: actions-button-bar--basic
eleventyNavigation:
  key: Button bar
  parent: Actions
---

```html {.example .show-source}
<sl-button-bar>
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
```

## Usage

Use a button bar to group related buttons side by side with consistent spacing. The button bar automatically wraps buttons to the next line when there is not enough horizontal space.

Use a button bar instead of manually laying out buttons at every place where multiple actions are needed. This achieves consistency across your application, including different layouts on different viewports.

Typical use cases include:

- **Form actions**: Group actions like "Submit", "Cancel", or "Reset" together at the bottom of a form.
- **Navigation**: Guide users through multi-step flows with "Next", "Previous", or "Finish" buttons.
- **Content actions**: Group actions like "Edit", "Delete", or "Save" for a specific piece of content in a logically cohesive way.

::: info
Do not use a button bar when you need a toolbar — a UI region that contains controls for operating on the content of an application (such as text formatting controls or drawing tools). A toolbar has distinct keyboard navigation semantics (`role="toolbar"` with arrow-key navigation between items) and is intended for persistent, application-level controls rather than contextual actions. Use the `<sl-toolbar>` component for that purpose instead.
:::

## Examples

### Alignment

Use the `align` attribute to control how buttons are distributed along the horizontal axis.

Start
: Buttons are aligned to the left (default).

Center
: Buttons are centered in the bar.

End
: Buttons are aligned to the right.

Space between
: Buttons are spread across the full width with space between them.

```html {.example .justify-stretch .vertical}
<sl-button-bar>
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar align="center">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar align="end">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar align="space-between">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
```

### Reverse

Use the `reverse` attribute to reverse the visual order of the buttons. This is useful when you want a primary action to appear on the right but still be first in the DOM order for accessibility.

```html {.example .justify-stretch}
<sl-button-bar align="end" reverse>
  <sl-button variant="primary">Save</sl-button>
  <sl-button fill="ghost">Cancel</sl-button>
</sl-button-bar>
```

### Size

Use the `size` attribute to set the size of all buttons in the bar at once, instead of setting it individually on each button.

```html {.example .justify-stretch .vertical}
<sl-button-bar size="sm">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar size="md">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar size="lg">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
```

### Fill

Use the `fill` attribute to set the fill of all buttons in the bar at once.

```html {.example .vertical}
<sl-button-bar fill="solid">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar fill="outline">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
<sl-button-bar fill="ghost">
  <sl-button>Foo</sl-button>
  <sl-button>Bar</sl-button>
  <sl-button>Baz</sl-button>
</sl-button-bar>
```

### Variant

Use the `variant` attribute to set the variant of all buttons in the bar at once.

```html {.example .justify-stretch}
<sl-button-bar align="end" reverse variant="primary">
  <sl-button>Save</sl-button>
  <sl-button fill="ghost">Cancel</sl-button>
</sl-button-bar>
```

### Wrapping

When there is not enough horizontal space, buttons automatically wrap to the next line.

```html {.example}
<sl-button-bar>
  <sl-button>Lorem</sl-button>
  <sl-button>dolor</sl-button>
  <sl-button>sit</sl-button>
  <sl-button>amet</sl-button>
  <sl-button>officia</sl-button>
  <sl-button>esse</sl-button>
  <sl-button>sunt</sl-button>
  <sl-button>nulla</sl-button>
  <sl-button>et</sl-button>
  <sl-button>sint</sl-button>
  <sl-button>nostrud</sl-button>
  <sl-button>nisi</sl-button>
</sl-button-bar>
```

### Icon only

When all slotted buttons are icon-only ghost buttons, the button bar automatically reduces the gap between them.

```html {.example}
<sl-button-bar fill="ghost">
  <sl-button aria-labelledby="tooltip-home">
    <sl-icon name="home-blank"></sl-icon>
  </sl-button>
  <sl-tooltip id="tooltip-home">Home</sl-tooltip>
  <sl-button aria-labelledby="tooltip-pinata">
    <sl-icon name="pinata"></sl-icon>
  </sl-button>
  <sl-tooltip id="tooltip-pinata">Pinata</sl-tooltip>
  <sl-button aria-labelledby="tooltip-smile">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-tooltip id="tooltip-smile">Smile</sl-tooltip>
</sl-button-bar>
```

## Accessibility

The button bar is a layout component and does not add any ARIA roles or attributes. Each slotted button retains its own accessible semantics. Make sure each button has an accessible name — especially icon-only buttons, which require either an `aria-label` or an associated tooltip.
