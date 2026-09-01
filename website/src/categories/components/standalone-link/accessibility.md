---
title: Standalone link accessibility
tags: accessibility
eleventyNavigation:
  parent: Standalone link
  key: StandaloneLinkAccessibility
---

<section>
Exploring essential accessibility considerations for links: ensuring an inclusive user experience.
</section>

<section>

## Content
Accessible applications depend not only on good code, but also on good copy. To keep links and their destinations clear for all users, follow these guidelines:

### Avoid ambiguous names
Links with the same text should lead to the same destination. When similar links lead to different destinations, use enough distinguishing text to make each destination clear.

### Concise Clarity
Link text should be brief, ideally 1 or 2 words, and at most 4 words with fewer than 20 characters, spaces included. Avoid punctuation like periods or exclamation points.

### Target-Centric
Links should express their target, using verbs in their labels and a bare infinitive conjunction. This approach enhances clarity and user orientation.

### Clear Outcomes
The link's label should unmistakably convey its destination. Ideally, the link text should match the destination page title.

### Sentence Case
Always use sentence case for link text; capitalization should not be used for emphasis.

### Mindful Tone
Links serve a functional purpose, so emojis and exclamation points should be left behind. Keep labels as plain text, free from extra punctuation or embellishments.

</section>

<section>

## Difference between link and button
It's important for accessibility to use links and buttons in the right scenarios so assistive technology users know what to expect from each item.
Use a link for navigation to another page, route, or resource.
Use a button for actions performed on the current page, even when it requires opening a modal dialog.
Do not use a standalone link as a button-like action if it does not navigate.

</section>

<section>

## Links opening in new tab
Internal links that open in a new tab and external links have an additional icon at the end. This icon communicates the behavior to sighted users. For screen reader users, the component automatically adds visually hidden text that announces '(opens in a new tab)'.

</section>

<section>

## Keyboard interactions
<div class="ds-table-wrapper">

| Command     | Description |
|-------------|-------------|
| Tab         | Moves focus to next link.        |
| Shift + Tab | Moves focus to previous link.        |
| Enter       | Activates the link.         |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

For this component we can't think of any common scenarios that require you to add specific attributes, but keep in mind that if you use images or icons that (partially) replace text you need to provide an alternative for assistive technology, by adding an alttext or aria-label as you normally would.
</section>