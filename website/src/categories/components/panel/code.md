---
title: Panel code
tags: code
APIdescription: The Panel component offers settings for various scenarios.
eleventyNavigation:
  parent: Panel
  key: PanelCode
---
<style>
.ds-example > sl-panel {
  max-inline-size: 360px;
}
sl-panel::part(content){
  display: flex;
  gap: 8px;
}
.ds-example > sl-panel::part(content){
  flex-direction: column;
}
.ds-example ul.links {
  list-style:none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 8px;
  flex-direction: column;
}
.ds-example ul.links li {
  border: 1px solid #D0D9E0;
  border-radius: 4px;
  margin: 0;
}
.ds-example ul.links a {
  text-align: center;
  padding: 12px 16px;
  display: flex;
  gap: 6px;
  color: inherit;
  text-decoration: none;
  font-weight: var(--sl-text-typeset-font-weight-demibold);
}
</style>

<section class="no-heading">

<div class="ds-example">
  <sl-panel collapsible heading="6.5 Sneaky Photo Signals">
    <sl-badge slot="aside" emphasis="subtle" color="yellow" size="lg">Draft</sl-badge>
    <p>Find a news article with a striking photo. In 4–6 sentences, tell us what the image really says beyond the caption. Quote a sentence from the article that amplifies the photo.</p>
    <ul class="links">
      <li><a href="#"><sl-icon name="far-eye-slash"></sl-icon> 1. Find a photo-forward story</a></li>
      <li><a href="#"><sl-icon name="far-puzzle-piece-simple"></sl-icon> 2. Answer the questions</a></li>
      <li><a href="#"><sl-icon name="far-puzzle-piece-simple"></sl-icon> 3. Find in the text</a></li>
    </ul>
    <sl-button-bar align="end">
      <sl-button fill="ghost"><sl-icon name="far-file-pen"></sl-icon>Edit</sl-button>
      <sl-button fill="ghost"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
    </sl-button-bar>
  </sl-panel>
</div>

<div class="ds-code">

  ```html
<sl-panel collapsible heading="6.5 Sneaky Photo Signals">
    <sl-badge slot="aside">Draft</sl-badge>
    <p>Find a news article w...</p>

    <ul class="links">
      <li><a href="#"><sl-icon name="far-eye-slash"></sl-icon> 1. Find ...</a></li>
      ...
    </ul>

    <sl-button-bar align="end">
      <sl-button fill="ghost"><sl-icon name="far-file-pen"></sl-icon>Edit</sl-button>
      <sl-button fill="ghost"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
    </sl-button-bar>
  </sl-panel>
  ```

</div>
</section>
<ds-install-info link-in-navigation package="panel"></ds-install-info>

{% include "../component-table.njk" %}
