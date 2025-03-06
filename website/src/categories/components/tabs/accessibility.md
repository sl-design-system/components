---
title: Tabs accessibility
tags: accessibility
eleventyNavigation:
  parent: Tabs
  key: TabsAccessibility
---
<section>

## Content
Creating an inclusive application requires more than just writing great code. It also involves writing clear and concise copy. Keep the users while writing the tab's titles and subtitles.

### Short Tab Labels
Use plain language and keep labels short, usually 1-2 words. Longer labels may indicate that choices are too complex for a tab control. Simplify options to make them user-friendly.

### No All Uppercase
Avoid using all caps for tab labels. It's harder to read. Use consistent capitalization style, either sentence-case or title-style.

</section>


<section>

## Keyboard interactions

Keyboard interactions within a tabs group allow users to navigate options using arrow keys or the Tab key, facilitating efficient selection and ensuring accessibility for those who rely on keyboard navigation.
Typically, users can navigate to the tabs using the "Tab" key, once they're in the first tab they can focus the different options with Arrow keys. Then they can select a new tab with the "Spacebar" or "Enter" key. Keyboard interaction ensures that individuals who rely on keyboard navigation or assistive technologies can easily control tabs within a user interface.

|Key| Description                                                                                                                                                                                                                                                              |
|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Tab| 	Shifts focus to the first tab control in a tab list. Or when a tabs is focuse the focus will go the the active tab in the page when the tab key is pressed                                                                                                              |
|Space/Enter | Activates the currently focused tab or open the overflow menu                                                                                                                                                                                                            |
|Arrow Keys	| Once you are "in" a tabs list you can navigate to the next tab by using the right or down arrow key. You can navigate back to the previous tab with left or up. The focus indicator loops, so when you are at the last tab and press "down" it will focus the first tab. |

{.ds-table .ds-table-align-top}

</section>


<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

### Tab Group

<div class="ds-table-wrapper">

|Attribute | Value | Description |
|-|-|-|
|`aria-labelledby`|string| The purpose of tabs - can be set to the `id` of labelling element.|yes|

{.ds-table .ds-table-align-top}

</div>

</section>
