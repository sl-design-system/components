---
title: Avatar usage
tags: usage
eleventyNavigation:
  parent: Avatar
  key: AvatarUsage
---

<section>  
<div class="ds-example" style="justify-content: space-evenly">
  <sl-avatar display-name="Anna Jenssen" picture-url="/assets/images/components/avatar/toa-heftiba-ANNsvl-6AG0-unsplash.jpg" size="3xl" orientation="vertical"></sl-avatar>
  <sl-avatar display-name="Tim Jenssen" picture-url="/assets/images/components/avatar/xia-yang-AGGA9LH3FLo-unsplash.jpg" size="xl" status="success">Class: 1B</sl-avatar>

  <small style="position: absolute; bottom:0; right:var(--scale-150-scale)">

  Photos by [Xia Yang](https://unsplash.com/@imrxia?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
  and [Toa Heftiba](https://unsplash.com/@heftiba?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

  </small>
</div>

<div class="ds-code">

  ```html
    <sl-avatar 
      display-name="Anna Jenssen" 
      picture-url="/images/avatar.jpg" 
      size="3xl" 
      orientation="vertical"></sl-avatar>

    <sl-avatar 
      display-name="Tim Jenssen" 
      picture-url="/images/avatar.jpg"  
      size="xl" 
      status="success">Class: 1B</sl-avatar>
  ```
</div>

</section>

<section>

## When to use

### User profiles
Avatars are commonly used to display user profile pictures. Avatars provide a face to a name. When users see their own profile picture, it fosters a sense of ownership and personal connection.

### People representation
In the context of contact lists, avatars serve as visual cues that swiftly connect users to their contacts. By associating a face or image with each entry, avatars make the list more relatable and memorable. Whether it’s a colleague, student, or teacher, avatars provide that instant recognition, making interactions more personal and efficient.

</section>

<section>

## When not to use

### Intrusive Design
Don’t let avatars distract from essential content. Ensure they enhance, rather than hinder, usability.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Avatar	|The avatar is available in three variants: image, initials or icon|No|
|2|Badge	|Status of user or entity|Yes|
|3|Name	|Diplays the name of the user or entity|Yes|
|4|Description	|Description is used to show essential information of user or entity which is related to the context of the page|Yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Options

With these options, you can tweak the appearance of the avatar in Figma. They are available in the Design Panel so you can compose the avatar to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">
  
### Avatar
|Item|Options|Description|
|-|-|-|
|Size|`sm` `md` `lg` `xl` `2xl` `3xl`|The avatar come in six sizes: sm, md, large, xl, 2xl and 3xl providing flexibility to align with your design requirements.|
|Orientation|`horizontal` `vertical`|The avatar has two different lay-out possibilities relating to the positions of the avatar, name and description relative to each other.|
|Type|`initials` `photo` `placeholder`|Choose if you want to show a photo, a placeholder (icon) or initials in the avatar|

{.ds-table .ds-table-align-top}
</div>

<div class="ds-table-wrapper">
  
### Badge
|Item|Options|Description|
|-|-|-|
|Badge|`boolean`|To indicate if the badge is enabled or disabled|
|Types|`alpha numeric` `icon` `empty`|Choose how you want to visualize the status within the badge|
|Background|`danger` `warning` `success` `accent` `grey` `primary`|To visualize the status color of the badge|

{.ds-table .ds-table-align-top}
</div>

<div class="ds-table-wrapper">
  
### Name and Description
|Item|Options|Description|
|-|-|-|
|Header|`boolean`|To show the name of the user or entity|
|Header|`value`|To insert the name of the user or entity|
|Subheader|`boolean`|To show the description of the user or entity|
|Subheader|`value`|To insert the description of the user or entity|

{.ds-table .ds-table-align-top}
</div>

</section>
