---
title: Card
layout: component
eleventyNavigation:
  key: Card
  parent: Layout
---

```html {.example .show-source}
<sl-card>
  <img slot="media" src="image.jpg" alt="" />
  Card title
  <span slot="body">A short description of the card's content.</span>
</sl-card>
```

## Usage

`<sl-card>` is a flexible container for a single piece of content, such as an article, product or
result. It provides slots for media, a title, supporting header content, body text and actions, and
can be laid out horizontally or vertically.

## Slots

default
: The title of the card.

`media`
: An image (or other media) for the card.

`header`
: A subtitle or badges shown near the title.

`body`
: The body text of the card.

`actions`
: Actions shown at the bottom — a single button or a button bar.

## Examples

### Basic

By default the card is laid out horizontally, with the media beside the content.

```html {.example .show-source}
<sl-card style="max-inline-size: 480px;">
  <img slot="media" src="https://images.unsplash.com/photo-1586622992874-27d98f198139?q=80&w=400&auto=format&fit=crop" alt="" />
  Captivating Nyhavn Moments
  <span slot="header">Travel</span>
  <span slot="body">
    Immerse yourself in the vibrant hues of Nyhavn, Copenhagen's iconic waterfront.
  </span>
</sl-card>
```

### Vertical

Set `orientation="vertical"` to stack the media above the content — useful in grids.

```html {.example .show-source}
<sl-card orientation="vertical" style="max-inline-size: 280px;">
  <img slot="media" src="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=400&auto=format&fit=crop" alt="" />
  Architectural Elegance
  <span slot="header"><sl-badge color="blue">New</sl-badge></span>
  <span slot="body">Copenhagen's skyline blends historic landmarks with contemporary design.</span>
</sl-card>
```

### With actions

Use the `actions` slot for buttons at the bottom of the card.

```html {.example .show-source}
<sl-card orientation="vertical" style="max-inline-size: 280px;">
  <img slot="media" src="https://images.unsplash.com/photo-1499689496495-5bdf4421b725?q=80&w=400&auto=format&fit=crop" alt="" />
  Enchanting Copenhagen
  <span slot="body">Discover the allure of Copenhagen's waterfront gem.</span>
  <sl-button slot="actions" variant="primary">Read more</sl-button>
</sl-card>
```

## API

See the [API reference](/api-reference/sl-card) for all attributes, properties and slots.
