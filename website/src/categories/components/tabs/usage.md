---
title: Tabs usage
tags: usage
eleventyNavigation:
  parent: Tabs
  key: TabsUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-spinner role="alert" size="md"></sl-spinner>

</div>

<div class="ds-code">
  
  ```html
  <sl-spinner role="alert" size="xl"></sl-spinner>
  ```

</div>

</section>


<section>

## When to use
Tabs are suitable for organizing content into distinct categories or sections within a single view.

### Segmenting Content
Tabs are ideal for clustering content when they can be split into separate sections or categories. By grouping related information into different tabs, it reduces overload, and users can navigate through content more efficiently, thus helping to decrease cognitive load.

### Enhanced Workflow
Tabs facilitate seamless user task completion by organizing content like forms, settings, and dashboards within the same interface, eliminating the need for users to navigate away from their workflow.

</section>


<section>

## When not to use
While tabs can be a valuable clustering tool, they might not always be the best choice. Here are some scenarios where you need to find different alternatives.

### Simultaneously Content
Avoid using tabs if users need to compare information in two groups, as constant switching between tabs increases cognitive load and interaction cost. Don't use it when users don't need to view content from multiple tabs simultaneously.

### Hiding Information
Be cautious when hiding critical information behind tabs, leading users to overlook important details and ensuring that essential information is readily accessible without excessive tab navigation, enhancing user experience and usability. Additionally, nesting tabs within tabs can create usability issues and confuse users. Instead, consider alternative components like accordions.

</section>


<section>

## Anatomy
Tabs are a combination of a tab list and a tab panel. The tab list contains the navigation tabs. When there is overflow, it shows the "more button" to open the tabs popover. The tab panel presents content for selected tabs.

### Tabs
|Item|Name| Description | Optional|
|-|-|-|-|
|1|Icon | DESCRIPTION_TEXT |Yes|
|2|Title |DESCRIPTION_TEXT |Yes|
|3|Subtitle |DESCRIPTION_TEXT |Yes|
|4|Badge |DESCRIPTION_TEXT |Yes|
|5|Indicator |DESCRIPTION_TEXT |no|
|6|Tab |DESCRIPTION_TEXT |no|
|7|More Button |DESCRIPTION_TEXT |no|
{.ds-table .ds-table-align-top}

### Tabs Popover
When overflow occurs, we provide a "more button" to display the hidden tabs. We are using the popover; you can check more details here. 

</section>


<section>

## States and Status
Tabs come with multiple states, each suited for different interactions, and two status. The states provided are **default**, **hover**, **active**, **disabled** and **focus**, but we need to differentiate between those two alternative status:

  - **Unselected:** This tab appearance is the inactive version and provides a visually clear design. Making it easy for the user to scan the content and make a quick choice.

  - **Selected:** This tab appearance is the inactive version and provides a visually clear distinction to make it easier for the user to see where they are in the interface.

</section>


<section>

## Orientation
The orientation of tabs plays a significant role in determining the layout and functionality of the user. 

  - **Horizontal:** In this orientation, tabs are arranged side by side, at the top of the content area. It provides much more space optimization. They offer easy access to the content and are commonly used in desktop applications or website interfaces.

  - **Vertical:** This version displays the tabs in a column stack, usually along the left or right side of the panel. Vertical tabs are beneficial when the content height exceeds its width, providing efficient navigation for lengthy lists or categories.

</section>


<section>

## Options

With these options, you can tweak the appearance of the tabs in Figma. They are available in the Design Panel so you can compose the spinner to exactly fit the user experience need for the use case you are working on.

### Tab List
|Item|Options|Description|
|-|-|-|
|Subtitles|`'on', 'of'`|Toogle to display the subtitle in the tabs. |
|Alignement|`'Left', 'Filled'`|Define the behaviour of the tab related to the tab list. |
|More Button|`'on', 'of'`|Toogle to display the overflow button in the tabs list. |
{.ds-table .ds-table-align-top}

### Tabs
|Item|Options|Description|
|-|-|-|
|State|`'Default', 'Hover', 'Active', 'Disabled'`|Define the behaviour of the tab related to the tab list. |
|Badge|`'on', 'of'`|Toogle to display the badge in the tabs. |
|Icon|`'on', 'of'`|Toogle to display the icon in the tabs. |
|Icon Only|`'on', 'of'`|Toogle to switch only icon tabs. |
|Title|`'input'`|Text input to inser the title. |
|Subtitle|`'input'`|Text input to inser the subtitle. |
{.ds-table .ds-table-align-top}

</section>