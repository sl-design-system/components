---
title: Tool bar code
tags: code
APIdescription: {
  sl-tool-bar: "A responsive container that groups buttons and menus. It automatically moves items into an overflow menu when space is limited.",
  sl-tool-bar-divider: "A visual separator used to group related items within the tool bar."
}
eleventyNavigation:
  parent: Tool bar
  key: ToolBarCode
---

<section class="no-heading">
<style>
.ds-example sl-tool-bar {
  inline-size: 90%;
  padding: 0.25rem;
}
</style>
<div class="ds-example">
    <sl-tool-bar aria-label="Essay editor">
      <sl-button fill="outline">
        <sl-icon name="far-bold"></sl-icon>
        Bold
      </sl-button>
      <sl-button fill="outline">
        <sl-icon name="far-italic"></sl-icon>
        Italic
      </sl-button>
      <sl-button fill="outline">
        <sl-icon name="far-underline"></sl-icon>
        Underline
      </sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-button fill="outline" variant="danger">
        <sl-icon name="far-scissors"></sl-icon>
        Cut
      </sl-button>
      <sl-button fill="outline">
        <sl-icon name="far-copy"></sl-icon>
        Copy
      </sl-button>
      <sl-button fill="outline">
        <sl-icon name="far-paste"></sl-icon>
        Paste
      </sl-button>
      <sl-tool-bar-divider></sl-tool-bar-divider>
      <sl-menu-button fill="outline">
        <div slot="button">Insert</div>
        <sl-menu-item>
          <sl-icon name="far-font"></sl-icon>
          Special character
        </sl-menu-item>
        <sl-menu-item>
          <sl-icon name="far-arrow-turn-left-down"></sl-icon>
          Page break
        </sl-menu-item>
      </sl-menu-button>
    </sl-tool-bar>
</div>

<div class="ds-code">

  ```html
  <sl-tool-bar aria-label="Essay editor">
    <sl-button fill="outline">
      <sl-icon name="far-bold"></sl-icon>
      Bold
    </sl-button>
    <sl-button fill="outline">
      <sl-icon name="far-italic"></sl-icon>
      Italic
    </sl-button>
    <sl-button fill="outline">
      <sl-icon name="far-underline"></sl-icon>
      Underline
    </sl-button>
    <sl-tool-bar-divider></sl-tool-bar-divider>
    <sl-button fill="outline" variant="danger">
      <sl-icon name="far-scissors"></sl-icon>
      Cut
    </sl-button>
    <sl-button fill="outline">
      <sl-icon name="far-copy"></sl-icon>
      Copy
    </sl-button>
    <sl-button fill="outline">
      <sl-icon name="far-paste"></sl-icon>
      Paste
    </sl-button>
    <sl-tool-bar-divider></sl-tool-bar-divider>
    <sl-menu-button fill="outline">
      <div slot="button">Insert</div>
      <sl-menu-item>
        <sl-icon name="far-font"></sl-icon>
        Special character
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-arrow-turn-left-down"></sl-icon>
        Page break
      </sl-menu-item>
    </sl-menu-button>
  </sl-tool-bar>
  ```

</div>

</section>

<ds-install-info package="tool-bar" link-in-navigation></ds-install-info>

<section>

## Fill inheritance and variants

The tool bar's `fill` attribute is inherited by child buttons and menu buttons that don't have an explicit `fill` set. This allows you to style all buttons consistently without repeating the attribute on each child.

### How fill inheritance works

When you set `fill` on the tool bar, all buttons without an explicit `fill` will inherit that value:

<div class="ds-code">

```html
<!-- All buttons inherit fill="ghost" from the tool bar -->
<sl-tool-bar fill="ghost" aria-label="Actions">
  <sl-button>Action 1</sl-button>
  <sl-button>Action 2</sl-button>
  <!-- This button overrides the inherited fill -->
  <sl-button fill="outline">Action 3</sl-button>
</sl-tool-bar>
```

</div>

### Mixing button variants and fills

Buttons can independently apply variants (`primary`, `success`, `warning`, `danger`, etc.) regardless of the tool bar's `fill` setting. Variants control the button's color and semantic meaning, while `fill` controls the button's visual style:

<div class="ds-code">

```html
<sl-tool-bar fill="outline" aria-label="Editor">
  <sl-button variant="primary">Publish</sl-button>
  <sl-button variant="success">Approve</sl-button>
  <sl-button variant="warning">Review</sl-button>
  <sl-button variant="danger">Delete</sl-button>
</sl-tool-bar>
```

</div>

### Inverted mode

Use the `inverted` attribute on the tool bar when displaying it on dark backgrounds. Inverted mode automatically adjusts button colors for contrast on dark surfaces. Combine it with the `fill` attribute for different visual styles:

<div class="ds-code">

```html
<!-- Inverted tool bar on dark background -->
<div style="background: var(--sl-color-background-primary-bold); padding: 1rem;">
  <sl-tool-bar inverted fill="outline" aria-label="Editor">
    <!-- Buttons without an explicit variant inherit the tool bar's inverted mode, so variant="inverted" is applied automatically. -->
    <sl-button>Action 1</sl-button>
    <sl-button fill="solid">Publish</sl-button>
    <sl-button fill="ghost">Draft</sl-button>
  </sl-tool-bar>
</div>
```

</div>

Buttons can also use the `variant="inverted"` attribute independently for consistent styling on dark backgrounds.

</section>

{% include "../component-table.njk" %}
