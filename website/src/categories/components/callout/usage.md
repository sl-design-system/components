---
title: Callout usage
tags: usage
eleventyNavigation:
  parent: Callout
  key: CalloutUsage
---
<section>
<div class="ds-example">
  <sl-callout variant="info">
    <span slot="title">Information</span>
    This is an informational callout with helpful context.
  </sl-callout>
</div>

<div class="ds-code">

  ```html
  <sl-callout variant="info">
    <span slot="title">Information</span>
    This is an informational callout with helpful context.
  </sl-callout>
  ```
</div>

</section>

<section>

## When to use

### Use callouts for static contextual information
Callouts are ideal for displaying important information that remains visible as part of the page layout. Use them to provide context, warnings, or helpful information that users need to be aware of while working with the page content.

...

</section>

<section>

## When not to use

### Don't use for dynamic messages
...

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Panel Header	|Top bar that frames the section title and optional affordances. When the panel is collapsible, it hosts the toggle and provides the clickable focus area.|no|
|2|Heading |The Panel title that names the content and sets hierarchy for scanning and accessibility. |no|
|3|Toggle	|Control that opens/closes the panel when collapsible is enabled. |Yes|
|4|Prefix	|Leading element before the heading, typically an icon, that provides quick context. |Yes|
|5|Suffix	|Trailing element aligned with the heading, commonly a badge, for counts, status, or short labels. |Yes|
|6|Actions |Inline tools related to this section (e.g., Edit, Add, overflow menu). Keep concise and contextual. |Yes|
|7|Panel Content |The body area for the panel’s information and controls, visible when expanded and hidden when collapsed. |no|

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Figma Options
With these options, you can tweak the appearance of the popover in Figma. They are available in the design Panel so you can compose the popover to exactly fit the user experience need for the use case you are working on.

### Panel Props
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Elevation|`'None', 'Raised', 'Sunken'`| Visual depth of the panel surface: flat, lifted above, or inset below the page. |
|Density|`'Plain', 'Comfortable'`| Internal spacing: compact for data-dense views or roomier for readability. |
|Outline|`'on', 'of'`| Toggles a border around the panel to delimit its area. |
|Divider|`'on', 'of'`| Shows a separator between header and content (only visible when content is shown). |

{.ds-table .ds-table-align-top}

</div>

### Panel Header Props
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Prefix|`'on', 'of'`| Enables a leading slot before the heading (e.g., an icon). |
|Prefix Instance|`select`| Choose which prefix component appears in the leading slot. |
|Sufix|`'on', 'of'`| Enables a trailing slot after the heading (e.g., a badge). |
|Sufix Instance|`select`| Choose which suffix component appears in the trailing slot. |
|Actions|`'on', 'of'`| Shows an actions area in the header (buttons/menu) for context-specific tools. |

{.ds-table .ds-table-align-top}

</div>

### Panel Body Props
<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Layout|`'Plain', 'full-width', 'Comfortable'`| Controls content padding: standard padding, edge-to-edge content, or increased padding for comfort. |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Behaviours
Let's explore the behaviour of the Panel.

### Nested structure
Supports nesting a Panel inside another to group subtopics and local tools within a parent section. Each Panel keeps its own header, state, and affordances, improving scanability without overwhelming the page.

### Collapsable Toggle
Opens and closes via the header toggle to reveal content on demand. In controlled mode, the component reflects the app’s state (e.g., open=true/false) and “remembers” it across renders and navigation patterns you manage.

### Keyboard Navigation
All interactive elements in the header, including actions and the toggle, are reachable via `Tab` and operable with `Enter` or `Space`. Users can continue tabbing into the content or onward in the page flow.

### Content Divider
The header-content divider only appears when the panel is expanded, using a smooth transition to avoid abrupt layout shifts. This preserves rhythm in dense interfaces while clarifying hierarchy when content is visible.

</section>


<section>

## Related Components

- [Card](/categories/components/card/usage)
- [Accordion](/categories/components/accordion/usage)

</section>