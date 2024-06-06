---
title: Search field usage
tags: usage
eleventyNavigation:
  parent: Search field
  key: SearchFieldUsage
---

<section class="no-heading">

<div class="ds-example">
  TODO
</div>

<div class="ds-code">

  ```html
    TODO
  ```

</div>

</section>



<section>

## When to Use

### Fast Findings
Making it easier for the user to find specific items within large data volumes. Users expect this feature for streamlined access, especially in interfaces with dynamic content. Improving task efficiency and usability ensures users access relevant information seamlessly, for example, by filtering a list of dynamic content like cards.

### Section Page Search
Use a search field within a specific page section when users need to search data, such as in a data table. This implementation ensures that users can efficiently locate and filter data within that section, maintaining consistency and usability across the product. It enhances the user experience by providing targeted, relevant search results without the need to navigate away from the current context.

</section>


<section>

## When not to Use
SECTION_INTRODUCTION

### Small Data
Avoid using a search field within a page section when dealing with small or limited data. Additionally, refrain from implementing it when the information is simple and easily accessible within a single view. In such cases, a search field may be unnecessary and could complicate the user experience rather than enhance it. Use it for scenarios where it adds value and helps maintain a clean and efficient interface.

### WHEN_NOT_POINT_TITLE
WHEN_POINT_NOT_DESCRIPTION_TEXT

</section>


<section>

## Anatomy
Search field are a combination of a tab list and a tab panel. The tab list contains the navigation tabs. When there is overflow, it shows the "more button" to open the tabs popover. The tab panel presents content for selected tabs.

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Icon | The icon improves the visibility. |Yes|
|2|Placeholder | The plaholder provide an clue to user. |Yes|
|1|Input | When the user enter their inputs. |Yes|
|1|Clear Button | This button clear the user's input. It only appears when there is an input. |Yes|
|1|Search Button | Search action button. |No|

{.ds-table .ds-table-align-top}

</section>


<section>

## States and Status
Search field share the same behaivour as an Input field. That provide it with the same states, each suited for different interactions. The states provided are **default**, **hover**, **active**, **disabled** and **focus**.

</section>


<section>

## Options
With these options, you can tweak the appearance of the Search field in Figma. They are available in the Design Panel so you can compose the spinner to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Size|`'md', 'lg'`|This are the sizes of the Search field. The `md`is the default size.  |
|State|`'Default', 'Hover', 'Active', 'Disabled'`|The states of the Search field. |
|Placeholder|`'On', 'Off'`|Toogle to switch between the placeholder and the input value. |
|Label|`'On', 'Off'`|Toogle to display the Field Label. |

{.ds-table .ds-table-align-top}


</section>


<section>

## Behavior
Understanding the behavior of Search field is crucial for creating intuitive and user-friendly content access. Search field exhibit the same behaviors of the Text field, and one more.

### Restart Search
When the users introduce their search value, a restart button will clear the search field values to make it easier for all users to start a new search.

</section>
