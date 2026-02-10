---
title: Icon code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Icon
  key: IconCode
---
<section>  
<div class="ds-example" style="gap: 3rem;">
<sl-icon name="face-smile"></sl-icon>
<sl-icon name="triangle-exclamation-solid" size="xl" style="color:var(--sl-color-palette-danger-500)"></sl-icon>
<sl-icon name="far-truck-fast" size="4xl"></sl-icon>
</div>

<div class="ds-code">

  ```html
  <script>
    import { faTruckFast } from '@fortawesome/pro-regular-svg-icons';
    Icon.Register(faTruckFast);
  </script>

  <sl-icon name="face-smile"></sl-icon>
  <sl-icon name="triangle-exclamation-solid" size="xl" style="color:var(--sl-color-palette-danger-500)"></sl-icon>
  <sl-icon name="far-truck-fast" size="4xl"></sl-icon>
  ```
</div>

</section>

<section>

## Using included icons

There are a number of icons included in the design system as SVG, provided via the `sl-icon` component. These can be either Font Awesome icons that are used in SLDS components or icons that have been created by (y)our designers. There is no difference in how to use these icons, both can be used by setting the name of the icon property without additional steps.
You can find the list of available icons in your theme on our Storybook page.

</section>

<section>

## Using additional Font Awesome Pro icons

In addition to the provided icons you can use all icons available in Font Awesome Pro<sup>[1]</sup>. Firstly you will need to add the install the icon styles you want to use:

<ds-code-snippet language="bash"> npm install @fortawesome/pro-regular-svg-icons</ds-code-snippet>

<ds-code-snippet language="bash"> yarn add @fortawesome/pro-regular-svg-icons</ds-code-snippet>

The icons need to be registered in order for them to load and be available in your application. You can choose the icon you want to use on [the Font Awesome website](https://fontawesome.com/icons) to find the name and package. Then you will need to import that icon from the corresponding package:

<ds-code-snippet language="javascript">import { faTruckFast } from '@fortawesome/pro-regular-svg-icons';</ds-code-snippet>

To add the icon<sup>[2]</sup> to the registry that is used in the browser you use the function on the Icon component:

<ds-code-snippet language="javascript">Icon.register(faTruckFast);</ds-code-snippet>

These two steps will make the Truck Fast icon from the regular (outline) style available. Because you can use a mixture of icons from different styles in one page Font Awesome uses a prefix per style to avoid conflicts. This causes the name of the icon you need to use in the `sl-icon` component to slightly differ from the icon you imported in previous step. There is [an overview of which style uses which prefix](https://docs.fontawesome.com/web/dig-deeper/kit-package-api/#prefix) available on the Font Awesome website.


Now you can use the icon:

<ds-code-snippet language="html">&lt;sl-icon name="far-truck-fast"&gt;&lt;/sl-icon&gt;</ds-code-snippet>

Where you import and register the icon is up to you, but it is advised to do this on the highest shared "parent" of all places that use the icon. So a very generally used icon could be registered in the same place you have the `setup()` for your theme, but an icon that is used only in dashboards can be registered in the dashboard-module.


**Notes**
1. There is a Sanoma wide Pro-license available in order to use the whole library. You will need a token both locally and in your build environment. Contact us via Slack or email to obtain this token.
1. It is also possible to pass multiple icons into the register function at once: `Icon.register(faTruckFast, faPinata);`

</section>

<section>

## Sizing

The size set in the `size` attribute is technically a "minimum size"; when a font size, deviating from the body-text, is set to the parent of the icon, or if a user uses (text) zoom in the browser the icon will use the maximum value of either the set icon size or 1cap of the current font-size.

When icons have no explicit size set, they will default to the height of the <code>md</code> size icon.
When the font-size (or zoom) is increased to the point where the <code>cap</code> size (the height of the capitals in the font) is larger than the 16px<sup>*</sup> of the <code>md</code>-icon the icon will become larger, to meet the size of <code>1cap</code>.
</section>

{% include "../component-table.njk" %}
