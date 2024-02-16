---
title: Inline message usage
tags: usage
eleventyNavigation:
  parent: Inline message
  key: InlineMessageUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-inline-message variant="info">
                      Inline message
                      <span slot="description">A place for additional description of the inline message</span>
                      <span slot="details">A place fore more details like errors list</span>
  </sl-inline-message>
</div>

<div class="ds-code">

  ```html
    <sl-inline-message>
  ...
    </sl-inline-message>
  ```

</div>

</section>

<section>

## When to use

### Contextual messages
Use an inline message to provide additional context or supporting information to a particular UI element or function.

### Real-time feedback
Use an inline message to provide real-time feedback with information about what's going to happen or has happened.


</section>

<section>

## When not to use

### Critical information
Avoid using inline messages for critical system-level messages such as errors (e.g. loss of functionality). For critical messages, a component that partially or fully interrupts the user experience is more appropriate.

### Single input
Avoid using inline messages to add context to a single input (e.g. text input). Use a hint instead.

</section>

<section>

## Variants

Inline messages come in various flavors, each suited for specific situations:
Info: For general informative messages.
Success: To indicate successful completion of an action.
Danger: To highlight critical errors or issues.
Warning: For potential problems that need attention.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional|
|-|-|-|-|
| 1 | Icon | Indicates the status or intent. |No|
| 2 | Title	| Reinforces the message text. |No|
| 3 | Message | Communicates what’s about to happen or has happened.| Yes |
| 4 | Close button	| Icon button for closing the dialog | Yes |

{.ds-table}

</div>

</section>

<section>

## Options

...

</section>
