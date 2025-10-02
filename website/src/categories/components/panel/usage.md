---
title: Panel usage
tags: usage
eleventyNavigation:
  parent: Panel
  key: PanelUsage
---
<style>
.ds-example > sl-panel {
  max-inline-size: 360px;
}
sl-panel::part(content){
  display: flex;
  gap: 8px;
}
.ds-example > sl-panel::part(content){
  flex-direction: column;
}
.ds-example ul.links {
  list-style:none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 8px;
  flex-direction: column;
}
.ds-example ul.links li {
  border: 1px solid #D0D9E0;
  border-radius: 4px;
  margin: 0;
}
.ds-example ul.links a {
  text-align: center;
  padding: 12px 16px;
  display: flex;
  gap: 6px;
  color: inherit;
  text-decoration: none;
  font-weight: var(--sl-text-typeset-font-weight-demibold);
}
</style>

<section class="no-heading">

<div class="ds-example">
  <sl-panel collapsible heading="6.5 Sneaky Photo Signals">
    <sl-badge slot="aside" emphasis="subtle" color="yellow" size="lg">Draft</sl-badge>
    <p>Find a news article with a striking photo. In 4–6 sentences, tell us what the image really says beyond the caption. Quote a sentence from the article that amplifies the photo.</p>
    <ul class="links">
      <li><a href="#"><sl-icon name="far-eye-slash"></sl-icon> 1. Find a photo-forward story</a></li>
      <li><a href="#"><sl-icon name="far-puzzle-piece-simple"></sl-icon> 2. Answer the questions</a></li>
      <li><a href="#"><sl-icon name="far-puzzle-piece-simple"></sl-icon> 3. Find in the text</a></li>
    </ul>
    <sl-button-bar align="end">
      <sl-button fill="ghost"><sl-icon name="far-file-pen"></sl-icon>Edit</sl-button>
      <sl-button fill="ghost"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
    </sl-button-bar>
  </sl-panel>
</div>

<div class="ds-code">

  ```html
<sl-panel collapsible heading="6.5 Sneaky Photo Signals">
    <sl-badge slot="aside">Draft</sl-badge>
    <p>Find a news article w...</p>

    <ul class="links">
      <li><a href="#"><sl-icon name="far-eye-slash"></sl-icon> 1. Find ...</a></li>
      ...
    </ul>
    
    <sl-button-bar align="end">
      <sl-button fill="ghost"><sl-icon name="far-file-pen"></sl-icon>Edit</sl-button>
      <sl-button fill="ghost"><sl-icon name="far-trash"></sl-icon>Delete</sl-button>
    </sl-button-bar>
  </sl-panel>
  ```

</div>
</section>

<section>

## When to use

### Layout Wrappers
Nesting Panels lets you group subtopics and local controls inside a parent section, improving scanability, and enabling progressive disclosure without overwhelming the page. Panels can be collapsible or always-on to act as structural wrappers. Adjust visual weight using the Density, Border/Divider, and Elevation properties to keep hierarchy clear even without collapse.

### Progressive Content
Use Panel to progressively reveal either interactive controls (filters, advanced settings, long forms) or dense supporting details (explanations, specs, logs) that don’t need to be always visible. Keep them collapsed by default to reduce scanning effort and distraction, and let users expand on demand. Wrap tools related to a specific area of a page (e.g., “Lesson details” actions) so the header acts as a clear anchor. 

</section>


<section>

## When not to use

### Static or Critical Content
For simple, short, non-interactive information, use a plain section or [Card](/categories/components/card/usage) to avoid unnecessary chrome. And never place error messages or critical information inside a collapsible Panel—keep them visible by default.

### Navigation & Routing
Don’t use Panel to switch between sections of an app or page. Panels don’t manage URL state, deep links, or back/forward history, and they’re not optimized for navigating large informations. Use Panels for local content grouping and disclosure only; they can include links, but should not be the mechanism that drives routing.

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

## Density
Panels support two densities to tune information density and comfort:

- **Plain (default):** Slightly compact spacing for data-heavy views, dashboards, or when several Panels appear in a column; helps reduce scroll.
- **Comfortable:** Increased padding for readability in content-first screens, forms, or when a Panel contains mixed media (text + controls + images).

Choose density per layout context; mixing densities on the same screen is possible but keep it consistent within a section.

</section>


<section>

## Elevation
Use elevation to signal layering and emphasis relative to the page background.

- **None (default):** Flat surface. Best for inline sections that should blend with the page layout.
- **Raisen:** Use to separate the Panel from busy backgrounds or when grouping controls needs visual priority.
- **Shuken:** Reserve for floating containers, highly prominent tools, or when the Panel must stand out from surrounding elements.

</section>


<section>

## Header
The header frames the Panel’s title and optional affordances. You can add:

- **Prefix (Icon):** a small, descriptive icon that conveys the section’s purpose (e.g., info, settings, warning).
- **Suffix (Badge):** a compact status/count indicator (e.g., “3”, “Beta”, “New”) aligned with the title to convey state at a glance.

Use prefix/suffix sparingly to keep headings short and readable.

</section>


<section>

## Styling
Improves scannability and grouping, reduces visual clutter, and reinforces hierarchy by separating titles/actions from body content.

- **Border:** Draws a border around the Panel to clearly delimit its area from adjacent content.
- **Divider:** Adds a horizontal rule between header and content; only visible when content is expanded.

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


<script>
const popoverBtn = document.querySelector("#anchor");
const popoverExample = document.querySelector("#popover-1");
const closeBtn = document.querySelector("#close-btn");

requestAnimationFrame(() => {
popoverBtn.addEventListener("click", () => {
    if (popoverExample) {
      popoverExample.togglePopover();
    }
  });

closeBtn.addEventListener("click", () => {
    if (popoverExample) {
      popoverExample.hidePopover();
    }
  });
})
</script>
