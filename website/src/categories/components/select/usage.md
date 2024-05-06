---
title: Select usage
tags: usage
eleventyNavigation:
  parent: Select
  key: SelectUsage
---
<section class="no-heading">

<div class="ds-example">

  <sl-select value="2" style="inline-size: 20rem;" aria-label="Subjects list">
      <sl-select-option value="1">Biology</sl-select-option>
      <sl-select-option value="2">Mathematics</sl-select-option>
      <sl-select-option value="3">English</sl-select-option>
      <sl-select-option value="4">Music</sl-select-option>
      <sl-select-option value="5">Geography</sl-select-option>
      <sl-select-option value="6">History</sl-select-option>
      <sl-select-option value="7">Physics</sl-select-option>
      <sl-select-option value="8">Chemistry</sl-select-option>
  </sl-select>

</div>

<div class="ds-code">

  ```html
    <sl-select value="2" style="inline-size: 20rem;">
      <sl-select-option value="1">Biology</sl-select-option>
      <sl-select-option value="2">Mathematics</sl-select-option>
      <sl-select-option value="3">English</sl-select-option>
      ...
    </sl-select>
  ```

</div>
</section>

<section>

## When to use

### Dropdown menus for choices
Use the select component when you need users to select from a predefined list of more than five options. Whether it’s choosing a country, a language, or a course, a select dropdown keeps things organized and user-friendly.

### Filtering and sorting options
When designing search interfaces or data tables, consider using select components for filtering or sorting. These components allow users to narrow down search results based on specific criteria. For instance, teachers can filter pupils by grade level or sort the results by relevance or class. 

</section>

<section>

## When not to use

### Fewer total options
If you’re dealing with less than 5 options, use [radio buttons](/categories/components/radio-group/) instead of a select component. Radio buttons are more straightforward for a limited set of options.

### As a menu
Avoid using the select component as a menu. Its primary purpose is to display a list of options. If you need to present a list of actions, consider using a [menu](/categories/components/menu/) component specifically designed for that purpose.
</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Label	|Describes the input category|yes|
|2|Select field	|Contains optional placeholder text, which is replaced by the selection|no|
|3|Hint	|Informative message|yes|
|4|Dropdown panel	|Shows a list of options|no|

{.ds-table}

</div>

</section>

<section>

## Options

With these options, you can tweak the appearance of the select in Figma. They are available in the Design Panel so you can compose the select to exactly fit the user experience need for the use case you are working on.

### Label

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Label|`boolean`| To display a label.|
|Size|`sm` `md` `lg`| The label come in three sizes small, medium (default) and large.|
|Disabled|`boolean`| To show the disabled state of the label.|
|Required|`boolean`| Indicates if it is requiered to select an option.|
|Optional|`boolean`| Indicates if it is optional to select an  option.|
|Info|`boolean`| To show a info icon with tooltip after the label.|
|Text|`value`| To insert the text of the label.|

{.ds-table}

</div>

### Select box
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Size|`md` `lg`| The select box come in two sizes; medium (default) and large|
|Variant|`default` `valid` `invalid`|Indicates the variant of the select box|
|State|`idle` `hover` `active` `disabled`|Indicates the state of the select box|
|Filled|`empty` `filled` `placeholder`|To indicate the select is filled or shows a placeholder text|
|Default value|`value`|To insert the default text of the placeholder|

{.ds-table}

</div>

### Dropdown panel
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Menu open|`boolean`|Displays the dropdown panel|
|Position|`top` `bottom`|Indicates the position of the dropdown panel|
|Size|`md` `lg`|Description|
|Pre selected item|`default` `01` `02` `03` `04` `05` `06` `07` `08` `09` `10` `11` `12` `13` `14` `15`|Indicates the pre selected item from the list|

{.ds-table}

</div>

### Hint

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Hint|`boolean`| To display the hint.|
|Size|`sm` `md` `lg`| The hint come in three sizes small, medium (default) and large.|
|State|`default` `disabled` `invalid`| To indicate the state of the hint.|
|Icon|`boolean`| Displays an icon in front of the hint.|
|Text|`value`| To insert the text of the hint.|

{.ds-table .ds-table-align-top}

</div>

### Focus ring

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Focus ring|`boolean`| To display the focus state of the select.|

{.ds-table}

</div>

</section>