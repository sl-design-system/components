---
title: Toggle button
layout: component
issueNumber: 2315
storybook: actions-toggle-button--basic
eleventyNavigation:
  key: Toggle button
  parent: Actions
---

```html {.example .show-source}
<sl-toggle-button aria-label="Show settings">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
```

## Usage

Icon-only toggle buttons are ideal for actions that are easily recognizable through common icons, such as play/pause, like/unlike, or expand/collapse. They are commonly used in toolbars and media controls where space is limited and quick access to functionalities like muting audio or changing playback states is necessary.

A toggle button always uses an icon to represent its current state. Provide two distinct icons: one for the default (unpressed) state and one for the pressed state. The pressed icon is shown when the button is active, allowing users to see at a glance whether the action is engaged.

::: info
Always provide an accessible label using `aria-label`. For icon-only toggle buttons this is required, as there is no visible text to describe the action.
:::

Users typically expect to see a switch when enabling or disabling features or settings. Using a toggle button instead can confuse users and disrupt the uniformity of the interface. In these situations, always opt for the switch component, which provides a clear and intuitive way for users to understand the state of a feature.

## Examples

### Fill

Use the `fill` attribute to control the visual weight of the button.

Solid
: The default; a filled background in idle state.

Outline
: A bordered button with a transparent background, for a lighter visual presence.

```html {.example .horizontal}
<sl-toggle-button aria-label="Show settings">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Show settings" fill="outline">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
```

### Shape

Use the `shape` attribute to change the button's shape.

```html {.example .horizontal}
<sl-toggle-button aria-label="Show settings">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Show settings" shape="pill">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
```

### Size

Toggle buttons are available in three sizes:

- `sm` — Small, for compact UIs
- `md` — Medium, the default
- `lg` — Large, for prominent actions

```html {.example .horizontal}
<sl-toggle-button aria-label="Show settings" size="sm">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Show settings" size="md">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Show settings" size="lg">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
```

### Pressed

Use the `pressed` attribute to set the initial pressed state, or bind to it to control the state programmatically.

```html {.example .horizontal}
<sl-toggle-button aria-label="Show settings">
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Show settings" pressed>
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
```

### Disabled

Use the `disabled` attribute to prevent interaction with the button.

```html {.example .horizontal}
<sl-toggle-button aria-label="Show settings" disabled>
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Show settings" disabled pressed>
  <sl-icon name="far-gear" slot="default"></sl-icon>
  <sl-icon name="fas-gear" slot="pressed"></sl-icon>
</sl-toggle-button>
```

## Accessibility

The toggle button sets `role="button"` and manages the `aria-pressed` attribute automatically, reflecting the current pressed state. Screen readers will announce whether the button is pressed or not.

Because the toggle button is icon-only, you must provide an accessible name. Use `aria-label` directly on the element. When an `aria-label` is set, a tooltip is automatically attached to also surface the label visually on hover.

::: info
You do not need to explicitly add a tooltip to the toggle button. When an `aria-label` is provided, the component will automatically use it as the tooltip text.
:::

### ARIA

| Attribute      | Description                                                                           |
| -------------- | ------------------------------------------------------------------------------------- |
| `aria-label`   | Required for icon-only toggle buttons; automatically used as the tooltip text.        |
| `aria-pressed` | Managed automatically; reflects whether the button is currently in the pressed state. |
