---
title: Button bar accessibility
tags: accessibility
eleventyNavigation:
  parent: Button bar
  key: ButtonBarAccessibility
---

<section>

## Accessibility considerations

The button bar component serves as a purely visual container for grouping buttons together.
It does not have any semantic meaning or ARIA role,
therefore ARIA attributes applied directly to the button bar itself will not be interpreted by assistive technologies.
Instead, ensure that each individual button within the button bar has appropriate accessible labeling,
especially for icon-only buttons which should include an `aria-label` attribute.

</section>

