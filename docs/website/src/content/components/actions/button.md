---
title: Button
layout: component
eleventyNavigation:
  key: Button
  parent: Actions
  order: 1
---

```html {.example .show-source}
<sl-button>Button</sl-button>
```

## Usage

Buttons should be used in user interfaces when you want to provide users with a clear and actionable way to interact with a webpage, application, or device.

Buttons are used to trigger specific actions or functions. For example, you can use a "Submit" button in a form to send user input to a server, or a "Save" button to save changes in an application.

::: info
Do not disable a button by default and leave it up to the user to figure out why the action is unavailable. Instead, provide an explanation using a tooltip or by including helper text next to the button.
:::

## Examples

### Variants

Use the `variant` attribute to indicate the urgency or sentiment of the action.

Primary
: The most important action on the page; the next step in the main user flow.

Secondary
: Secondary flows, or when there is no clear hierarchy (e.g. dashboards).

Success
: Confirming a successful or completed operation.

Warning
: Actions requiring caution or extra user confirmation.

Danger
: Irreversible or potentially destructive actions.

```html {.example}
<sl-button-bar>
  <sl-button variant="primary">Primary</sl-button>
  <sl-button variant="secondary">Secondary</sl-button>
  <sl-button variant="success">Success</sl-button>
  <sl-button variant="info">Info</sl-button>
  <sl-button variant="warning">Warning</sl-button>
  <sl-button variant="danger">Danger</sl-button>
</sl-button-bar>
```

There is an additional `inverted` variant that is designed for use on dark backgrounds.

```html {.example .inverted}
<sl-button variant="inverted">Inverted</sl-button>
```

### Fill

Use the `fill` attribute to indicate how essential the action is.

Solid
: Essential actions that move the user forward in the flow.

Outline
: Important but optional; draws attention without blocking progress.

Ghost
: Suggestive or secondary actions that shouldn't distract from the main flow.

Link
: Informational actions, such as "Read more" or "View details".

```html {.example}
<sl-button-bar>
  <sl-button>Solid</sl-button>
  <sl-button fill="outline">Outline</sl-button>
  <sl-button fill="link">Link</sl-button>
  <sl-button fill="ghost">Ghost</sl-button>
</sl-button-bar>
```

### Shape

Use the `shape` attribute to change the button's shape.

```html {.example}
<sl-button-bar>
  <sl-button>Square</sl-button>
  <sl-button shape="pill">Pill</sl-button>
</sl-button-bar>
```

### Size

Buttons are available in three sizes:

- `sm` — Small, for compact UIs
- `md` — Medium, the default
- `lg` — Large, for prominent actions

```html {.example}
<sl-button-bar>
  <sl-button size="sm">Small</sl-button>
  <sl-button size="md">Medium</sl-button>
  <sl-button size="lg">Large</sl-button>
</sl-button-bar>
```

### Disabled

You can either use the `disabled` attribute to disable a button or set the `aria-disabled="true"` attribute for accessibility. Both will not trigger any events. The former will prevent the button from being focusable, while the latter will keep the button focusable but will indicate to assistive technologies that the action is unavailable.

```html {.example}
<sl-button-bar>
  <sl-button disabled>Disabled</sl-button>
  <sl-button aria-disabled="true">Aria Disabled</sl-button>
</sl-button-bar>
```

### Icon buttons

Icon buttons are used for actions that can be represented by an icon, such as "close" or "edit". Always provide a text label for accessibility, either through an `<sl-tooltip>` or using `aria-label`.

```html {.example}
<sl-button-bar>
  <sl-button aria-labelledby="icon-button-tooltip">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-button aria-labelledby="icon-button-tooltip" fill="outline">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-button aria-labelledby="icon-button-tooltip" fill="ghost">
    <sl-icon name="face-smile"></sl-icon>
  </sl-button>
  <sl-tooltip id="icon-button-tooltip">Smile!</sl-tooltip>
</sl-button-bar>
```

### Link buttons

Sometimes you want a link to look like a button. In that case, you can use the `fill="link"` attribute and wrap the button's content in an `<a href>` element.

```html {.example}
<sl-button-bar>
  <sl-button fill="link">
    <a href="https://example.com">Link</a>
  </sl-button>
  <sl-button fill="link">
    <a href="https://example.com" target="_blank">New window</a>
  </sl-button>
</sl-button-bar>
```

## Accessibility

The button component renders a native `<button>` element in its shadow DOM, ensuring proper keyboard navigation and screen reader support.

When the button only has an icon and no visible text, make sure to provide an accessible name using `aria-label` or by associating it with a tooltip:

```html
<sl-button aria-describedby="tooltip">
  <sl-icon name="face-smile"></sl-icon>
</sl-button>
<sl-tooltip id="tooltip">Smile!</sl-tooltip>
```
