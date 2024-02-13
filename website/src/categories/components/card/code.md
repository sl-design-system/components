---
title: Label code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Label
  key: LabelCode
---

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-card orientation="horizontal">
        <img slot="media" src="https://sanomalearning.design/assets/images/open-graph-card.jpg" />
        <h2>Card title</h2>
        <span slot="header"><sl-badge variant="accent">new</sl-badge></span>
        <p slot="body">
          Lorem ipsum dolor sit amet, adipisicing sint sunt sint proident sint exercitation. Quis officia pariatur in duis proident sint commodo voluptate officia quis irure in enim minim Lorem aute sit cillum non.
        </p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-card orientation="horizontal">
    <img slot="media" src="images/open-graph-card.jpg" />
    <h2>Card title</h2>
    <span slot="header"><sl-badge>new</sl-badge></span>
    <p slot="body">
      Lorem ipsum dolor sit amet...
    </p>
    <sl-button slot="actions" icon-only fill="ghost">
      <sl-icon name="eye"></sl-icon>
    </sl-button>
  </sl-card>
  ```

</div>

</section>

{% include "../component-table.njk" %}

<section>

## CSS Variables

As many properties as possible are being set by CSS variables because that way you can easily make all the cards inside a container look the same by setting the properties on that container, or you can create custom css classes that consist of a combination of settings.

</section>
