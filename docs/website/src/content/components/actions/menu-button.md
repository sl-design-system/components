---
title: Menu button
layout: component
issueNumber: 2315
storybook: actions-menu-menu-button--basic
eleventyNavigation:
  key: Menu button
  parent: Actions
---

```html {.example .show-source}
<sl-menu-button aria-labelledby="tooltip-actions">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>
    <sl-icon name="far-pen"></sl-icon>
    Rename...
  </sl-menu-item>
  <sl-menu-item>
    <sl-icon name="far-trash"></sl-icon>
    Delete...
  </sl-menu-item>
</sl-menu-button>
<sl-tooltip id="tooltip-actions">Contextual actions</sl-tooltip>
```

## Usage

The menu button is a trigger that opens a contextual [Menu](/categories/components/overlay/menu/). It wraps a button and manages the popover lifecycle, so no JavaScript is needed to open or close the menu.

Use a menu button instead of a [button bar](/categories/components/actions/button-bar/) or toolbar when:

- **Space is limited**: A menu button collapses multiple actions behind a single trigger, keeping the interface uncluttered.
- **Actions are secondary or infrequent**: Actions that are rarely needed do not warrant a permanent spot in the UI.
- **Actions are contextual**: The available actions change based on the selected item or current state, making a fixed set of visible buttons impractical.

Prefer a button bar or toolbar when actions are primary, frequently used, or benefit from being immediately visible and comparable to one another.

## Examples

### Button content

Place content in the `button` slot to control what is shown inside the trigger. Use an icon-only button for compact UIs, an icon and text for additional clarity, or text only when no icon is available.

```html {.example .horizontal}
<sl-menu-button aria-labelledby="tooltip-settings">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
<sl-tooltip id="tooltip-settings">Settings</sl-tooltip>
<sl-menu-button>
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <span slot="button">Settings</span>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
<sl-menu-button>
  <span slot="button">Settings</span>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
```

Don't forget to provide an accessible name for icon-only buttons using `aria-label` or `aria-labelledby` (e.g. referencing a tooltip) so screen readers can announce the purpose of the button.

### Fill

Use the `fill` attribute to control the visual weight of the trigger button.

```html {.example .horizontal}
<sl-menu-button aria-label="Settings">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
<sl-menu-button aria-label="Settings" fill="ghost">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
```

### Size

Menu buttons are available in two sizes:

- `md` — Medium, the default
- `lg` — Large, for more prominent placement

```html {.example .horizontal}
<sl-menu-button aria-label="Settings">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
<sl-menu-button aria-label="Settings" size="lg">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
```

### Disabled

Use the `disabled` attribute to prevent interaction. `aria-disabled="true"` is an alternative that keeps the button focusable — useful when combined with a tooltip to explain why the action is unavailable.

```html {.example .horizontal}
<sl-menu-button aria-label="Settings" disabled>
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
<sl-menu-button aria-labelledby="tooltip-disabled" aria-disabled="true">
  <sl-icon name="far-gear" slot="button"></sl-icon>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item>Delete...</sl-menu-item>
</sl-menu-button>
<sl-tooltip id="tooltip-disabled">Settings are unavailable while offline</sl-tooltip>
```

## Accessibility

The menu button manages `aria-haspopup` and `aria-expanded` automatically, so screen readers announce the control as a menu button and reflect its open/closed state.

When the button only contains an icon and no visible text, always provide an accessible name using `aria-label` or by referencing a tooltip with `aria-labelledby`.

### ARIA

| Attribute          | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `aria-describedby` | Use to reference additional context or description for the button.                                                        |
| `aria-disabled`    | Announces the button as disabled to screen readers while keeping it focusable. See [Disabled](#disabled) for more detail. |
| `aria-label`       | Use when the button is icon-only and its purpose is clear from context.                                                   |
| `aria-labelledby`  | Use when another element (e.g. a tooltip) serves as the label.                                                            |
