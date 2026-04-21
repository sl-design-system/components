---
title: Toggle group
layout: component
issueNumber: 2315
storybook: actions-toggle-group--basic
eleventyNavigation:
  key: Toggle group
  parent: Actions
  order: 4
---

```html {.example .show-source}
<sl-toggle-group>
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>
```

## Usage

Use a toggle group to present a set of mutually exclusive or independently selectable options as a row of connected buttons. Common use cases include text alignment controls, view-mode selectors, and filter options.

By default, only one button in the group can be active at a time. The group automatically deactivates the other buttons when a new one is pressed. Use the `multiple` attribute when users should be able to select more than one option at the same time, such as text formatting controls (bold, italic, underline).

Avoid using toggle groups for unrelated actions. If the buttons perform actions that aren't directly related, consider using a button group or individual buttons instead.

Toggle groups are best suited for immediate, in-page state changes. If the selection needs to persist across sessions or navigation, use checkboxes, radio buttons, or a settings menu instead.

## Examples

### Fill

Use the `fill` attribute to control the visual style of all buttons in the group.

Outline
: A bordered style that draws attention without dominating the layout.

Solid
: A filled style that gives stronger visual weight to the selected state.

```html {.example .horizontal}
<sl-toggle-group fill="outline">
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>

<sl-toggle-group fill="solid">
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>
```

### Shape

Use the `shape` attribute to change the border radius of the group.

```html {.example .horizontal}
<sl-toggle-group>
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>

<sl-toggle-group shape="pill">
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>
```

### Size

Toggle groups are available in three sizes:

- `sm` — Small, for compact UIs
- `md` — Medium, the default
- `lg` — Large, for prominent controls

```html {.example .vertical}
<sl-toggle-group size="sm">
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>

<sl-toggle-group size="md">
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>

<sl-toggle-group size="lg">
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>
```

### Multiple selection

By default, only one button can be active at a time (single-select). Use the `multiple` attribute to allow multiple buttons to be active simultaneously. In this mode, the group does not manage button state — toggling is handled independently by each button.

```html {.example}
<sl-toggle-group multiple>
  <sl-toggle-button aria-label="Bold">
    <sl-icon name="far-bold" slot="default"></sl-icon>
    <sl-icon name="fas-bold" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Italic">
    <sl-icon name="far-italic" slot="default"></sl-icon>
    <sl-icon name="fas-italic" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Underline">
    <sl-icon name="far-underline" slot="default"></sl-icon>
    <sl-icon name="fas-underline" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>
```

### Text buttons

Toggle buttons inside a group can contain text instead of icons. This is useful for option selectors where the label needs to be explicit.

```html {.example}
<sl-toggle-group>
  <sl-toggle-button>Easy</sl-toggle-button>
  <sl-toggle-button>Medium</sl-toggle-button>
  <sl-toggle-button>Hard</sl-toggle-button>
</sl-toggle-group>
```

### Text with icons

Combine an icon and a text label within each button to provide both visual recognition and a clear textual description.

```html {.example}
<sl-toggle-group>
  <sl-toggle-button>
    <sl-icon name="face-smile" slot="default"></sl-icon>
    <sl-icon name="fas-face-smile" slot="pressed"></sl-icon>
    Easy
  </sl-toggle-button>
  <sl-toggle-button>
    <sl-icon name="star" slot="default"></sl-icon>
    <sl-icon name="fas-star" slot="pressed"></sl-icon>
    Medium
  </sl-toggle-button>
  <sl-toggle-button>
    <sl-icon name="far-medal" slot="default"></sl-icon>
    <sl-icon name="fas-medal" slot="pressed"></sl-icon>
    Hard
  </sl-toggle-button>
</sl-toggle-group>
```

### Disabled

Use the `disabled` attribute to disable the entire group and all of its buttons at once.

```html {.example}
<sl-toggle-group disabled>
  <sl-toggle-button aria-label="Align left">
    <sl-icon name="far-align-left" slot="default"></sl-icon>
    <sl-icon name="fas-align-left" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Justify">
    <sl-icon name="far-align-justify" slot="default"></sl-icon>
    <sl-icon name="fas-align-justify" slot="pressed"></sl-icon>
  </sl-toggle-button>
  <sl-toggle-button aria-label="Align right">
    <sl-icon name="far-align-right" slot="default"></sl-icon>
    <sl-icon name="fas-align-right" slot="pressed"></sl-icon>
  </sl-toggle-button>
</sl-toggle-group>
```

## Accessibility

The toggle group sets `role="region"` on its host element and manages keyboard navigation between buttons using a roving tab index. This means only one button in the group is in the tab sequence at a time, and users can move between buttons using the arrow keys.

When icon-only buttons are used, each `<sl-toggle-button>` must have an accessible name. Use `aria-label` directly on the button or associate it with a tooltip.

### ARIA

The following ARIA attributes can be used on `<sl-toggle-button>` elements inside the group:

| Attribute      | Description                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| `aria-label`   | Provides an accessible name for icon-only buttons where no visible text label is present.               |
| `aria-pressed` | Managed automatically by the component to reflect the button's pressed state to assistive technologies. |

### Keyboard interaction

| Key           | Behavior                                         |
| ------------- | ------------------------------------------------ |
| `Tab`         | Moves focus into and out of the toggle group.    |
| `Arrow Left`  | Moves focus to the previous button in the group. |
| `Arrow Right` | Moves focus to the next button in the group.     |
| `Space`       | Toggles the currently focused button.            |
