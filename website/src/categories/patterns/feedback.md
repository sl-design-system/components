---
title: Feedback
description: How do you communicate feedback and status in a consistent, predictable and reassuring way across your application.
layout: "categories/getting-started.njk"
eleventyNavigation:
  parent: Patterns
  key: Feedback
---

<section>

## A11y - Inline message

### Why is it common to use inline messages with actions?
Inline messages often include a relevant action so users can see what happened and what to do next in one place. Keeping the message and its resolution together reduces navigation and cognitive effort, supports recovery in context, and lets users continue their current workflow.

However, dynamically introduced actions in inline messages can be difficult for assistive-technology and keyboard users to discover reliably.

### Why isn’t it accessible to use inline messages?
1. Screen readers do not automatically announce action roles. If an inline message contains links or buttons, screen reader users hear only the link or button text; they won’t know these elements are actionable.

2. Do not move focus automatically to elements that are not dialogs or alerts. Automatically changing keyboard focus when an inline message appears is poor practice, yet without moving focus users may struggle to locate actions within the message. 

### What did we try to do to make inline messages accessible?
1. Adding invisible text at the end of each action that explains the role of the action. This is a hack and not fully WCAG compliant, but it may slightly improve the screen reader experience when user know that there are some actionable elements inside inline message.

2. Place the inline message as the last element in the page's reading and tab order. Because we cannot move focus to the inline message automatically, provide a consistent location across pages so users know where to expect dynamically added content.

 These experiments were performed only for testing and comparison with alternative solutions. Their results describe limitations of the tested approaches, not proof that inline messages containing actions cannot be made accessible. We recommend the alternative patterns below.

We don’t recommend using Inline message with modifications that we tried, as there are better, more accessible patterns to e.g. inform user about errors.

### What pattern should we follow to inform users of errors?
1. Error summary without actions can be Inline Message.
2. Automatically announced inline error messages for individual fields. Automatic announcement for assistive technologies are supported by default by SLDS form.
3. Dialog or Alert dialog with links to each invalid field.

</section>

<section>

## Pictography

Using pictography you can instantly make clear what a message means to the user, independent of layout or component. Multiple components can reuse the same icons to ensure consistent understanding and predictable behaviour.
This pattern establishes a fixed mapping between meaning, icon, and usage across components.

</section>

<div class="feedback-card">
  <div class="feedback-card__icon-panel">
    <sl-icon name="info" size="3xl" style="color:var(--sl-color-foreground-info-bold)"></sl-icon>
  </div>
  <div class="feedback-card__content">

### Info

Provide neutral information that may be relevant to the user, without urgency or required action.

**Use for**

- Additional context or explanation
- Helpful, non‑critical information

  </div>
</div>

<div class="feedback-card">
  <div class="feedback-card__icon-panel">
    <sl-icon name="circle-check-solid" size="3xl" style="color:var(--sl-color-foreground-positive-bold)"></sl-icon>
  </div>
  <div class="feedback-card__content">

### Success

Confirm that an action has been completed successfully.

**Use for**

- Successful form submissions
- Completed actions or steps
- Positive system states

  </div>
</div>

<div class="feedback-card">
  <div class="feedback-card__icon-panel">
    <sl-icon name="triangle-exclamation-solid" size="3xl" style="color:var(--sl-color-foreground-caution-bold)"></sl-icon>
  </div>
  <div class="feedback-card__content">

### Warning

Indicate that something requires attention, but can still be corrected.

**Use for**

- Validation feedback; this icon appears at the start of the error message underneath the invalid input
- Missing or incorrect input
- Situations that may cause issues if not addressed

  </div>
</div>

<div class="feedback-card">
  <div class="feedback-card__icon-panel">
    <sl-icon name="octagon-xmark-solid" size="3xl" style="color:var(--sl-color-foreground-negative-bold)"></sl-icon>
  </div>
  <div class="feedback-card__content">

### Danger

Warn users about destructive or irreversible actions.

**Use for**

- Deleting content
- Overwriting or permanently changing data

  </div>
</div>

<section>

## Related
- [Callout](/categories/components/callout/): Display persistent, important messages that remain visible as part of the page layout
- [Inline message](/categories/components/inline-message/): Event-driven feedback that appears after a user or system action
- [Form field](/categories/components/form-field/): Provides validation feedback for form controls
- [Progress bar](/categories/components/progress-bar/): Shows task progress and can display success or failure states

</section>
