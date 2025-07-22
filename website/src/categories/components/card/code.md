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
     <sl-card style="--sl-card-horizontal-breakpoint:500px;">
        <img slot="media" src="/assets/images/components/card/card-image.png" />
        <h2>Fun adventures in digital learning</h2>
        <span slot="header"><sl-badge variant="accent" color="blue">new</sl-badge> written by: Lynn</span>
        <p slot="body">
          Digital learning is when we use computers, tablets, or even phones to learn new things. It's super cool because it lets us explore all sorts of topics without even leaving our homes!
        </p>
        <sl-toggle-button slot="menu-button" aria-label="Favorite" shape="pill">
            <sl-icon name="far-heart" slot="default"></sl-icon>
            <sl-icon name="fas-heart" slot="pressed"></sl-icon>
          </sl-toggle-button>
        <sl-button slot="actions"><sl-icon name="eye"></sl-icon> Read more</sl-button>
      </sl-card>
  </div>
</div>

<div class="ds-code">

  ```html
       <sl-card style="--sl-card-horizontal-breakpoint:500px;">
        <img slot="media" src="/assets/images/components/card/card-image.png" />
        <h2>Fun adventures in digital learning</h2>
        <span slot="header"><sl-badge variant="accent" color="blue">new</sl-badge> written by: Lynn</span>
        <p slot="body">
          Digital learning is when we use computers...
        </p>
        <sl-toggle-button slot="menu-button" aria-label="Favorite" shape="pill">
            <sl-icon name="far-heart" slot="default"></sl-icon>
            <sl-icon name="fas-heart" slot="pressed"></sl-icon>
          </sl-toggle-button>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
  ```

</div>

</section>
<ds-install-info package="card" link-in-navigation></ds-install-info>
<section>

## CSS Variables

As many properties as possible are being set by CSS variables because that way you can easily make all the cards inside a container look the same by setting the properties on that container, or you can create custom css classes that consist of a combination of settings.

</section>

{% include "../component-table.njk" %}

