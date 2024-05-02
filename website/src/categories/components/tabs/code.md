---
title: Tabs code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Tabs
  key: TabsCode
---
<section class="no-heading">

<div class="ds-example">
<sl-tab-group align-tabs="stretch" style="background: var(--sl-color-tab-default-background); inline-size: 650px">
<sl-tab >Tab 1</sl-tab>
<sl-tab selected>Tab 2</sl-tab>
<sl-tab disabled>Tab 3</sl-tab>
<sl-tab>Tab 4</sl-tab>
<sl-tab>Tab 5</sl-tab>
<sl-tab-panel>Panel 1</sl-tab-panel>
<sl-tab-panel>Panel 2</sl-tab-panel>
<sl-tab-panel>Panel 3</sl-tab-panel>
<sl-tab-panel>Panel 4</sl-tab-panel>
<sl-tab-panel>Panel 5</sl-tab-panel>
</sl-tab-group>
</div>

<div class="ds-code">

  ```html
<sl-tab-group align-tabs="stretch" 
        style="background: var(--sl-color-tab-default-background); inline-size: 650px">
    <sl-tab >Tab 1</sl-tab>
    <sl-tab selected>Tab 2</sl-tab>
    <sl-tab disabled>Tab 3</sl-tab>
    <sl-tab>Tab 4</sl-tab>
    <sl-tab>Tab 5</sl-tab>
    <sl-tab-panel>Panel 1</sl-tab-panel>
    <sl-tab-panel>Panel 2</sl-tab-panel>
    <sl-tab-panel>Panel 3</sl-tab-panel>
    <sl-tab-panel>Panel 4</sl-tab-panel>
    <sl-tab-panel>Panel 5</sl-tab-panel>
</sl-tab-group>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="tabs"></ds-install-info>

{% include "../component-table.njk" %}