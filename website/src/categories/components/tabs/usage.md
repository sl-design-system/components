---
title: Tabs usage
tags: usage
eleventyNavigation:
  parent: Tabs
  key: TabsUsage
---
<section>
<div class="ds-example">
<sl-tab-group style="background: var(--sl-color-tab-default-background); inline-size: 500px">
 <sl-tab selected>Personal information</sl-tab>
 <sl-tab>Education</sl-tab>
 <sl-tab disabled>Projects</sl-tab>
 <sl-tab-panel>
   <div>
   <h2>Personal information</h2>
   <sl-avatar display-name="Tim Jenssen" picture-url="/assets/images/components/avatar/xia-yang-AGGA9LH3FLo-unsplash.jpg" size="xl"></sl-avatar>
   </div>
 </sl-tab-panel>
 <sl-tab-panel>
   <div>
   <h2>Education history of Tim Jenssen</h2>
   2020 - 2023 Da Vinci International School
   </div>
 </sl-tab-panel>
 <sl-tab-panel>
   List of projects
 </sl-tab-panel>
</sl-tab-group>

  <small style="position: absolute; bottom:0; right:var(--scale-150-scale)">

Photo by [Xia Yang](https://unsplash.com/@imrxia?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

  </small>
</div>

<div class="ds-code">

  ```html
<sl-tab-group style="background: var(--sl-color-tab-default-background); inline-size: 500px">
    <sl-tab selected>Personal information</sl-tab>
    <sl-tab>Education</sl-tab>
    <sl-tab disabled>Projects</sl-tab>
    <sl-tab-panel>
      Personal information...
    </sl-tab-panel>
    <sl-tab-panel>
      Education history of...
    </sl-tab-panel>
    <sl-tab-panel>
      ...
    </sl-tab-panel>
</sl-tab-group>
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

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Icon | The icon improves the visibility. |Yes|
|2|Title |The tab's label needs to be clear and direct to make it easier for the user to scan through the content. |Yes|
|3|Subtitle |A description text clarifies the content the user will find in the tab panel. |Yes|
|4|Badge |Give the user some quotes about whether there is new content or the need to review the panel content. |Yes|
|5|Indicator |Visual distinction of the tab to make it easy to see between an active and inactive tab. |no|
|6|Tab |Interactive button to display the tab panel related to the tab. |no|
|7|More Button |Button to show the tabs menu when there is a hidden tab. |no|

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

## Figma Options
With these options, you can tweak the appearance of the tabs in Figma. They are available in the Design Panel so you can compose the tabs to exactly fit the user experience need for the use case you are working on.

### Tab List
The tab list provides the options to set up the version of the component that you need.

|Item|Options|Description|
|-|-|-|
|Subtitles|`boolean`|Toogle to display the subtitle in the tabs. |
|Alignement|`left` `filled`|Define the behaviour of the tab related to the tab list. |
|More Button|`boolean`|Toogle to display the overflow button in the tabs list. |

{.ds-table .ds-table-align-top}

### Tabs
This are the tab buttons to switch between content. 

|Item|Options|Description|
|-|-|-|
|State|`default` `hover` `Active` `Disabled`|Define the behaviour of the tab related to the tab list. |
|Badge|`boolean`|Toggle to display the badge in the tabs. |
|Icon|`boolean`|Toggle to display the icon in the tabs. |
|Icon Only|`boolean`|Toggle to switch only icon tabs. |
|Title|`value`|Text input to insert the title. |
|Subtitle|`value`|Text input to insert the subtitle. |

{.ds-table .ds-table-align-top}

</section>


<section>

## Behavior
Understanding the behavior of tabs is crucial for creating intuitive and user-friendly content access. Tabs exhibit various characteristics and functionalities that impact how users interact with them.

### No Label Wrap
When the labels may exceed the available space, especially in lengthy titles. We don't wrap the labels, preventing truncation to ensure users can still identify and access tabs without sacrificing usability. To solve the hide tabs, we provide an overflow tabs button.

### Focusable Area
Tabs should provide a focusable area to accommodate keyboard navigation. The focusable area allows users to navigate between tabs, enhancing usability and accessibility for all users.

### Overflow Tabs
In cases where the number of tabs exceeds the available space, overflow buttons offer a solution for managing tab visibility. The overflow tabs menu provides a solution for accessing hidden tabs. The tabs list is also scrollable, allowing users to move horizontally to view additional tabs. 

</section>
