---
title: Tool bar usage
tags: usage
eleventyNavigation:
  parent: Tool bar
  key: ToolBarUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-tool-bar contained aria-label="Lesson builder">
    <sl-button fill="outline">
      <sl-icon name="far-copy"></sl-icon>
      Duplicate
    </sl-button>
    <sl-button fill="outline">
      <sl-icon name="far-arrow-down-wide-short"></sl-icon>
      Reorder
    </sl-button>
    <sl-tool-bar-divider></sl-tool-bar-divider>
    <sl-button fill="outline">
      <sl-icon name="far-arrow-up-from-bracket"></sl-icon>
      Export
    </sl-button>
    <sl-menu-button fill="outline">
      <div slot="button">More</div>
      <sl-menu-item>
        <sl-icon name="far-pen"></sl-icon>
        Rename lesson
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete lesson
      </sl-menu-item>
    </sl-menu-button>
  </sl-tool-bar>
</div>

<div class="ds-code">

  ```html
  <sl-tool-bar contained aria-label="Lesson builder">
    <sl-button fill="outline">
      <sl-icon name="far-copy"></sl-icon>
      Duplicate
    </sl-button>
    <sl-button fill="outline">
      <sl-icon name="far-arrow-down-wide-short"></sl-icon>
      Reorder
    </sl-button>
    <sl-tool-bar-divider></sl-tool-bar-divider>
    <sl-button fill="outline">
      <sl-icon name="far-arrow-up-from-bracket"></sl-icon>
      Export
    </sl-button>
    <sl-menu-button fill="outline">
      <div slot="button">More</div>
      <sl-menu-item>
        <sl-icon name="far-pen"></sl-icon>
        Rename lesson
      </sl-menu-item>
      <sl-menu-item>
        <sl-icon name="far-trash"></sl-icon>
        Delete lesson
      </sl-menu-item>
    </sl-menu-button>
  </sl-tool-bar>
  ```

</div>

</section>

<section>

## When to use

Use the tool bar to group related actions together in a horizontal bar. It is especially useful when you have many actions and limited space, because items that don't fit are automatically moved into an overflow menu.

Here are a few examples:
- **Student answer editor**: Group formatting actions like bold, italic, and underline so students can style their written answers.
- **Lesson builder**: Combine actions like duplicate, reorder, export, and delete for teachers managing lesson content.
- **Assignment management**: Provide quick access to actions like publish, download, and archive for managing assignments.
- **Content review**: Group tools for commenting, highlighting, and approving student submissions.

</section>

<section>

## When not to use

- **Simple form actions**: If you only need a few buttons like "Save" and "Cancel", use a Button bar instead. The tool bar is meant for larger sets of actions.
- **Navigation**: Don't use a tool bar for navigating between pages or sections. Use tabs or a navigation menu instead.
- **Single action**: If there's only one action, a standalone button is enough — no need for a tool bar.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name|Description|Optional|
|-|-|-|-|
|1|Tool bar container|The wrapper that holds all items and handles overflow|no|
|2|Button|An action button placed inside the tool bar|yes|
|3|Divider|A visual separator to group related items|yes|
|4|Overflow menu|A menu button that appears when items don't fit|yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Figma Options

With these options you can adjust the appearance of the tool bar in Figma.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Contained|`boolean`|Adds a border and padding around the tool bar|

{.ds-table .ds-table-align-top}

</div>

</section>
