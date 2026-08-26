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
    <sl-button fill="solid" variant="primary">
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
    <sl-button fill="solid" variant="primary">
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

### Contextual Actions

Use to place actions close to the content or region they affect (for example, controls for a list, table, editor, or card). It works best for a consistent action set for that view (for example, filter, sort, export, edit, insert actions). Use dividers to separate groups (for example, “view”, “manage”, “format”) so users can scan quickly.

### Bulk Actions

Use to expose actions that apply to multiple items at once (for example, “Move”, “Delete”, “Assign”, “Export”) when the user selects one or more items in a list or table. Keep the most important bulk actions visible and move the rest into overflow.

### Action density

Use when the same set of actions must remain available across different widths. Overflow keeps the layout stable while ensuring secondary actions stay accessible.

</section>


<section>

## When not to use

### Too Many Actions

If you have a long list of actions, or actions that are infrequent and not tied to the current view/content, avoid a toolbar. Move actions into a more suitable pattern (context menus, inline actions, progressive disclosure) or place them in a more global location (page header, navigation, or settings) so the toolbar stays scannable and purposeful.

### Navigation or Simple Actions

Don’t use the toolbar for navigation between pages/sections or as the primary control in multi-step flows. If you only need a small set of primary actions (especially in step-by-step layouts), consider using a [Button Bar](/categories/components/button-bar/) instead.

</section>


<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name|Description|Optional|
|-|-|-|-|
|1| Container | Wraps all actions and defines layout, spacing, and optional surface (contained). |no|
|2| Item | A single action element placed in the toolbar (button, menu button, or buttons group). |no|
|3| Divider | A visual separator between groups; also becomes a separator inside overflow. |yes|
|4| Overflow trigger | A “more actions” control that appears when items don’t fit. |no|
|5| Overflow menu | The menu that contains hidden actions (keeps order and group separation). |no|

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Variants

These options change the toolbar’s appearance so it stays clear and readable across different surfaces and action styles.

- **Fill:** Controls the look of the actions inside the toolbar. Use **Outline** when actions need stronger emphasis and clearer boundaries, or use **Ghost** when actions should feel lighter and blend into the interface.
- **Inverted:** Switches the toolbar styling for dark or inverted surfaces. Use it to maintain contrast and readability when the toolbar sits on a darker background.
- **Contained:** Adds a surface around the toolbar (background and padding). Use it to visually separate the toolbar from surrounding content or to make it feel like a distinct control area.

</section>


<section>

## States
These states describe what users see when the toolbar is available, constrained, or unavailable.

- **Default:** Actions are available and visible until overflow is needed.
- **Overflow:** Some actions move into the overflow menu when space is limited.
- **Disabled:** The toolbar and its actions are not interactive.

</section>


<section>

## Figma Properties

With these options you can adjust the appearance of the toolbar in Figma.


### Toolbar
Properties for the main toolbar component used by designers. Some options (like Overflow, Item 3–5, and Divider 1–5) are for previewing compositions and states in Figma.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Fill | `Ghost` `Outline` | Sets the visual style applied to actions inside the toolbar. |
| Inverted | `boolean` | Switches the toolbar to an inverted appearance for dark surfaces. |
| Contained | `boolean` | Adds a surface treatment (background and padding) around the toolbar. |
| Overflow | `boolean` | Preview-only toggle to show the overflow state in Figma. |
| Item 3–5 | `boolean` | Preview-only toggles to add/remove extra items in the Figma example. |
| Divider 1–5 | `boolean` | Preview-only toggles to add/remove dividers between groups in the Figma example. |

{.ds-table .ds-table-align-top}

</div>

### Toolbar item
Properties for the nested toolbar item used inside the toolbar to swap between the supported control types.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Item | `Button` `Menu` `Button Group` | Swaps the supported action type used for a single toolbar item. |
| Fill | `Outline` `Ghost` | Matches the item’s style to the toolbar style where needed. |
| Inverted | `boolean` | Matches the item’s appearance to inverted surfaces where needed. |

{.ds-table .ds-table-align-top}

</div>


### Toolbar Group
Properties for the nested toolbar group used inside a toolbar item to build grouped actions and preview the group overflow behaviour.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Overflow | `boolean` | Switches a button group between expanded buttons and a collapsed menu-style version. |
| Inverted | `boolean` | Matches the group appearance to inverted surfaces where needed. |
| Button 3–5 | `boolean` | Preview-only toggles to control how many grouped actions are shown in the example. |

{.ds-table .ds-table-align-top}

</div>


</section>


<section>

## Behaviours

### Group related controls

Controls are organised into logical groups to improve scannability and usability. When space is limited, groups help determine how items collapse into the overflow menu. Dividers should only be used to separate meaningful groups. Avoid using dividers between every item.

### Handles overflow

When space is limited, especially on smaller screens, actions move into the overflow menu, while the remaining actions will stay visible. In the overflow dropdown, groups are separated with dividers to preserve structure and clarity.


### Consistent styling and clear icon actions

The toolbar applies a consistent visual style across its items (for example, matching fill and inverted appearance) so actions look like part of the same system. If you use icon-only actions, ensure they remain understandable through labels and/or tooltips, and avoid placing many icon-only actions without strong familiarity or supporting text.


</section>


<section>

## Related components

- [Button](/categories/components/button/)
- [Menu](/categories/components/menu/)
- [Menu Button](/categories/components/menu-button/)
- [Tooltip](/categories/components/tooltip/)

</section>
