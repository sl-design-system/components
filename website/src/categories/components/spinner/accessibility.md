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

WAI-ARIA Roles, States, and Properties for an spinner provide essential information to assistive technologies and screen readers. They convey the spinner's role and additional properties to ensure accessibility and a better user experience for individuals using assistive technology.

|Attribute|Value|Description|User supplied  <sl-icon name="info" aria-describedby="tooltip1" size="md"></sl-icon><sl-tooltip id="tooltip1">Specifies whether the attribute is always set in the component (no) or it needs to be provided by the developer (yes)</sl-tooltip>|
|-|-|-|-|
|`role`| `'status', 'alert'` | Determines the importance of the data that is coming. Set to `status` by default. See [Note 1] below for more explanation.| yes |

{.ds-table .ds-table-align-top}

**Notes:** 
1. The role `status` is set by default and it defines a live region containing advisory information. The role `alert` can also be used for more critical events; when sending a form or something else that was directly triggered by user interaction. `status` can be used when loading cards or additional data on scroll for example; something the user will encounter when they continue to navigate a page.
</section>
