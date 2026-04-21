---
title: Menu
layout: component
issueNumber: 2315
storybook: actions-menu-menu--basic
eleventyNavigation:
  key: Menu
  parent: Overlay
---

```html {.example}
<sl-menu>
  <sl-menu-item-group selects="single">
    <sl-menu-item selectable selected shortcut="$mod+Digit1">
      <sl-icon name="far-list"></sl-icon>
      List
    </sl-menu-item>
    <sl-menu-item selectable shortcut="$mod+Digit2">
      <sl-icon name="far-rectangles-mixed"></sl-icon>
      Cards
    </sl-menu-item>
    <sl-menu-item selectable shortcut="$mod+Digit3">
      <sl-icon name="far-table-cells"></sl-icon>
      Grid
    </sl-menu-item>
  </sl-menu-item-group>
  <hr />
  <sl-menu-item>
    <sl-icon name="far-arrow-up-short-wide"></sl-icon>
    Sort by
    <sl-menu selects="single" slot="submenu">
      <sl-menu-item selectable selected>First name (A-Z)</sl-menu-item>
      <sl-menu-item selectable>First name (Z-A)</sl-menu-item>
      <sl-menu-item selectable>Last name (A-Z)</sl-menu-item>
      <sl-menu-item selectable>Last name (Z-A)</sl-menu-item>
    </sl-menu>
  </sl-menu-item>
  <sl-menu-item>
    <sl-icon name="far-table-rows"></sl-icon>
    Group by
    <sl-menu selects="single" slot="submenu">
      <sl-menu-item selectable selected>Something</sl-menu-item>
      <sl-menu-item selectable>Other</sl-menu-item>
    </sl-menu>
  </sl-menu-item>
  <hr />
  <sl-menu-item disabled>
    <sl-icon name="far-pen"></sl-icon>
    Rename...
  </sl-menu-item>
  <sl-menu-item variant="danger">
    <sl-icon name="far-trash"></sl-icon>
    Delete...
  </sl-menu-item>
</sl-menu>
```

## Usage

A menu provides relevant actions based on the user's current selection, enhancing usability by offering quick access to necessary options and reducing cognitive load.

Use a menu to surface contextual actions tied to an element — for example, to view details, rename, or access settings — without cluttering the interface with repetitive controls.

::: info
Do not use a menu as the primary means of navigation. Hiding core features in a menu reduces discoverability and can confuse users who expect them to be visible and accessible at all times.
:::

Avoid nesting more than two levels of submenus; exceeding three levels in total overwhelms users and makes navigation difficult.

## Examples

### Icons

Add an `<sl-icon>` as the first child of a menu item to give it a leading icon.

```html {.example}
<sl-menu>
  <sl-menu-item>
    <sl-icon name="far-pen"></sl-icon>
    Rename...
  </sl-menu-item>
  <sl-menu-item>
    <sl-icon name="far-trash"></sl-icon>
    Delete...
  </sl-menu-item>
</sl-menu>
```

### Variants

Use the `variant` attribute on a menu item to signal the nature of an action. The `danger` variant is intended for irreversible or destructive actions.

```html {.example}
<sl-menu>
  <sl-menu-item>
    <sl-icon name="far-pen"></sl-icon>
    Rename...
  </sl-menu-item>
  <sl-menu-item variant="danger">
    <sl-icon name="far-trash"></sl-icon>
    Delete...
  </sl-menu-item>
</sl-menu>
```

### Dividers

Use an `<hr>` element between menu items to visually separate unrelated actions.

```html {.example}
<sl-menu>
  <sl-menu-item>Profile...</sl-menu-item>
  <sl-menu-item>Settings...</sl-menu-item>
  <hr />
  <sl-menu-item>Log out</sl-menu-item>
</sl-menu>
```

### Groups

Use `<sl-menu-item-group>` to group related items. Add a `heading` attribute or a `header` slot to label the group.

