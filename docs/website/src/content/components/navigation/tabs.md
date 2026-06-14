---
title: Tabs
layout: docs
eleventyNavigation:
  key: Tabs
  parent: Navigation
---

`<sl-tab-group>` organises related content into tabs, letting the user switch between views within
the same context. Each `<sl-tab>` is paired, in order, with an `<sl-tab-panel>` that holds its
content.

## Usage

```html
<sl-tab-group>
  <sl-tab selected>First tab</sl-tab>
  <sl-tab>Second tab</sl-tab>

  <sl-tab-panel>Contents of the first tab</sl-tab-panel>
  <sl-tab-panel>Contents of the second tab</sl-tab-panel>
</sl-tab-group>
```

Mark the initial tab with `selected`, and disable a tab with `disabled`.

## Examples

### Basic

```html {.example .show-source}
<sl-tab-group>
  <sl-tab selected>First tab</sl-tab>
  <sl-tab>Second tab</sl-tab>
  <sl-tab disabled>Disabled tab</sl-tab>

  <sl-tab-panel>Contents of the first tab</sl-tab-panel>
  <sl-tab-panel>Contents of the second tab</sl-tab-panel>
  <sl-tab-panel>Contents of the third tab</sl-tab-panel>
</sl-tab-group>
```

### Icons, subtitles and badges

A tab can include an icon (`icon` slot), a `subtitle` slot and a `badge` slot for richer labels.

```html {.example .show-source}
<sl-tab-group>
  <sl-tab selected>
    <sl-icon slot="icon" name="far-rocket"></sl-icon>
    Overview
    <span slot="subtitle">Project summary</span>
  </sl-tab>
  <sl-tab>
    <sl-icon slot="icon" name="far-list"></sl-icon>
    Tasks
    <span slot="subtitle">Things to do</span>
    <sl-badge color="red" emphasis="bold" slot="badge">8</sl-badge>
  </sl-tab>

  <sl-tab-panel>Overview content</sl-tab-panel>
  <sl-tab-panel>Tasks content</sl-tab-panel>
</sl-tab-group>
```

### Vertical

Add the `vertical` attribute to stack the tabs alongside the panels.

```html {.example .show-source}
<sl-tab-group vertical>
  <sl-tab selected>First tab</sl-tab>
  <sl-tab>Second tab</sl-tab>

  <sl-tab-panel>Contents of the first tab</sl-tab-panel>
  <sl-tab-panel>Contents of the second tab</sl-tab-panel>
</sl-tab-group>
```

### Activation

By default a tab is activated manually (focus a tab, then press Enter or Space). Set
`activation="auto"` to activate a tab as soon as it receives focus.

```html {.example .show-source}
<sl-tab-group activation="auto">
  <sl-tab selected>First tab</sl-tab>
  <sl-tab>Second tab</sl-tab>
  <sl-tab>Third tab</sl-tab>

  <sl-tab-panel>Contents of the first tab</sl-tab-panel>
  <sl-tab-panel>Contents of the second tab</sl-tab-panel>
  <sl-tab-panel>Contents of the third tab</sl-tab-panel>
</sl-tab-group>
```

## API

See the API reference for [`sl-tab-group`](/api-reference/sl-tab-group),
[`sl-tab`](/api-reference/sl-tab) and [`sl-tab-panel`](/api-reference/sl-tab-panel).
