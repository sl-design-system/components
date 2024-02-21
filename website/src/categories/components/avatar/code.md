---
title: Avatar code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Avatar
  key: AvatarCode
---
<section>  
<div class="ds-example" style="justify-content: space-evenly">
  <sl-avatar display-name="Anna Jenssen" picture-url="/assets/images/components/avatar/toa-heftiba-ANNsvl-6AG0-unsplash.jpg" size="3xl" orientation="vertical"></sl-avatar>
  <sl-avatar display-name="Tim Jenssen" size="xl" status="success">Class: 1B</sl-avatar>

  <small style="position: absolute; bottom:0; right:var(--scale-150-scale)">

  Photo by [Toa Heftiba](https://unsplash.com/@heftiba?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

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
      size="xl" 
      status="success">Class: 1B</sl-avatar>
  ```
</div>

</section>

<section>

## Avatar shape

The shape of the avatar - a circle or a square, optionally with rounded corners - is determined by an application wide setting per theme. This is, like the tokens are, maintained by the SLDS team

</section>

{% include "../component-table.njk" %}

