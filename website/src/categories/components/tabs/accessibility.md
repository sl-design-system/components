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

|Key| Description |
|---|-------------|
|Tab|	Shifts focus to the first radio option in a tab list. Or when a tabs is focused the focus will go the the active tab in the page when the tab key is pressed|
|Space/Enter | Selects the currently focused tab or open the overflow menu|
|Arrow Keys	| Once you are "in" a tabs list you can navigate to the next tab by using the right or down arrow key. You can navigate back to the previous tab with left or up. The focus indicator loops, so when you are at the last tab and press "down" it will focus the first tab. |

{.ds-table .ds-table-align-top}

</section>


<section>

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for tabs provide essential information to assistive technologies and screen readers. They convey the tabs's role, state (checked, unchecked, valid and invalid), and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>
### Radio Group  
|Attribute | Value | Description | User supplied <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon> |
|-|-|-|-|
|`role`	|`'radiogroup'`|Makes it clear that our custom component is a radio group |no|
|`aria-labelledby`|string| When different element serves as the label this property can be set to the `id` of that element|yes|
|`aria-describedby`|string| When the radio group needs extra explanation or description you can reference this element here by the `id`. See [Note 1] below for more explanation| yes|
|`aria-disabled`| boolean| Announces the radio group as disabled with a screenreader. See [Note 2] below for more explanation| yes|

{.ds-table .ds-table-align-top}

</section>