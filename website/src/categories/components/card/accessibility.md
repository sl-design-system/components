---
title: Card accessibility
tags: accessibility
eleventyNavigation:
  parent: Card
  key: CardAccessibility
---
<section>
  
## Accessibility considerations

- Wrap your cards in a list to group your cards. Each list item `<li>` represents a card.
- Each Card has a Heading level of the same level because they belong to a flat list hierarchy
- If the cards are part of a specific group, add an appropriate heading or use `aria-label` to describe the group.
- Update the heading level based on the content of the page to make sure card headings are in the correct, logical order
- Avoid having 2 links to the same URL (in the same Card) like one for the Title and another for the action (in that way we reduce the tab stops)
- When creating a tab order for the different parts of the card, remember to put the headline before the image or media so that screen-reader users get the context before the image alt tag
- Avoid nesting interactive elements, such as placing a button inside a link or a link inside a button.
- Don't wrap the whole card in a Link, use the expand prop to make it interactive
  
</section>

<section>

## Keyboard interaction

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|Tab|Change focus on the card and subsequent actions|

{.ds-table .ds-table-align-top}

</div>

</section>
<section> 

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for an card provide essential information to assistive technologies and screen readers. They convey the card's role and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`alt`|string|Image alt text, if the image is not decorative. Alt text needs to be different from the card title|yes|

{.ds-table .ds-table-align-top}
</div>

</section>
