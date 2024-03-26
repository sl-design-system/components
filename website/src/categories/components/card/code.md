---
title: Card code
tags: code
APIdescription: The card has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Card
  key: CardCode
---

<section class="no-heading">
<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-card style="--sl-card-media-aspect-ratio:1/1;">
        <img slot="media" src="https://sanomalearning.design/assets/images/open-graph-card.jpg" />
        <h2>Fun adventures in digital learning</h2>
        <span slot="header"><sl-badge variant="accent">new</sl-badge> written by: Lynn</span>
        <p slot="body">
          Digital learning is when we use computers, tablets, or even phones to learn new things. It's super cool because it lets us explore all sorts of topics without even leaving our homes!
        </p>
        <p slot="body">First off, digital learning means we can learn anytime, anywhere. Say goodbye to boring textbooks! With digital learning, we can watch fun videos, play educational games, and even talk to teachers and other students online. It's like having a whole world of knowledge at our fingertips!</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-card style="--sl-card-media-aspect-ratio:1/1;">
    <img slot="media" src="images/open-graph-card.jpg" />
    <h2>Fun adventures...</h2>
    <span slot="header">
      <sl-badge>new</sl-badge>
       written by: Lynn
    </span>
    <p slot="body">
      Digital learning is when...
    </p>
    <sl-button slot="actions" icon-only fill="ghost">
      <sl-icon name="eye"></sl-icon>
    </sl-button>
  </sl-card>
  ```

</div>

</section>

<ds-install-info package="spinner" link-in-navigation></ds-install-info>

<section>

## CSS Variables

As many properties as possible are being set by CSS variables because that way you can easily make all the cards inside a container look the same by setting the properties on that container, or you can create custom css classes that consist of a combination of settings.

</section>

{% include "../component-table.njk" %}

