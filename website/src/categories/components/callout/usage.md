---
title: Callout usage
tags: usage
eleventyNavigation:
  parent: Callout
  key: CalloutUsage
---
<style>
.title {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  font-family: inherit;
  margin: 0;
}
.ds-example sl-callout a {
  color: var(--sl-color-component-link-idle, var(--sl-color-link-idle));
}
</style>

<section class="no-heading">

<div class="ds-example">
  <sl-callout variant="info">
    <h2 class="title" slot="title">Practice mode</h2>
    Answers in practice mode are not graded. You can retry each question as many times as you need. Check the <a href="javascript:void(0)">grading policy</a> for more details.
  </sl-callout>
</div>

<div class="ds-code">

  ```html
  <sl-callout variant="info">
    <h2 slot="title">Practice mode</h2>
    Answers in practice mode are not graded. You can retry each question as many times as you need. Check the
    <a href="/grading-policy">grading policy</a> for more details.
  </sl-callout>
  ```
</div>

</section>

<section>

## When to use

### Persistent Context
Use Callout when guidance should stay visible because it remains relevant while the user continues working. It can be placed at the page level or within a specific section to support scanning without interrupting the flow. This includes informational notes such as policy reminders and setup requirements, and caution states such as offline mode, unsaved changes, or incomplete setup.

### Suggested Actions
Use Callout when the message benefits from interactions to improve usability. The action should be clear, specific, and directly related to resolving the caution or progressing the task. It can be a button that performs an action such as saving, uploading, or editing, or a link that navigates the user to a relevant destination, such as a settings page or a user profile.

This ability to host actions is exclusive to Callout. [Inline message](/categories/components/inline-message/) stays non-interactive.

</section>


<section>

## When not to use

### Immediate Feedback
Avoid Callout for event-driven messages that are short-lived or optional to keep on screen. If the user can safely ignore or dismiss the information without losing page context, a persistent Callout adds unnecessary noise. Use an [Inline message](/categories/components/inline-message/) instead.

### Complex Scenarios
Avoid Callout when the user must complete multiple steps, compare options, or follow a decision path, and when the situation is critical and must be resolved before continuing. Callouts should stay lightweight and can be overlooked. Use a dedicated page for richer guidance, and a [Dialog](/categories/components/dialog/) pattern for blocking interruptions.

</section>


<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional |
| - | - | - | - |
| 1 | Container | Fixed area within the layout at page or section level. | no |
| 2 | Icon | Indicates meaning and intent, especially for caution. | yes |
| 3 | Title | Short text describing the situation and its impact. | no |
| 4 | Description | Main message text. Can appear without a title. | yes |
| 5 | Content | Optional slot for custom content, mainly buttons and links. | yes |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Variants
Use variants to match the intent of the message and the level of emphasis needed.

- **Info (default):** Provides persistent guidance or contextual notes.
- **Success:** Confirms a state or outcome that remains relevant in the layout.
- **Warning:** Highlights risk, incomplete setup, or conditions that may affect outcomes.
- **Danger:** Indicates a problem that may block progress or requires attention.

</section>


<section>

## Density
Density sets the spacing of the Callout to match the content and the surrounding layout.

- **Default:** Standard spacing for most pages.
- **Relaxed:** More breathing room for long text, lower visual noise, or touch-friendly layouts.

</section>


<section>

## Behaviours
Callout behaviours focus on persistence, placement in the layout, and lightweight interactions.

### Layout Element
It is intentionally placed and remains visible within the page structure, near the content it relates to. It is not event-driven or temporary, and it remains visible in the layout even after the user completes any actions within it.

### Interaction model
Callouts can include interactive elements, but interactions should stay simple. Prefer a single button, and use links only for simple navigation to a relevant destination, such as settings or a related page. Avoid multiple competing actions.

### Content guidelines
Choose an icon that reinforces the intent, and keep the copy concise. Aim for a short caution statement and, if necessary, a single sentence describing the consequence. If an action is present, it should clearly resolve or progress the situation.

### Relationship to [Inline message](/categories/components/inline-message/)
Callout is placed in the layout to provide persistent context and can host actions. [Inline message](/categories/components/inline-message/) is event-driven feedback after an action and stays non-interactive.

</section>


<section>

## Figma Properties

<div class="ds-table-wrapper">

| Item | Options | Description |
| - | - | - |
| Variant | `info`, `success`, `warning`, `danger` | Sets the semantic intent of the Callout. |
| Density | `default`, `relaxed` | Sets the spacing density for the Callout. |
| Show Title | `boolean` | Controls whether the title is displayed. |
| Title | `text` | Title text shown when Show Title is enabled. |
| Description | `text` | Main message text displayed in the Callout. |
| Show Content | `boolean` | Controls visibility of the callout content. |
| Swap Slot | `select` | Swaps the slot component placed in the callout for your custom content component. |
| Icon | `nested component` | Nested icon instance used in the Callout. |

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Related components

- [Inline message](/categories/components/inline-message/): Event-driven feedback that appears after a user or system action and remains non-interactive.
- [Dialog](/categories/components/dialog/): A blocking surface for critical acknowledgements or confirmations. Unlike [Inline message](/categories/components/inline-message/), it interrupts the flow so it can’t be missed.

</section>
