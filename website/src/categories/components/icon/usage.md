---
title: Icon usage
tags: usage
eleventyNavigation:
  parent: Icon
  key: IconUsage
---

<section>  
<div class="ds-example" style="gap: 3rem;">
  <sl-icon name="angle-down" size="2xs"></sl-icon>
  <sl-icon name="face-smile"></sl-icon>
  <sl-icon name="triangle-exclamation-solid" size="xl" style="color:var(--sl-color-palette-danger-500)"></sl-icon>
  <sl-icon name="pinata" size="4xl"></sl-icon>
</div>

<div class="ds-code">

  ```html
  <sl-icon name="angle-down" size="2xs"></sl-icon>
  <sl-icon name="face-smile"></sl-icon>
  <sl-icon name="triangle-exclamation-solid" size="xl" style="color:red"></sl-icon>
  <sl-icon name="pinata" size="4xl"></sl-icon>
  ```
</div>

</section>

<section>

## When to Use
Icons are important for user understanding and interaction

### Intuitive Content
Icons enhance usability, facilitating a quick understanding by providing a visual representation of information. They can communicate complex messages to the user effectively in a simple and concise manner, resulting in a more intuitive and user-friendly experience.

</section>


<section>

## When not to Use
Our focus is on functionality and accessibility, ensuring icons convey meaningful information and enhance usability.

### No for Decoration
Avoid using the icon component for purely decorative purposes. The main objective is to enhance the user's understanding of the actions within the interactive elements. When icons are utilized solely for ornamentation without contributing to the clarity or functionality of the interface, it can lead to visual clutter and detract from the overall usability of the interface. Use icons to convey meaningful information or facilitate user interactions to maintain usability and effectiveness.

</section>


<section>

## Variants
We use the icons library Font Awesome to ensure that all the icons look similar and are easy to use. However, it is possible to implement custom icons.

  - **Font Awesome:**  By default, we provide the Font Awesome icons library to choose the icons from them. You only need to check and copy the icon name to the icon layer.

  - **Custom:** You can also create specific SVG icons, but we encourage using Font Awesome. If it is necessary to have a custom icon because it's mandatory for your app, contact us to tell you the next steps.

</section>


<section>

## Options
With these options, you can tweak the appearance of the icon in Figma. They are available in the Design Panel so you can compose the icon to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Icon|`'fa', 'svg'`|Choose the variant of the icon, Font Awesome or Custom (SVG). |
|FontAwesome|`'Icon Name'`|Write down the name of the icon from Font Awesome. |

{.ds-table .ds-table-align-top}

</section>
