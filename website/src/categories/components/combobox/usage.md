---
title: Combobox usage
tags: usage
eleventyNavigation:
  parent: Combobox
  key: ComboboxUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-form-field label="Subjects">
<sl-checkbox-group value='["0","2"]'>
  <sl-checkbox value="0">Mathematics</sl-checkbox>
  <sl-checkbox value="1">Geography</sl-checkbox>
  <sl-checkbox value="2">Physics</sl-checkbox>
  <sl-checkbox value="3" disabled>History</sl-checkbox>
</sl-checkbox-group>
</sl-form-field>

</div>

<div class="ds-code">

  ```html
  <sl-form-field label="Subjects">
    <sl-checkbox-group value='["0","2"]'>
      <sl-checkbox value="0">Mathematics</sl-checkbox>
      <sl-checkbox value="1">Geography</sl-checkbox>
      <sl-checkbox value="2">Physics</sl-checkbox>
      <sl-checkbox value="3" disabled>History</sl-checkbox>
    </sl-checkbox-group>
  </sl-form-field>
  ```

</div>

</section>


<section>

## When to Use
INTRODUCTION

### **Large Datasets**
Comboboxes are a better choice than checkbox or radio button groups when dealing with more than 15 options. Unlike static groups that can overwhelm users with lengthy lists, Comboboxes save space and simplify the interface by enabling search and filtering. This makes it easier and faster for users to find their desired option, especially in large datasets like cities, products, or categories, without scrolling through extensive lists.

### Multiple Choices
Our comboboxes come with multi-selection capabilities provide a clear overview of selected options by displaying them within a tag list. This is ideal when users need to choose multiple items, this ensures selections are visible and easy to manage, allowing users to remove or modify choices effortlessly while keeping the interface organized and intuitive.

</section>


<section>

## When Not to Use
INTRODUCTION

### **Fewer Options**
For list of options small than 15 choices, use checkboxes or radio buttons instead of a Combobox. These components present all options visible, making them quicker and more intuitive for users to scan and select without additional interactions.

</section>


<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Imput Field |Acts as the primary area for user interaction. Users can type to search, or view the selected options in this field. |no|
|2|Indicator |A visual indicator showing the current state of the dropdown (expanded or collapsed) and guiding users to interact with the Combobox.0 |no|
|2|Tag List |Displays the chosen options within the input field or as separate tags, ensuring clarity about the current selection. |Yes|
|3|Menu |Displays available options dynamically. These can be split in groups to make navigation through long lists easier, and the choices will be display at the top. |no|

{.ds-table .ds-table-align-top}

</section>


<section>

## Variants
Contextual Menu comes in two versions, each suited for specific situations:

### Single Selection
This variant allows users to choose one option from the list. It’s ideal for scenarios where only one value is required, such as selecting a country or choosing a payment method. Single selection Comboboxes simplify decision-making by focusing the user on one clear choice at a time.

### Multiple Selection
Enables users to select more than one option, typically representing choices as chips or stacked labels. This variant is useful in contexts like filters, tagging systems, or multi-category selection, where users need the flexibility to combine options without restriction.

</section>


<section>

## Options
FIGMA_OPTIONS_INTRODUCTION

### Combobox Input
|Item|Options|Description|
|-|-|-|
|Open|`'md', 'lg'` |Toogle to display the dropdown list. |
|Size|`'on', 'of'` |DESCRIPTION_TEXT |
|Show Placeholder|`'on', 'of'`| DESCRIPTION_TEXT |
|Show Tags|`'on', 'of'` |DESCRIPTION_TEXT |
|Input Value|'input' |DESCRIPTION_TEXT |
|Placeholder|'input' |DESCRIPTION_TEXT |
|Show Focus Ring|`'on', 'of'` |DESCRIPTION_TEXT |

{.ds-table .ds-table-align-top}

### Combobox Dropdown
|Item|Options|Description|
|-|-|-|
|Size|`'md', 'lg'` |DESCRIPTION_TEXT |
|Show Placeholder|'input' |DESCRIPTION_TEXT |
|Emphasis|`'subtle', 'bold'`|DESCRIPTION_TEXT |
|Items|'1 to 3' |DESCRIPTION_TEXT |

{.ds-table .ds-table-align-top}

</section>


<section>

## Behaviours  
Let's explore the behavior of the Combobox

### Grouping Choices
Provides organizational structure for selected items by categorizing them under specific groups or labels. This behavior is especially beneficial in complex datasets where selections belong to distinct categories.

### Stacked Selections
Displays multiple selected items as a visually stacked list at the top of the dropdow list or within tag list. This approach keeps the interface tidy and ensures users can quickly review or edit their choices without scrolling through a long dropdown.

### Dynamic Filtering
Filters the options list in real time based on user input, displaying only relevant matches. This functionality enhances usability, particularly for lists with many similar or closely related items.

### Dynamic Filtering
Filters the options list in real time based on user input, displaying only relevant matches. This functionality enhances usability, particularly for lists with many similar or closely related items.

### Autocomplete Suggestions
The Combobox provides real-time autocomplete suggestions as users type. This behavior helps narrow down options by displaying only relevant matches, making the selection process faster and more efficient, especially in large datasets. Users can select a suggestion or continue typing to refine their input further.

</section>


<section>

## Related components

- [Menu](/categories/components/menu/usage)

</section>
