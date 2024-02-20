---
title: Avatar accessibility
tags: accessibility
eleventyNavigation:
  parent: Avatar
  key: AvatarAccessibility
---

<section> 

## WAI-ARIA

WAI-ARIA Roles, States, and Properties for an avatar provide essential information to assistive technologies and screen readers. They convey the avatar's role and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

<div class="ds-table-wrapper">

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`aria-label`|string|Combination of name, label and badge text, depending on settings. See [Note 1] below for more explanation|no|

{.ds-table .ds-table-align-top}
</div>

**Notes**

1. There are various components that can occur in the label; 

    - The display name, that is only added when the avatar is set to `image-only`. Otherwise the name would be read out twice by the screen reader, and the main point of using an avatar is a quick way to identify a user. Reading out a name twice would not be "quick".
    - The label, this can be set by using the `label` attribute. This is usefull when a status badge is displayed for example, that way it would read out "Anna Jenssen, online". In the string you can also use `{{'{{badgeText}}'}}` which wil be replaced by the text in the badge. That way you can get it to read out "Anna Jenssen has 5 open assignments" when you set `has {{'{{badgeText}}'}} open assignments` as the label text
    - The badge text, when no label it set it will just read out what is visible in the badge.

</section>
