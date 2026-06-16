---
title: Accordion
layout: component
eleventyNavigation:
  key: Accordion
  parent: Layout
---

```html {.example .show-source}
<sl-accordion>
  <sl-accordion-item summary="Section 1">Content of the first section.</sl-accordion-item>
  <sl-accordion-item summary="Section 2">Content of the second section.</sl-accordion-item>
</sl-accordion>
```

## Usage

`<sl-accordion>` is a stack of collapsible sections. Use it to organise related content into
sections that the user can expand and collapse, keeping long pages manageable.

Each section is an `<sl-accordion-item>` with a `summary` (the clickable header) and its content in
the default slot.

## Examples

### Basic

Add the `open` attribute to an item to have it expanded initially.

```html {.example .show-source}
<sl-accordion>
  <sl-accordion-item summary="What is a design system?" open>
    A design system is a collection of reusable components and guidelines that help teams build
    consistent products.
  </sl-accordion-item>
  <sl-accordion-item summary="Why use one?">
    It improves consistency, speeds up development and makes products easier to maintain.
  </sl-accordion-item>
  <sl-accordion-item summary="How do I get started?">
    Install the packages, import a theme, and start using the components.
  </sl-accordion-item>
</sl-accordion>
```

### Single

Add the `single` attribute so that opening one section automatically closes the others.

```html {.example .show-source}
<sl-accordion single>
  <sl-accordion-item summary="Section 1" open>Only one section can be open at a time.</sl-accordion-item>
  <sl-accordion-item summary="Section 2">Opening this one closes the others.</sl-accordion-item>
  <sl-accordion-item summary="Section 3">And so on.</sl-accordion-item>
</sl-accordion>
```

### Icon type

Use the `icon-type` attribute to switch the expand/collapse indicator between `plusminus` (default)
and `chevron`.

```html {.example .show-source}
<sl-accordion icon-type="chevron">
  <sl-accordion-item summary="Section 1" open>Uses a chevron indicator.</sl-accordion-item>
  <sl-accordion-item summary="Section 2">Uses a chevron indicator.</sl-accordion-item>
</sl-accordion>
```

## API

See the API reference for [`sl-accordion`](/api-reference/sl-accordion) and
[`sl-accordion-item`](/api-reference/sl-accordion-item).
