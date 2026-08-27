---
title: Standalone link usage
tags: usage
eleventyNavigation:
  parent: Standalone link
  key: StandaloneLinkUsage
---
<section class="no-heading">

<div class="ds-example">

    <sl-link>
      <a href="/dashboard">Standalone link</a>
    </sl-link>

</div>

<div class="ds-code">
  
  ```html
    <sl-link>
      <a href="/dashboard">Standalone link</a>
    </sl-link>
  ```

</div>

</section>

<section>

## When to use
* Navigate to content within the product.
* Link to supporting information such as documentation, FAQs, help articles, or policy pages.
* Direct users to external websites or third-party resources.

</section>

<section>

## When not to use
* Do not use a Standalone Link when the primary purpose is to perform an action rather than navigate. Standalone Links are intended for navigation to another page, view, or resource. If the interaction initiates an action, use a standard [Button](/categories/components/button/usage) instead.
* Do not use a Standalone Link for inline links within running text or paragraphs; use global text link styling instead.

</section>


<section class="ds-cards">
  
  ## Link Types
  
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-1" size="sm"></sl-icon>
          <sl-link no-icon="">
      <a href="/dashboard">Internal link</a>
    </sl-link>
    </div>
    <figcaption>

### Default internal link
The default internal link contains no icons and is used for navigating to destinations within the same product or ecosystem. This link always opens in the same tab.

    </figcaption>
  </figure>
  
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-2" size="sm"></sl-icon>
            <sl-link>
      <a href="/dashboard">Internal link</a>
    </sl-link>
    </div>
    <figcaption>
      
### Internal link with arrow on the right
Used similarly to the default internal link, but includes a right arrow icon to add emphasis or indicate moving forward in a process. This link always opens in the same tab.

    </figcaption>
  </figure>

  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-3" size="sm"></sl-icon>
    <sl-link icon-position="start">
      <a href="/dashboard">Internal link</a>
    </sl-link>
    </div>
    <figcaption>
      
### Internal link with arrow on the left
Used similarly to the default internal link, but includes a left arrow icon to indicate moving back in a process. This link always opens in the same tab.

    </figcaption>
  </figure>

  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-4" size="sm"></sl-icon>
    <sl-link icon-position="start">
      <a href="/dashboard" target="blank">Internal link</a>
    </sl-link>
    </div>
    <figcaption>
      
### Internal link that opens in a new tab.
Open in a new tab when users need to preserve their current context, such as during a workflow where supporting information is required.

    </figcaption>
  </figure>

  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-5" size="sm"></sl-icon>
    <sl-link>
      <a href="https://sanomalearning.com" target="blank">External link</a>
    </sl-link>
    </div>
    <figcaption>
      
### External link
Use for destinations outside the product or organization domain. Always displays an external link icon and opens in a new tab.

    </figcaption>
  </figure>

  
  <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-6" size="sm"></sl-icon>
    <sl-link>
      <a href="mailto:team@sanomalearning.design">Email link</a>
    </sl-link>
    </div>
    <figcaption>
      
### Email link
Used for `mailto:` links. Always displays an envelope icon and triggers the user's default mail client.

    </figcaption>
  </figure>

    <figure>
    <div class="ds-example">
      <sl-icon name="fas-hand-back-point-up" id="interactive-example-6" size="sm"></sl-icon>
    <sl-link>
      <a href="tel:+123456789012">Telephone link</a>
    </sl-link>
    </div>
    <figcaption>
      
### Telephone link
Used for `tel:` links. Always displays a phone icon and triggers the device's calling application.

    </figcaption>
  </figure>
  
</section>

<section>

## Variants
Each variant carries a specific semantic meaning, which in turn determines the correct color to use. Rather than specifying exact color values here, the corresponding color is defined by the design tokens — actual values can differ per product/theme.

* Primary — used for primary navigation / high emphasis.
* Secondary — used for secondary navigation / regular emphasis.
* Info — used for informative links, for example within an informative inline message.
* Success — used for positive links, for example within a positive inline message.
* Warning — used for cautionary links, for example within a caution inline message.
* Danger — used for negative links, for example within a negative inline message.
  
</section>

<section>

## Fill
Available fill types: Solid, Outline, and Ghost.
All fill types are available across every variant listed above.

* Solid: Filled background button style.
* Outline: Bordered, transparent background.
* Ghost: No border, text-only.

</section>

<section>

## Shapes
This component is available in two shape variants to align with our ecosystem's product lines and screen contexts:

* Pill-shaped (`pill`): Use this variant in student and parent products, and across all user groups (including teachers and administrators) on login and auth screens to create a friendly, welcoming entry experience.
* Rectangular (`rect`): Use this variant in information-dense products, dashboards, and data workflows for teachers and administrators to match the structured, professional grid layout.

Rule of thumb: Always match the shape of your standard buttons within the same screen.
  
</section>

<section>

## Sizes
This component is available in three sizes to accommodate different layouts, hierarchy, and context:

* Small (`sm`): Use in tight spaces, data-dense tables, grids, and compact UI components where actions need to be subtle and space-efficient.
* Medium (`md`): The default standard size. Use for everyday navigation, general workflows, and standard content sections.
* Large (`lg`): Use for prominent, high-priority entry points, such as login and auth screens, empty states, or main call-to-action areas requiring maximum visual impact and touch target size.
  
</section>

<section>

## Icon Usage

| Situation | Icon |
| --- | --- |
| Standard internal navigation in the same tab | No icon |
| Internal navigation in the same tab, moving forward a step in a process or to add extra emphasis | <sl-icon name="arrow-right"></sl-icon> |
| Internal navigation in the same tab, going back a step in a process | <sl-icon name="arrow-left"></sl-icon> |
| Internal navigation in a new tab | <sl-icon name="square-arrow-up-right"></sl-icon> |
| External navigation | <sl-icon name="arrow-up-right-from-square"></sl-icon> |
| Telephone (`tel:`) navigation | <sl-icon name="mobile"></sl-icon> |
| Email (`mailto:`) navigation | <sl-icon name="envelope"></sl-icon> |

{.ds-table .ds-table-align-top}

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container	|Defines the clickable area of the link button.	|no|
|2|Text label	|Communicates the link's destination or purpose.	|no|
|3|Icon end	|Indicates the link's behavior or destination type. |yes|
|4|Arrow-left	|Indicates if the user is going back a step in a process (only used for internal navigation in the same tab) |yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Content guidelines
* Use concise, descriptive labels.
* Avoid generic labels such as "Click here" or "Read more" without context.
* Ensure the destination is clear from the link text.

</section>

<section>

## Related components
- [Button](/categories/components/button/usage): A button initiates actions that are performed without navigating the user away from their current page.
  
</section>
