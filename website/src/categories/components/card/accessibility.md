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
- If the cards are part of a specific group, add an appropriate heading or use `aria-label` to describe the group.
- Update the heading level based on the content of the page to make sure card headings are in the correct, logical order. The heading will always look the same, so the heading level chosen will affect only the semantic meaning, so make sure that is logical in the context of the page.
- Each Card has a Heading level of the same level because they belong to a flat list hierarchy.
- Avoid having 2 links to the same URL (in the same Card) like one for the Title and another for the action (in that way we reduce the tab stops).
- Avoid nesting interactive elements, such as placing a button inside a link or a link inside a button.
- Don't wrap the whole card in a Link, use the expand prop to make it interactive.
  
</section>

<section>

## Keyboard interaction

<div class="ds-table-wrapper">

|Command|Description|
|-|-|
|`Tab`|Change focus on elements inside the card and subsequent actions. The card itself cannot be focused.|

{.ds-table .ds-table-align-top}

</div>

</section>
<section> 

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

<div class="ds-table-wrapper">

|Attribute|Value|Description|
|-|-|-|
|`alt`|string|Image alt text, if the image is not decorative. Alt text needs to be different from the card title.|

{.ds-table .ds-table-align-top}
</div>

</section>
