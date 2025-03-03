---
title: Avatar accessibility
tags: accessibility
eleventyNavigation:
  parent: Avatar
  key: AvatarAccessibility
---

<section> 

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

### Avatar label
Several parts of the avatar component will influence what will be available for assistive technology

  - The display name is only added as an alt-attribute on the avatar image when the avatar is set to `image-only`. Otherwise the name would be read out twice by the screen reader, and the main point of using an avatar is a quick way to identify a user. Reading out a name twice would not be "quick".
  - The badge text, in the optional (Badge component), will be read after the name.

</section>
