---
title: Spinner accessibility
tags: accessibility
eleventyNavigation:
  parent: Spinner
  key: SpinnerAccessibility
---
<section>

Here are considerations to make the spinner accessible for all users.

</section>


<section> 

## Accessibility Considerations

Here are key considerations to make the spinner usable for all users, including those with disabilities.

  - When updating only a portion of a page, place the spinner in that specific part of the page.

  - If you aren't clear about where to place the spinner, set it where you want the user's attention to be after complete loading.

  - The spinner is unaffected by reduced motion. Disabling it can confuse the user as it might seem like the process has stopped.

</section>


<section>

## WAI-ARIA

{{ 'aria-attributes' | recurringText }}

The spinner itself doesn't have meaning for screenreaders; you can't use it to communicate that the loading is complete. Therefore we hide it for screenreaders using `role` and `aria-hidden` attributes, but you can set some properties on the container where the content is being loaded. You can for example use `aria-busy=true` on a container that is an `aria-live` region to indicate an element is being modified and that assistive technologies may want to wait until the changes are complete before informing the user about the update. 
Live regions (even those set to `polite`) should be used sparingly because you don't want to disturb the user too much. They should be used only in important cases where the user is waiting for feedback on an action they carried out, or when an error or warning that has an impact on the user experience occurs.
</section>
