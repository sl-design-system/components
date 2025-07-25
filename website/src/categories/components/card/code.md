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

## Options

### CSS Variables

As many properties as possible are being set by CSS variables because that way you can easily make all the cards inside a container look the same by setting the properties on that container, or you can create custom css classes that consist of a combination of settings.



### Subgrid
 
With the `subgrid` attribute you can make sure all cards in a grid have the same inner layout. If you want a grid of 2 horizontal cards, with header, content and an action button for example you can use the following css:
<div class="ds-code">
          
  ```css
grid-template-columns: repeat(2, 200px 1fr);
grid-auto-rows: max-content 5lh max-content;
  ```
</div>

The `200px 1fr` will make sure that each card has an image of 200px wide, and the rest of the card is filled stretched out so it fills the grid.<br>
The `repeat(2,...` will make sure there are 2 columns of cards.

The values in `grid-auto-rows` will keep repeating themselves for as long as there is content. <br>
`max-content 5lh max-content` will mean both the header and the action buttons will be as large as they need to be, while the body text will have a height of 5 lines of the body text.

</section>

{% include "../component-table.njk" %}

