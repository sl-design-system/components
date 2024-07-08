---
title: Contextual menu usage
tags: usage
eleventyNavigation:
  parent: Contextual menu
  key: ContextualMenuUsage
---

<section class="no-heading">

<div class="ds-example" style="gap: 4rem;">

<sl-menu-button position="bottom">
  <span slot="button">Actions</span>
  <sl-menu-item><sl-icon name="smile"></sl-icon>Profile</sl-menu-item>
  <sl-menu-item><sl-icon name="far-gear"></sl-icon>Settings</sl-menu-item>
  <sl-menu-item><sl-icon name="far-trash"></sl-icon>Remove</sl-menu-item>
</sl-menu-button>

<sl-menu-button position="bottom-end" aria-label="Show more options">
  <sl-icon name="ellipsis" slot="button"></sl-icon>
  <sl-menu-item>Update</sl-menu-item>
  <sl-menu-item>Remove</sl-menu-item>
</sl-menu-button>

</div>

<div class="ds-code">

  ```html
  <sl-menu-button>
    <span slot="button">Actions</span>
    <sl-menu-item>
      <sl-icon name="smile"></sl-icon>
      Profile
    </sl-menu-item>
    <sl-menu-item>
      <sl-icon name="far-gear"></sl-icon>
      Settings
    </sl-menu-item>
    <sl-menu-item>
      <sl-icon name="far-trash"></sl-icon>
      Remove
    </sl-menu-item>
  </sl-menu-button>
  
  <sl-menu-button aria-label="Show more options">
    <sl-icon name="ellipsis" slot="button"></sl-icon>
    <sl-menu-item>Update</sl-menu-item>
    <sl-menu-item>Remove</sl-menu-item>
  </sl-menu-button>
  ```

</div>

</section>

<section>

## When to Use
The following guidance describes when to use the Contextual Menu component.

### Contextual Actions
Some interface elements can have additional actions, and providing a contextual menu can enhance efficiency and streamline workflow. For instance, options to view details, open related documents, or access settings, offering extra details and actions specific to the element.

### Reducing Visual Clutter
Keeping a clean interface with repetitive elements (like cards or table rows), but additional actions are still necessary, a contextual menu fixes this scenario while providing access to secondary actions. For example, sorting a list of elements or changing the view of the page.

</section>


<section>

## When not to Use
The following guidance describes when not to use the Contextual Menu component.

### Primary Navigation
Contextual menus should not be used for primary navigation in applications because they are hidden until triggered by a specific action, making them less discoverable for users. Basic actions should always be visible and accessible to ensure users can efficiently navigate to essential features without additional steps. Relying on contextual menus for primary navigation can also create inconsistency in accessing core functions by requiring users to learn multiple ways to perform basic tasks.

</section>


<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Button |ELEMENT_DESCRIPTION |no|
|2|Menu Popover |ELEMENT_DESCRIPTION |no|
|3|Menu Option |ELEMENT_DESCRIPTION |no|
|4|Menu Divider |ELEMENT_DESCRIPTION |Yes|
|5|Group Heading |ELEMENT_DESCRIPTION ||

{.ds-table .ds-table-align-top}

</section>


<section>

## Variants
Contextual Menu comes in two versions, each suited for specific situations:

  - **Button Option:** It triggers an immediate action or opens a submenu with further options. This variant is typically used for actions that have a direct and immediate effect, such as "Save," "Delete," or "Submit".

  - **Single Select:** Allows users to choose only one option at a time. Clicking on an option deselects any previously selected items like a radio button. This variant is ideal for situations where users need to make mutually exclusive choices, such as change the sorting of a list or select the text editor in a text editor.

  - **Multi Select:** This enables users to select multiple options simultaneously. Each option behave like a checkbox to toggle on and off the option, this can be applied to hide or show items from a list to filtering.

</section>


<section>

## Options
FIGMA_OPTIONS_INTRODUCTION

|Item|Options|Description|
|-|-|-|
|Icon|`'on', 'of'`|Toogle to display the subtitle in the tabs. |

{.ds-table .ds-table-align-top}

</section>


<section>

## Behaviours

### Grouped Options
Splitting the related actions with a divider creates multiple categories, with the possibility of adding a heading to these ones. This helps users to quickly locate the available actions based on the relation of each action in the same group.

### Overflow Content
Using a sub-menus or nested options to organise related actions. This approach helps maintain clarity and reduces visual clutter by nesting similar or related actions under sub-menus. For example, within a "File" menu option, nested menus might include "Save As," "Print," and "Export," enhancing usability. However, this solution isn’t the magic one to create an infinite sub-menus to nested everything. Avoid adding more than 2 nested menus, so don’t exceed 3 levels.

### Shortcut Options
Keyboard shortcuts next to menu options, providing alternative access methods for frequently used actions. These are typically indicated by symbols, numbers, or combinations, allowing proficient users to perform actions quickly without relying solely on mouse interactions. For instance, the "Paste" option in a text editor or the shortcut "Ctrl + V" enables users to execute the action promptly using the keyboard.

</section>


<section>

## Related
Related components

- [Card](/categories/components/Card/usage)

</section>