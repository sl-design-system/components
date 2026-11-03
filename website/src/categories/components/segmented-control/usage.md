---
title: Segmented control usage
tags: usage
eleventyNavigation:
  parent: Segmented control
  key: SegmentedControlUsage
---

</section>

<section>

## Similar components

### Differences

* **Tabs** change which content is shown. One section is always active. Can be linked to.
* **Segmented control** changes how the content is presented. One section is always active.
* **Toggle group** applies an action to content, or filters the content (chips variant). Any number of sections can be active, including none.

### How to decide

Most important:

* Does choosing an option show a type of content that wasn't on the page before? Yes → Tabs
* Could a user want to select two of the options at once, or none at all? Yes → Toggle group (actions) / to be decided (filters)
* Can the user apply different actions to content between options? Yes → Tabs

Also check:

* Is each option an action being applied, rather than a value being chosen? Yes → Toggle group
* Do you need a URL to a selected option? Yes → Tabs
* Do you need more than 5 options? Yes → Tabs / Select

Use a segmented control only when all answers are no.

### Comparison table

<div class="ds-table-wrapper">

| | Tabs | Segmented control | Toggle group |
| --- | --- | --- | --- |
| What changes | Which content is shown | How the content is displayed | What action is applied to the content |
| Selection model | Always one option selected | Always one option selected | One, several or no options selected |
| "Nothing selected" valid? | No | No | No |
| Linkable / routable | Yes | No | No |
| Option count | Many (with overflow) | 2–5, fixed | Small, fixed |
| Overflow handling | "More" button | None | None |
| Content | Label, icon or both | Label, icon or both | Label, icon or both |
| Typical placement | Above the section it controls | Above or beside the content it renders | Toolbars, above the content it acts on |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional |
| --- | --- | --- | --- |
| 1 | Container | Holds the controls. | no |
| 2 | Control | One option. One control is selected at a time, and one is selected by default. | no |
| 3 | Label | Shown in the icon + text and text only variants. | yes |
| 4 | Icon | Shown in the icon + text and icon only variants. | yes |

{.ds-table .ds-table-align-top}

</div>

</section>

<section>

## Content

Sets what each control shows.

* **Icon + text** (default): icon and label.
* **Text only**: label only.
* **Icon only**: icon only. Has a shorter selection indicator.

</section>

<section>

## Emphasis

* **Subtle** (default): the selected control has a short selection indicator under it.
* **Bold**: use to put more visual emphasis on the component, when:
  * it's the page's main view switch,
  * it's the only segmented control on the screen,
  * it isn't placed under tabs, and
  * it isn't next to a primary button.

</section>

<section>

## Size

* **Medium (`md`)** (default)
* **Large (`lg`)**: use in touch-first and child-facing products, and for a page's single main view switch in a spacious layout.

</section>

<section>

## Width

...

* **Hug** (default): ...
* **Fill**: ...

</section>

<section>

## Shape

Visual treatment of the segmented control. Use the value that matches the context.

* **Rect** (default)
* **Pill**

</section>

<section>

## Fill

Visual treatment of the segmented control. Use the value that matches the context.

* **Outline** (default)
* **Solid**

</section>

<section>

## Number of controls

* **2 to 5** controls. Controls 3, 4 and 5 can be turned on or off; all 5 are on by default.

</section>

<section>

## Content guidelines

* Use short, clear labels.
* Keep labels to 1–2 words in English. They may be longer in Dutch, Finnish or Polish and break the layout.
* If labels can't be shortened without losing clarity, use Select or Combobox.
* Use the icon-only only when icons remain clear.
* Replace with Select when the control no longer fits.

</section>

<section>

## Related components

* **Tabs**: change which content is shown. Use for navigation, linkable options or a different subject.
* **Toggle group**: applies actions to content. Any number of options can be active, including none.
* **Select**: for more than 5 options, and the fallback when the segmented control doesn't fit.
* **Radio group**: for a choice that is part of a form.
* **Switch**: for a single on/off setting.
* **Combobox**: for long option labels.

</section>

<section>

## Open questions

* Selecting an option display a detail view - is that a case for seg. control or tabs?
* The Similar components section at the top doubles the Related components section. Should they be merged, or should one be removed?
* Do we need a Behavior section in this doc?

</section>
