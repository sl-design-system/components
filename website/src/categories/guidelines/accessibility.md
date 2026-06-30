---
title: Accessibility
eleventyNavigation:
  parent: Guidelines
  key: Accessibility
---

<header class="ds-tokens__main-heading">
<div class="ds-tokens__heading-wrapper">
  <h1 class="ds-heading-1">{{title}}</h1>
  <p class="ds-tokens__heading-description">
  Accessibility ensures our applications are usable by everyone, regardless of their abilities or disabilities.
  </p>
</div>
</header>

<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">

<section>

## Accessible components

Web components in the SL Design System are built with accessibility in mind from the ground up. This means following both the Web Content Accessibility Guidelines (WCAG) and proper ARIA (Accessible Rich Internet Applications) practices.

</section>

<section>

### WCAG compliance

WCAG provides guidelines for making web content accessible to people with disabilities. The guidelines are organized around four principles:

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: User interface components must be operable by all users
- **Understandable**: Information and operation must be understandable
- **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents

Our components aim to meet WCAG 2.1 Level AA requirements by default. This includes proper color contrast ratios, keyboard navigation support, and clear focus indicators.

</section>

<section>

### ARIA implementation

ARIA provides a way to make web content more accessible to people with disabilities, especially those using assistive technologies like screen readers. Our components use ARIA attributes and roles appropriately to:

- Communicate component state (expanded, pressed, selected, etc.)
- Define relationships between elements
- Provide accessible names and descriptions
- Announce dynamic content updates

</section>

<section>

### Beyond ARIA and WCAG

While ARIA and WCAG compliance is essential, truly accessible components also need to consider:

- Keyboard navigation patterns
- Touch target sizes
- Motion and animation preferences
- High contrast modes
- Screen reader announcements
- Focus management

The SL Design System components handle these considerations by default, making it easier for developers to create accessible applications without having to implement these patterns themselves.

</section>

<section>

### Design system is not a guarantee

While the SL Design System components are built with accessibility in mind, using them does not automatically make your application accessible. Application authors still need to:

- **Provide proper content structure**: Use semantic HTML elements and heading levels appropriately to create a logical document outline.

- **Write meaningful text alternatives**: Add descriptive alt text for images and aria-labels for interactive elements that lack visible text.

- **Ensure logical tab order**: Arrange interactive elements in a sequence that makes sense for keyboard navigation.

- **Handle dynamic content**: Manage focus when content changes and use live regions to announce important updates.

- **Create accessible forms**: Add proper labels, error messages, and help text.

- **Test with assistive technologies**: Regularly test with screen readers and keyboard navigation to verify accessibility.

- **Write clear instructions**: Provide clear guidance for complex interactions and error recovery.

- **Maintain accessibility in customizations**: When customizing components, ensure modifications don't break accessibility features.

The design system provides accessible building blocks, but it's up to application developers to use them correctly and fill in the gaps that components alone cannot address.

</section>

<section>

### Note: Safari keyboard focus behavior

For our web components, we strive to replicate the native and web platform as closely as possible.
This means that for some controls (e.g., buttons, links) in Safari, you may experience issues navigating using the `Tab` key. This is due to Safari’s native behavior, which is well known to Safari users who use assistive technologies.  

#### Enabling full keyboard access in Safari

To enable access to all interactive elements in Safari using the `Tab` key, open Safari, go to Settings, select the “Advanced” section, and enable the option “Press Tab to highlight each item on a webpage.” Once this option is enabled, elements that were previously inaccessible via the keyboard should become accessible using the `Tab` key.

</section>


</div>

</section>
