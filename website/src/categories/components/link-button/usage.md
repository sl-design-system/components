---
title: Link button usage
tags: usage
eleventyNavigation:
  parent: Link button
  key: LinkButtonUsage
---

<section class="no-heading">

Example

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
Use for destinations outside the product or organization domain.

* Always opens in a new tab.
* Always displays an external link icon

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
| Internal navigation in the same tab with additional emphasis | <sl-icon name="arrow-right"></sl-icon> |
| Internal navigation in a new tab | <sl-icon name="square-arrow-up-right"></sl-icon> |
| External navigation | <sl-icon name="arrow-up-right-from-square"></sl-icon> |

{.ds-table .ds-table-align-top}

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

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

These states describe what users see when the Link button is shown.

- **Idle:** The default state of the link button before any user interaction occurs.
- **Hover:** Displayed when a user moves the pointer over the link button, indicating that it is interactive.
- **Active:** Displayed while the user is pressing the link button, providing feedback that the interaction has been initiated.
- **Focus:** Displayed when the link button receives keyboard focus, helping users identify which element is currently selected for interaction.
- **Disabled:** Indicates that the link button is unavailable and cannot be interacted with.

</section>


<section>

## Content guidelines
* Use concise, descriptive labels.
* Avoid generic labels such as "Click here" or "Read more" without context.
* Ensure the destination is clear from the link text.

</section>

<section>

## Figma Properties

These properties describe the Figma setup for the Link button.

<div class="ds-table-wrapper">

| Item | Options | Description |
| --- | --- | --- |
| Type | `solid` `outline` `ghost` `link` | There are four types to choose from so you can differentiate between buttons, depending on how essential they are. |
| Variant | `primary` `secondary` `inverted` `info` `caution` `positive` `negative` `disabled` | Defines the semantic variant of the Link button. |
| State | `idle` `hover` `active` `disabled` | Defines the current interaction state of the Link Button. |
| Size | `sm` `md` `lg` | Defines the size of the Link Button. |
| Link type | `internal` `external` | Defines whether the destination is within or outside the product. |
| Open in | `same tab` `new tab` | Defines whether the destination opens in the current tab or a new browser tab. The corresponding icon is displayed automatically. |
| Label | `text` | Defines the text displayed in the Link Button. |
| Internal arrow | `boolean` | Adds an optional arrow-right icon to emphasize internal navigation. Only available for internal links that open in the same tab. |
| Focus ring outside | `boolean` | Displays the focus indicator outside the Link Button. |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Related components
- [Button](/categories/components/button/usage): A button initiates actions that are performed without navigating the user away from their current page.
  
</section>

