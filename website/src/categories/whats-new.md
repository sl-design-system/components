---
title: What's new
eleventyNavigation:
  parent: Pages
  key: What's new
  order: 2
---
<header class="ds-tokens__main-heading">
<div class="ds-tokens__heading-wrapper">
  <h1 class="ds-heading-1">{{title}}</h1>
  <p class="ds-tokens__heading-description">
  Find out what's happening world of Sanoma Learing Design System.
  </p>
</div>
</header>


<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">

<section>

## Version 1.0 Milestone, Developer-Focused Enhancements, and Issue Tracking
<small>May 2024</small>

### Introducing 1.0 Versions of SLDS Components

The SLDS team is excited to share that our components, including Angular, Button, Card, Checkbox, Dialog, Form, Icon, Popover, RadioGroup, Skeleton, Spinner, Switch, TextArea, TextField, and Tooltip, have all reached their 1.0 versions. With this release, we’re officially adopting semantic versioning, aligning with the major.minor.patch versioning scheme to ensure consistency and predictability in our updates.

### GitHub Issue Templates

We’ve updated our GitHub with new issue templates to streamline the process of reporting bugs, requesting features, and suggesting new components. You can find these templates at our GitHub issues page. This update allows you to create issues for:

- Bug Reports
- Documentation
- Figma Toolkit
- Feature Requests
- New Components

Previously, you could only report bugs, but now you can also request new components. We’ve created issue templates for the Figma toolkit and documentation, empowering you to submit and monitor directly through GitHub.

**Please note, Figma comments will no longer be monitored due to tracking difficulties. For all matters, including those related to the Figma toolkit, kindly submit an issue on GitHub.**

**Important**: Ensure you’re logged into your GitHub account to create issues.

<img src="/assets/images/whats-new/2024-05-issue-template-light.png" class="light-only"/>
<img src="/assets/images/whats-new/2024-05-issue-template-dark.png" class="dark-only"/>

### Developer Resources

Developers can now find all necessary information about a component on its detail page on our documentation website, sanomalearning.design. This includes the component’s status, exact version, and links to the changelog, code, and storybook. The statuses indicate the maturity of the component:

- **Draft**: Active development, not ready for use.
- **Preview**: Ready for use, available in all themes, but not yet used by CFAs.
- **Stable**: Mature and used by CFAs.
- **Deprecated**: This will be removed in the future and should be avoided.

<img src="/assets/images/whats-new/2024-05-resources-light.png" class="light-only" />
<img src="/assets/images/whats-new/2024-05-resources-dark.png" class="dark-only" />

### Form Enhancements for Better User Experience

Our forms have been significantly improved to support composite fields, allowing for a main control linked to the field’s label and help text, with secondary controls for more complex inputs. This update is particularly useful for fields like radio groups with an “other” option that triggers a text field.

We’ve also introduced:
- A new Lit `FormController` reactive controller for managing form state
- A new pristine/dirty and touched/untouched state
- A new `<sl-form-validation-errors>` component for displaying validation errors
- The ability to set the `value` of the form on the `<sl-form>` component
- The ability to use nested & array names in the `name` attribute of form controls
- Unregistering controls & fields when they are removed from the DOM

### Naming Consistency and Styling Updates

- The `<sl-textarea>` component has been renamed to `<sl-text-area>` for naming consistency.
- The `<sl-inline-message>` component has been updated with improved styling and now includes an action slot for buttons.

### Introducing the ‘Info’ Button Variant

A new `info` button variant has been added, designed to fit into the `action` slot of the `sl-inline-message` component, providing users with additional actionable information.

<img src="/assets/images/whats-new/2024-05-inline-message-light.png" class="light-only" />
<img src="/assets/images/whats-new/2024-05-inline-message-dark.png" class="dark-only" />

### Commitment to Accessibility and Browser Compatibility

In our ongoing commitment to accessibility, the checkbox component has been refactored to use a native checkbox input. We’ve also fixed the issue with Accordion icons in Safari when zooming, ensuring a consistent experience across different browsers.

</section>

<section>

## The Checkbox documentation is now live!
<small>08-11-2023</small>

Dive into the details on when and how to effectively use checkboxes, and discover accessible implementation techniques. Explore [the guide](/categories/components/checkbox) to ensure seamless integration and a good user experience.

</section>

<section>

## We released a pilot version of our first component!
<small>10-10-2023</small>

The button component is released as your first taste of the SL Design System to come. You can check out [the documentation page](/categories/components/button) and even start implementing a button or two in a test project to see how everything works.

</section>
</div>
</section>
