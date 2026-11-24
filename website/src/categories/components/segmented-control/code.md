---
title: Segmented control code
tags: code
APIdescription:
  sl-segmented-control: "The segmented control is the wrapper for the options of one value. Only one option can be selected at a time. Use the properties to set the size, emphasis, fill, shape and so on."
  sl-segmented-control-item: "A single option in the segmented control. It can show a label, an icon or both. Use the icon and selected-icon slots to set the icons."
eleventyNavigation:
  parent: Segmented control
  key: SegmentedControlCode
---

<section>

<div class="ds-example">
<sl-segmented-control aria-label="Class report" emphasis="bold" fill="outline" shape="pill" size="lg" value="grades">
  <sl-segmented-control-item value="overview">Overview</sl-segmented-control-item>
  <sl-segmented-control-item value="grades">Grades</sl-segmented-control-item>
  <sl-segmented-control-item value="attendance">Attendance</sl-segmented-control-item>
</sl-segmented-control>
</div>

<div class="ds-code">

  ```html
<sl-segmented-control
    aria-label="Class report"
    emphasis="bold"
    fill="outline"
    shape="pill"
    size="lg"
    value="grades">
      <sl-segmented-control-item value="overview">Overview</sl-segmented-control-item>
      <sl-segmented-control-item value="grades">Grades</sl-segmented-control-item>
      <sl-segmented-control-item value="attendance">Attendance</sl-segmented-control-item>
</sl-segmented-control>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="segmented-control"></ds-install-info>
{% include "../component-table.njk" %}

