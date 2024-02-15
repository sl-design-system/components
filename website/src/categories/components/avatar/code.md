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
  <sl-avatar size="3xl" id="avatar3" orientation="vertical"></sl-avatar>
  <sl-avatar size="xl" id="avatar4" status="success">Class: 1B</sl-avatar>

  <small style="position: absolute; bottom:0; right:var(--scale-150-scale)">

  Photos by [Xia Yang](https://unsplash.com/@imrxia?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
  and [Toa Heftiba](https://unsplash.com/@heftiba?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

  </small>
</div>

<div class="ds-code">

  ```html

    const user1 = {
      'name': {
        'first': 'Anna',
        'last': 'Jenssen'
      },
      'picture': {
        'thumbnail': '/images/avatar.jpg'
      }
    }

    <sl-avatar user="user1" size="3xl" id="avatar1" orientation="vertical"></sl-avatar>
    <sl-avatar user="user2" size="xl" id="avatar2" status="success">Class: 1B</sl-avatar>
  ```
</div>

</section>

<section>

## Avatar shape

The shape of the avatar - a circle or a square, optionally with rounded corners - is determined by an application wide setting per theme. This is, like the tokens are, maintained by the SLDS team

</section>

{% include "../component-table.njk" %}

<script>
document.querySelector("#avatar3").user = {
    'name': {
      'first': 'Anna',
      'last': 'Jenssen'
    },
    'picture': {
      'thumbnail': '/assets/images/components/avatar/toa-heftiba-ANNsvl-6AG0-unsplash.jpg'
    }};

document.querySelector("#avatar4").user = {
    'name': {
      'first': 'Tim',
      'last': 'Jenssen'
    },
    'picture': {
      'thumbnail': '/assets/images/components/avatar/xia-yang-AGGA9LH3FLo-unsplash.jpg'
    }};

</script>