```html {.example}
<sl-menu>
  <sl-menu-item>
    <sl-icon name="far-code"></sl-icon>
    Components
  </sl-menu-item>
  <sl-menu-item>
    <sl-icon name="far-gear"></sl-icon>
    Settings
  </sl-menu-item>
  <sl-menu-item-group heading="Design System">
    <sl-menu-item>
      <sl-icon name="far-rocket"></sl-icon>
      What's new
    </sl-menu-item>
    <sl-menu-item>
      <sl-icon name="far-book"></sl-icon>
      Documentation
    </sl-menu-item>
  </sl-menu-item-group>
</sl-menu>
```

### Selectable

Add the `selectable` attribute to menu items to make them toggleable. Use the `selects` attribute on `<sl-menu>` or `<sl-menu-item-group>` to control whether `single` or `multiple` items can be selected at once. Use the `selected` attribute to set the initial selection.

```html {.example}
<sl-menu selects="single">
  <sl-menu-item selectable selected>
    <sl-icon name="far-list"></sl-icon>
    List
  </sl-menu-item>
  <sl-menu-item selectable>
    <sl-icon name="far-rectangles-mixed"></sl-icon>
    Cards
  </sl-menu-item>
  <sl-menu-item selectable>
    <sl-icon name="far-table-cells"></sl-icon>
    Grid
  </sl-menu-item>
</sl-menu>
```

### Shortcuts

Use the `shortcut` attribute on a menu item to display a keyboard shortcut. Use `$mod` as a cross-platform modifier that resolves to `Ctrl` on Windows/Linux and `⌘` on macOS. Combine modifiers with `+`, for example `Shift+$mod+KeyZ`.

```html {.example}
<sl-menu>
  <sl-menu-item shortcut="$mod+KeyZ">
    <sl-icon name="far-rotate-left"></sl-icon>
    Undo
  </sl-menu-item>
  <sl-menu-item shortcut="Shift+$mod+KeyZ">
    <sl-icon name="far-rotate-right"></sl-icon>
    Redo
  </sl-menu-item>
  <hr />
  <sl-menu-item shortcut="$mod+KeyX">
    <sl-icon name="far-scissors"></sl-icon>
    Cut
  </sl-menu-item>
  <sl-menu-item shortcut="$mod+KeyC">
    <sl-icon name="far-copy"></sl-icon>
    Copy
  </sl-menu-item>
  <sl-menu-item shortcut="$mod+KeyV">
    <sl-icon name="far-clipboard"></sl-icon>
    Paste
  </sl-menu-item>
  <hr />
  <sl-menu-item variant="danger">
    <sl-icon name="far-trash"></sl-icon>
    Delete
  </sl-menu-item>
</sl-menu>
```

### Submenu

Nest an `<sl-menu>` in the `submenu` slot of a menu item to create a submenu. Avoid more than two levels of nesting.

```html {.example}
<sl-menu>
  <sl-menu-item>
    <sl-icon name="far-arrow-up-short-wide"></sl-icon>
    Sort by
    <sl-menu selects="single" slot="submenu">
      <sl-menu-item selectable selected>First name (A-Z)</sl-menu-item>
      <sl-menu-item selectable>First name (Z-A)</sl-menu-item>
      <sl-menu-item selectable>Last name (A-Z)</sl-menu-item>
      <sl-menu-item selectable>Last name (Z-A)</sl-menu-item>
    </sl-menu>
  </sl-menu-item>
</sl-menu>
```

### Disabled

Use the `disabled` attribute to prevent interaction with individual menu items.

```html {.example}
<sl-menu>
  <sl-menu-item>Rename...</sl-menu-item>
  <sl-menu-item disabled>Delete...</sl-menu-item>
</sl-menu>
```

## Accessibility

### Keyboard interactions

| Key                     | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `Space` / `Enter`       | Activates the focused item. Also opens submenus.              |
| `ArrowUp` / `ArrowDown` | Moves focus between items; wraps at the boundaries.           |
| `ArrowRight`            | Opens a submenu; focus moves to its first item.               |
| `ArrowLeft` / `Escape`  | Closes the current submenu; focus returns to the parent item. |

### ARIA

| Attribute       | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| `aria-disabled` | Announces the item as disabled to screen readers.                       |
| `aria-label`    | Use when the menu item has no visible text label (icon-only scenarios). |
