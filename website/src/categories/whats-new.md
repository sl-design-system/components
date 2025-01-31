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
  Find out what's happening in the world of Sanoma Learning's Design System.
  </p>
</div>
</header>

<section class="ds-subpage-section">

<div class="ds-subpage-section__wrapper">
<section>
  
## SL Design System Update
<small>January 2025</small>

### New Components
- [Proof of Concept of Tree](https://storybook.sanomalearning.design/?path=/story/navigation-tree--flat-data-source) <ds-status status="draft"></ds-status>
- [Panel](https://storybook.sanomalearning.design/?path=/story/layout-panel--basic) <ds-status status="draft"></ds-status>

### Improvements & Maintenance
- [Make it possible to use paginator component with FetchDataSource](https://storybook.sanomalearning.design/?path=/story/grid-pagination--data-source-2) 
- [Added pill-shaped buttons and implemented new contextual tokens in the button component](https://storybook.sanomalearning.design/?path=/story/actions-button--all)
- [Implemented new contextual tokens in the badge component](https://storybook.sanomalearning.design/?path=/story/feedback-status-badge--all)

### Solved Accessibility Issues
- [Accessibility features are not correctly marked/missing in the select element](https://github.com/sl-design-system/components/issues/1490)
- [Accordion with external toggle give no status for a screen reader](https://github.com/sl-design-system/components/issues/1559)
- [Inline messages reading order is unconventional](https://github.com/sl-design-system/components/issues/1558)
- [Fix skip table links when at viewport edge](https://github.com/sl-design-system/components/issues/1689)
  
</section>
<section>
  
## Accessibility Audit, new components and further updates
<small>December 2024</small>

### Accessibility Audit
Accessibility is a core focus for us, and we recently conducted an accessibility audit with an external agency to evaluate all our components. We're pleased to report that only a few accessibility issues were identified during the audit. You can view the complete audit overview [here](https://github.com/orgs/sl-design-system/projects/2/views/63). Our goal is to resolve all identified issues by January 2025.

### Timeline New Components
Last period, we did a survey where all products using the SL Design System participated to figure out which components should have the highest priority. In the survey, we showed all requested components and asked about their UX impact, how high they are on the roadmap, and what the requirements are. We used the 'RICE' framework to calculate the priority for each request. Turns out, the Number Field, Tree View, Date Picker, and Time Picker are the big winners.

[Here](https://github.com/orgs/sl-design-system/projects/5) you can find the timeline for the design and development of the new components.

### Contextual Tokens and Unified Figma Library
The past period, the team has been working hard on contextual tokens. Right now, the SL Design System is using component-specific tokens. By making our tokens contextual instead of component-specific, we’re improving UI consistency across all products. 

We’re currently refactoring our components in code to use the new contextual token setup. At the same time, there are some big changes coming in Figma. Right now, every product has its own Figma library with SL Design System components. The goal is to have a single Figma library with one theme that works for all products. Designers will be able to switch between themes directly in this library using Figma Variables.

In the end, this will make the SL Design System team more efficient—less maintenance and more time to focus on new components, patterns, and enhancements. For products, it means more consistent UI design overall.

### New Components
- [Paginator](https://storybook.sanomalearning.design/?path=/story/navigation-paginator--all) <ds-status status="draft"></ds-status>

### Solved Bug Reports
- [Rendering the correct column widths when the data grid contains only a few elements](https://github.com/sl-design-system/components/issues/1677)
- [DATA-SOURCE is missing a declaration file](https://github.com/sl-design-system/components/issues/1678)
- [Numeric sort behavior in Grid](https://github.com/sl-design-system/components/issues/1651)
- [Custom sort function in Grid](https://github.com/sl-design-system/components/issues/1643)
- [Improve performance of large option sets in Grid](https://github.com/sl-design-system/components/issues/1604)

### Solved Figma Issues
- [FA icon disappears / changes to text inside button component](https://github.com/sl-design-system/components/issues/1482)

### Accessibility Improvements
- [Create an aria live container on page](https://github.com/sl-design-system/components/issues/1597)
- [Tabs aren't correctly marked for screen reader](https://github.com/sl-design-system/components/issues/1560)
- [Switch is not correctly marked for screen reader](https://github.com/sl-design-system/components/issues/1561)
- [Checkbox has redundant aria role and property](https://github.com/sl-design-system/components/issues/1553)
  
</section>
<section>
  
## New Components, Bug fixes, and enhancements
<small>September 2024</small>

### Update in Figma
To simplify things, we’ve created a new Formfield component that includes a label, description, validation message, and a slot for the form control itself. This makes it easier for the Design System team to manage everything, while you only need to use one component for all your form controls!

- Older Components: The old form controls (Label, Hint/Helper, Checkbox, Radio Button, Switch, Text Input, Text Area) are now marked as "[DEPRECATED]" and hidden from the library. These should no longer be used in new designs.
- New Components: We’ve introduced new versions of these form controls with improved functionality, labeled with "-NEW" at the end for easy identification.
- Formfield Component: We’ve added a new Formfield component that wraps the updated controls for more consistency. This should now be your go-to component for forms.
You can find these updates in the Formfield folder in the assets panel.

### New components and status changes
- [Combo box](https://storybook.sanomalearning.design/?path=/story/form-combobox--all) <ds-status status="draft"></ds-status>
- [Tag](https://storybook.sanomalearning.design/?path=/story/navigation-tab-group--basic) <ds-status status="preview"></ds-status>
- [Made toggle group available in all themes](https://storybook.sanomalearning.design/?path=/story/actions-toggle-group--all) <ds-status status="draft"></ds-status>
- [Tab group](https://storybook.sanomalearning.design/?path=/story/navigation-tab-group--basic) <ds-status status="stable"></ds-status>
- [Toggle group](https://storybook.sanomalearning.design/?path=/story/navigation-tab-group--basic) <ds-status status="draft"></ds-status>
- [Toggle button](https://storybook.sanomalearning.design/?path=/story/actions-toggle-group--all) <ds-status status="preview"></ds-status>

### Solved Bug reports
- [Various grid fixes](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md)
- [Clicking a label doesn't always focus the form control](https://github.com/sl-design-system/components/pull/1536)
- [Slow Font Awesome icon load](https://github.com/sl-design-system/components/pull/1483)

### Enhancements
- [Added reset for forms](https://github.com/sl-design-system/components/pull/1500)
- [Added 4XL Avatar size](https://storybook.sanomalearning.design/?path=/story/media-avatar--all)
- [Various menu improvements](https://github.com/sl-design-system/components/pull/1474)

</section>

<section>
  
## New Components and Key Bugfixes Rolled Out, Including Tool-Bar, Checkbox Group, and Enhanced Styling
<small>July 2024</small>

### New components and status changes
- [Tool bar](https://storybook.sanomalearning.design/?path=/story/components-tool-bar--basic) <ds-status status="draft"></ds-status>
- [Panel](https://storybook.sanomalearning.design/?path=/story/layout-panel--basic) <ds-status status="draft"></ds-status>
- [Progress bar](https://storybook.sanomalearning.design/?path=/story/components-progress-bar--basic) <ds-status status="preview"></ds-status>
- [Message dialog](https://github.com/sl-design-system/components/blob/main/packages/components/message-dialog/CHANGELOG.md) <ds-status status="stable"></ds-status>

### Bug fixes
- [Checkbox group bugfix for initial checked state](https://github.com/sl-design-system/components/blob/main/packages/components/checkbox/CHANGELOG.md)
- [Form field custom label styling fix](https://github.com/sl-design-system/components/blob/main/packages/components/form/CHANGELOG.md)
- [Various message dialog fixes](https://github.com/sl-design-system/components/blob/main/packages/components/message-dialog/CHANGELOG.md)
- [Fix avatar line-height bug](https://github.com/sl-design-system/components/blob/main/packages/components/avatar/CHANGELOG.md)
- [Fix inline size behavior of dialog](https://github.com/sl-design-system/components/blob/main/packages/components/dialog/CHANGELOG.md)
  
### Enhancements
- [Add size property to button-bar](https://github.com/sl-design-system/components/blob/main/packages/components/button-bar/CHANGELOG.md)
- [Accordion item summary slottable](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md)
- [Improve breadcrumbs hover state by changing text decoration thickness](https://github.com/sl-design-system/components/blob/main/packages/components/breadcrumbs/CHANGELOG.md)

</section>

<section>

## Enhancements and Insights: New Components, Bug Fixes, Styling, and Workshops
<small>June 2024</small>

### New components
- [button bar](/categories/components/button-bar/usage/) <ds-status status="stable"></ds-status>
- [emoji browser](https://storybook.sanomalearning.design/?path=/story/components-emoji-browser--basic&globals=viewport:default) <ds-status status="draft"></ds-status>
- [format date component](https://storybook.sanomalearning.design/?path=/story/utilities-format-date--basic&args=dateStyle:medium;locale:en-GB;month:2-digit) <ds-status status="draft"></ds-status>
- [search field](/categories/components/search-field/usage/) <ds-status status="preview"></ds-status>

### Bug fixes in several components
- [accordion](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md)
- [avatar](https://github.com/sl-design-system/components/blob/main/packages/components/avatar/CHANGELOG.md)
- [checkbox](https://github.com/sl-design-system/components/blob/main/packages/components/checkbox/CHANGELOG.md)
- [select](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md)
- [spinner](https://github.com/sl-design-system/components/blob/main/packages/components/spinner/CHANGELOG.md)
- [switch](https://github.com/sl-design-system/components/blob/main/packages/components/switch/CHANGELOG.md)
- [tabs](https://github.com/sl-design-system/components/blob/main/packages/components/tabs/CHANGELOG.md)
- [tooltip](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md)
  
### Styling updates in
- [dialog](https://github.com/sl-design-system/components/blob/main/packages/components/dialog/CHANGELOG.md)
- [warning color palettes of Sanoma Learning and Editorial suite](https://storybook.sanomalearning.design/?path=/story/components-button--all) (this change impacts the styling of multiple components)

### Data Grid Workshop
We recently conducted a workshop with all UX designers across our products to define the requirements for our data grid. It marked our first large-scale collaboration on a common component, which was a great experience. Together, we identified the core functionalities of our data grid. Currently, the SL Design System team is in the process of planning the design and development of these features.

### Combobox survey
We sent out a survey to gather input from all UX Designers to define the core functionalities of our combobox. The SL Design System is currently developing the basic design and will incorporate additional features based on any essential requirements identified by the CFAs for our combobox component.

</section>

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
