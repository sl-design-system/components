---
title: Tool bar code
tags: code
APIdescription: {
  sl-tool-bar: "A responsive container that groups buttons and menus. It automatically moves items into an overflow menu when space is limited.",
  sl-tool-bar-divider: "A visual separator used to group related items within the tool bar.",
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
      <sl-button fill="outline">
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
    <sl-button fill="outline">
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
{% include "../component-table.njk" %}
