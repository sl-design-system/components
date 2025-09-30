---
title: Panel accessibility
tags: accessibility
eleventyNavigation:
  parent: Panel
  key: PanelAccessibility
---
<section>

## Keyboard interactions

Here's an overview of the common keyboard interactions associated with a panel:

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`Tab`|Since the panel is basically a wrapper, the tab button functions normally; it focuses on each interactive element it comes across. When entering a collapsible panel the collape toggle button is the first thing that receives the focus.|
|`Enter` or `Space` | On the toggle button, this will change the state of the panel, either open or close it.|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Accessibility considerations

Sometimes, when e.g. we open or close panel items externally, we need to announce to the user that something has changed (the panel has expanded or collapsed).
When we expand it externally, it is not automatically read by the screen reader by default. We need to use `aria-live` to announce this to the user.


We recommend using the `Announcer` utility (`announce` function) to inform users about the changes.

Here you can find [an example of how to use the Announcer utility with the panel component](https://storybook.sanomalearning.design/?path=/story/layout-panel--toggle-externally).
</section>

<section> 

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

</section>
