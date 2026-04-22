---
title: Avatar accessibility
tags: accessibility
eleventyNavigation:
  parent: Avatar
  key: AvatarAccessibility
---

<section>

## Avatar with badge

There are two ways to improve the accessibility of `sl-badge` when used inside an avatar, depending on the scenario:

### Dynamic content

Sometimes, when the badge value updates automatically (e.g. an unread message count), the change is not automatically announced by screen readers. We need to explicitly notify the user that something has changed.

We recommend using the `Announcer` utility (`announce` function) to inform users about the updated badge value. The badge itself should have a descriptive `aria-label` so screen readers can read it when the user navigates to it manually.

Here you can find [an example of how to use the Announcer utility with the avatar badge](https://storybook.sanomalearning.design/?path=/story/media-avatar--sizes).

### Static content

If the badge displays information that does not change while the user is interacting with the application, the badge should not have an `aria-label` or any role. Instead, place visually hidden text inside the badge so screen readers announce it when the user navigates to it.

```html
<sl-avatar display-name="Rose Nylund" picture-url="/images/avatar-1.jpg">
  <sl-badge slot="badge">
    <sl-icon name="far-star"></sl-icon>
    <span class="visually-hidden">admin</span>
  </sl-badge>
</sl-avatar>
```

</section>

<section> 

## WAI-ARIA

{{ 'aria-attributes-no-list' | recurringText }}

### Avatar label
Several parts of the avatar component will influence what will be available for assistive technology

  - The display name is only added as an alt-attribute on the avatar image when the avatar is set to `image-only`. Otherwise the name would be read out twice by the screen reader, and the main point of using an avatar is a quick way to identify a user. Reading out a name twice would not be "quick".
  - The badge text, in the optional (Badge component), will be read after the name.

</section>

