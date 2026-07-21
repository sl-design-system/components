---
title: Link button usage
tags: usage
eleventyNavigation:
  parent: Link button
  key: LinkButtonUsage
---

<section class="no-heading">

<div class="ds-example">
-
</div>

<div class="ds-code">
-
</div>

</section>

<section>

## When to use
* Navigate to content within the product.
* Link to supporting information such as documentation, FAQs, help articles, or policy pages.
* Direct users to external websites or third-party resources.
* Provide a secondary call to action where navigation is the primary purpose.

</section>

<section>

## When not to use
Do not use a Link Button when the primary purpose is to perform an action rather than navigate. Link Buttons are intended for navigation to another page, view, or resource. If the interaction initiates, changes, submits, or controls something within the current page, use a [Button](/categories/components/button/usage). This includes actions that are performed without navigating the user away from their current page.

</section>

<section>

## Types

### Internal link
Use for destinations within the same product or ecosystem.

* Open in the same tab when the destination is part of the user's primary journey.
* Open in a new tab when users need to preserve their current context, such as during a workflow where supporting information is required.

### External link
Use for destinations outside the product.

* Always opens in a new tab.

</section>

<section>

## Variants
The Link Button is available in both pilled and rectangular shapes, allowing it to align with the visual style of the interface and maintain consistency with other button components.
Both shapes support the same variants, sizes, states, and behaviors as the standard [Button](/categories/components/button/usage) component.
  
</section>

<section>

## Icon Usage

| Situation | Icon |
| --- | --- |
| Standard internal navigation in the same tab | No icon |
| Internal navigation in the same tab with additional emphasis | Arrow right (show icon) |
| Internal navigation in a new tab | Open in new tab icon (show icon) |
| External navigation | `External link icon (show icon) |

{.ds-table .ds-table-align-top}

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

{{ 'components/button/sl-buttons-anatomy.svg' | svgImage }}

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container	|Defines the clickable area of the link button.	|no|
|2|Text label	|Communicates the link's destination or purpose.	|no|
|3|Icon	|Indicates the link's behavior or destination type. |yes|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## States

These states describe what users see when the Date Field is available.

- **Idle:** The default state of the link button before any user interaction occurs.
- **Hover:** Displayed when a user moves the pointer over the link button, indicating that it is interactive.
- **Active:** Displayed while the user is pressing the link button, providing feedback that the interaction has been initiated.
- **Focus:** Displayed when the link button receives keyboard focus, helping users identify which element is currently selected for interaction.
- **Disabled:** Indicates that the link button is unavailable and cannot be interacted with.

</section>


<section>

## Figma Properties

These properties describe the Figma setup for the Link button. Some properties represent real UI behaviour, while others are only used to preview or compose the component in Figma.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Open | `false` `true` | Figma-only preview property that shows or hides the Picker dropdown. The open state is triggered by interaction in the product UI. |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Related components
- [Button](/categories/components/button/usage): Standalone calendar for date selection or date browsing.

</section>

