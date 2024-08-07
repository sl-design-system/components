---
title: Tag usage
tags: usage
eleventyNavigation:
  parent: Tag
  key: TagUsage
---
<section class="no-heading">

<div class="ds-example">
<sl-tag label="Mathematics"></sl-tag>
<sl-tag label="History" removable></sl-tag>
<sl-tag label="Science" removable disabled></sl-tag>
</div>

<div class="ds-code">

  ```html
<sl-tag label="Mathematics"></sl-tag>
<sl-tag label="History" removable></sl-tag>
<sl-tag label="Science" removable disabled></sl-tag>
  ```

</div>
</section>

<section>

## When to use

### Categorization, Labeling, and Filtering
Use tags to categorize and label course content, enhancing organization, discoverability, and enabling efficient filtering of content on a page, within components, or through search functionalities. For instance, courses or lessons can be tagged with subjects such as "Mathematics," "Science," "History," or "Literature." This approach makes it easier for users to quickly find and access relevant materials.


### User-Generated Tags
Enable users to create and manage their own custom labels, allowing for a personalized organization system. In a student dashboard, for example, users might tag their notes or assignments with custom labels like "Exam Prep," "Homework," "Group Project," or "To Review," facilitating better organization.


</section>

<section>

## When not to use

### Status Indicators
For tracking the status of tasks or items, such as "In Progress," "Completed," or "Pending," use a [badge](/categories/components/badge/usage) instead. Badges are specifically designed to convey status and can provide visual cues through colors, making them more effective for this purpose.


</section>

<section>

## Anatomy tag

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container |The container contains the label and close button |no|
|2|Label |The label is a brief text that decribed the tag |no|
|3|Close button |To remove the tag |yes|

{.ds-table .ds-table-align-top}

</div>

## Anatomy tag list

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Counter |Displays the count of selected tags when not all tags are visible, with a maximum display of 99. If more than 99 tags are selected, it will be shown as "99+." |yes|
|2|List of tags | Consists of a collection of tags |no|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Figma Options

With these options, you can tweak the appearance of the tag in Figma. They are available in the Design Panel so you can compose the tag to exactly fit the user experience need for the use case you are working on.

### Tag 

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Emphasis|`subtle` `bold`|Indicates the which emphasis the tag should have|
|State tag|`idle` `hover` `active` `disabled` |Indicates the state of the tag|
|State close|`idle` `hover` `active` `disabled`|Indicates the state of the close button|
|Size|`md` `lg`|Size 'md' is the default size of the tag component |
|Removable|`boolean`|Displays a close button|
|Label|`value`|The text of the label|
|Focus ring|`boolean`|To show the focus ring of the tag|

{.ds-table .ds-table-align-top}

</div>

### Tag list

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Emphasis|`subtle` `bold`|Indicates the which emphasis the tag should have|
|Size|`md` `lg`|Indicates the size of the tag list |
|Items|`1` `2` `3` `4` `5` `6`|Indicates how many tags are shown in the tag list|
|Stacked|`boolean`|Indicates if the tags are stacked, this will show a counter in front of the tag list|

{.ds-table .ds-table-align-top}

</div>

</section>
