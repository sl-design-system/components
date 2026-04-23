---
title: Feedback
eleventyNavigation:
  parent: Patterns
  key: Feedback
---

<header class="ds-tokens__main-heading">
<div class="ds-tokens__heading-wrapper">
  <h1 class="ds-heading-1">{{title}}</h1>
  <p class="ds-tokens__heading-description">
    How do you communicate feedback and status in a consistent, predictable and reassuring way across your application.
  </p>
</div>
</header>

<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">

<section>

Using pictography you can instantly make clear what a message means to the user, independent of layout or component. Multiple components can reuse the same icons to ensure consistent understanding and predictable behaviour.
This pattern establishes a fixed mapping between meaning, icon, and usage across components.

</section>

<section>

## <sl-icon name="info" style="color:var(--sl-color-foreground-info-bold)"></sl-icon> Info 

### Purpose
Provide neutral information that may be relevant to the user, without urgency or required action.

### Use for
- Additional context or explanation
- Helpful, non‑critical information

</section>

<section>

## <sl-icon name="circle-check-solid" style="color:var(--sl-color-foreground-positive-bold)"></sl-icon> Success 

### Purpose
Confirm that an action has been completed successfully.

### Use for
- Successful form submissions
- Completed actions or steps
- Positive system states

</section>

<section>

## <sl-icon name="triangle-exclamation-solid" style="color:var(--sl-color-foreground-caution-bold)"></sl-icon> Warning 

### Purpose
Indicate that something requires attention, but can still be corrected.

### Use for
- Validation feedback; this icon appears at the start of the error message underneath the invalid input 
- Missing or incorrect input
- Situations that may cause issues if not addressed

</section>

<section>

## <sl-icon name="fas-octagon-xmark" style="color:var(--sl-color-foreground-negative-bold)"></sl-icon> Danger

### Purpose
Warn users about destructive or irreversible actions.

### Use for
- Deleting content
- Overwriting or permanently changing data

</section>

<section>

## Related
- [Callout](/categories/components/callout/): Display persistent, important messages that remain visible as part of the page layout
- [Inline message](/categories/components/inline-message/): Event-driven feedback that appears after a user or system action
- [Form field](/categories/components/form-field/): Provides validation feedback for form controls
- [Progress bar](/categories/components/progress-bar/): Shows task progress and can display success or failure states

</section>

</div>

</section>
