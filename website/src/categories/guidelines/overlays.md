---
title: Overlays
eleventyNavigation:
  parent: Guidelines
  key: Overlays
  order: 5
---

<header class="ds-tokens__main-heading">
<div class="ds-tokens__heading-wrapper">
  <h1 class="ds-heading-1">{{title}}</h1>
  <p class="ds-tokens__heading-description">
  Overlays are elements that appear on top of all other content on the page. They are used for modal dialogs, popovers and tooltips.
  </p>
</div>
</header>

<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">

<section>

The top layer is a specific layer that spans the entire width and height of the viewport and sits on top of all other layers displayed in a web document. It is created by the browser to contain elements that should appear on top of all other content on the page. This is where modal dialogs and popover elements are displayed.

For the design system that means that this is where `<sl-dialog>`, `<sl-popover>`, `<sl-tooltip>` and any other popovers that are a child of a component (for example the dropdown within `<sl-select>`) are displayed.

</section>

<section>

## Previous techniques

Before the introduction of the top layer, elements that should appear on top of all other content on the page were placed at the bottom of the document, just before the closing `</body>` tag. This was done to ensure that the element would be displayed on top of all other content on the page. Otherwise it ran the risk of being covered or clipped by parent elements. Regular content cannot escape the bounds of its parent element when it is a scroll container, but elements placed at the bottom of the document can.

The downside of this technique is that the content is transported to somewhere else in the DOM. That means that regular CSS no longer works. You have to inline the styling for the element or use JavaScript to apply the styling.

</section>

<section>

## The top layer

With the introduction of popovers, the behavior of the top layer has been formalized.

Any element that is either a modal dialog (which is what we use within `<sl-dialog>`) or has a `popover` attribute, will appear automatically in the top layer. The position in the DOM will remain the same. So even though the element will appear on top of all other content, you can still style it using regular CSS.

</section>

<section>

## Migration

If you have any elements that are currently placed at the bottom of the document, you can migrate them to the top layer by adding the `popover` attribute to them. This will ensure that they are displayed on top of all other content on the page.

If you don't do this, and you combine elements with the old and new techniques, you run the risk of elements using the old technique being displayed *below* elements using the new technique.

One example would be to have an `<sl-dialog>` that contains a `<dna-date-picker>`. The dropdown of the date picker containing the calendar uses the old technique. The behavior of the date picker will be that the calendar is displayed *below* the dialog.

A possible approach to migrating from a system using the old technique to the design system using the new technique would be a "bottom-up" approach:
1. Start by migrating the "leaf" components that use the old technique. In the example above, that would be the `<dna-date-picker>`.
2. Then migrate the components that use the leaf components.
3. Once all components are migrated, you can remove the old technique from the system.

</section>
</div>

</section>
