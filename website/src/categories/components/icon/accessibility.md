---
title: Icon accessibility
tags: accessibility
eleventyNavigation:
  parent: Icon
  key: IconAccessibility
---

<section>

## Label

In general we recommend using WAI-ARIA attributes when there is no text visible, but in the case of this icon component we've created a `label` attribute for you to set the `aria-label` because whether there is or isn't a label impacts other attributes besides just `aria-label`.

`aria-hidden`	will be set when no label is given, because we assume the icon is purely presentational and we hide it from assistive technology. 
When there is a label set the `role` attribute will be set to `img` because the icon will be part of the accessibility tree and thus we need to declare it as an image.

The label only needs to be set when there is no accompanying text with the icon, as the assistive technology will read this label as well as the accompanying text. It can however be used in the rare cases the icon adds additional information to the label.
</section>
