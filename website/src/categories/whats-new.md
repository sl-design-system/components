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
<small>January 2026</small>

Here’s an update on what we’ve been working on recently:

### New Components and Features
- **Calendar** - New version of the component with improved styling and accessibility. <ds-status status="draft"></ds-status>
- **Shared** - New utilities added to the shared package for potential reuse across components:
  - `dateListConverter` - Utility for date list conversions
  - `NewFocusGroupController` - Utility for focus management
  
  Both utilities are currently used in the Calendar component and have been added to `@sl-design-system/shared` for potential reuse in other packages in the future.

### Other Improvements
We have been working on a lot of bug fixes, the details can be found on our [release notes page](https://github.com/sl-design-system/components/blob/main/RELEASE_NOTES.md). The following components have one or more issues resolved:
- [`accordion`](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md)
- [`announcer`](https://github.com/sl-design-system/components/blob/main/packages/components/announcer/CHANGELOG.md)
- [`combobox`](https://github.com/sl-design-system/components/blob/main/packages/components/combobox/CHANGELOG.md)
- [`date-field`](https://github.com/sl-design-system/components/blob/main/packages/components/date-field/CHANGELOG.md)
- [`number-field`](https://github.com/sl-design-system/components/blob/main/packages/components/number-field/CHANGELOG.md)
- [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md)
- [`tabs`](https://github.com/sl-design-system/components/blob/main/packages/components/tabs/CHANGELOG.md)

### Documentation Updates
- [Number Field](/categories/components/number-field/code/) - API documentation has been improved.

</section>
<section>

## SL Design System Update
<small>August - December 2025</small>

Here's an update on what we've been working on recently:

### New Components
- **Callout** is a new component, visually similar to the inline-message but with a different purpose: it can be used to provide additional, non-interrupting information and may include actions (e.g. buttons). Unlike inline-message, it's not meant to be shown/hidden dynamically in response to user actions. <ds-status status="draft"></ds-status>
- **Time Field** component is now available for time input with a built-in time picker dialog. <ds-status status="draft"></ds-status>
- **Virtual List** is a new utility package that provides a virtual scrolling solution based on `@tanstack/virtual-core`. <ds-status status="draft"></ds-status>

### Component Status Updates
- **Menu** has been promoted from draft to preview. <ds-status status="preview"></ds-status>
- **Number Field** has been promoted from draft to preview. <ds-status status="preview"></ds-status>
- **Tag** has been promoted from draft to preview. <ds-status status="preview"></ds-status>
- **Tree** has been promoted from draft to preview and now supports sorting. <ds-status status="preview"></ds-status>

### Major Component Updates
- **Angular** now requires Angular 19.0 or higher (tested with Angular 21.0) and TypeScript 5.9.0 or higher. Support for Angular 18 has been removed. The package also includes new bindings for `<sl-time-field>`, `<sl-combobox>`, and `<sl-number-field>`.
- **Accordion** has a new `iconType` property that allows you to use a chevron icon instead of plus/minus, and now uses contextual tokens for styling. <ds-status status="stable"></ds-status>
- **Avatar** has new `color`, `emphasis` and `shape` properties for easier customization (similar to `<sl-badge>`). <ds-status status="stable"></ds-status>
- **Badge** can now have a label on `sm` badges; this will be shown behind the dot. <ds-status status="stable"></ds-status>
- **Breadcrumbs** has a new `hideHomeLabel` property to allow hiding the "Home" label text in the first home breadcrumb. <ds-status status="stable"></ds-status>
- **Button** now supports `aria-disabled="true"` to disable a button while keeping it focusable (useful for tooltips). <ds-status status="stable"></ds-status>
- **Button Bar** has new `fill` and `variant` properties that will apply to all buttons inside the button bar. <ds-status status="stable"></ds-status>
- **Form** now supports more than 1 form control per field. <ds-status status="stable"></ds-status>
- **Icon** now supports Font Awesome 7.1 and scales with the text size when no explicit size is set. <ds-status status="stable"></ds-status>
- **Panel** has improved `density` property values - use `default` and `relaxed` going forward. The `plain` and `comfortable` values are deprecated, they will be kept for backward compatibility for now but removed in the future. <ds-status status="draft"></ds-status>
- **Search Field** now debounces the `sl-search` event while typing with a default delay of 300ms. <ds-status status="preview"></ds-status>
- **Select** now automatically adjusts its width based on the largest option available. <ds-status status="stable"></ds-status>
- **Tabs** has updated styling to align with Figma design (increased width and border radius of the indicator). <ds-status status="stable"></ds-status>
- **Tool Bar** has major improvements including a new `contained` property to enable contained mode, keyboard navigation support for arrow keys when toolbar is focused, and an `inverted` property for the divider component. The overall styling has been improved and overflow behavior issues have been fixed. The `no-border` property has been removed; the border now only shows in `contained` variant (except when `inverted`). When updating to this version of the tool-bar while also using a panel, make sure to update the panel to version v0.3.1 or later. <ds-status status="draft"></ds-status>
- **Tooltip** now supports passing a config object to the Lit directive and has an `ariaRelation` option to use `aria-describedby` or `aria-labelledby`. <ds-status status="stable"></ds-status>

### Theme Updates & Breaking Changes
All theme packages have a major version bump after the refactoring of Figma tokens. Legacy tokens have been moved to separate `-deprecated.css` files. If you have components that are not updated to use the new tokens, include `light-deprecated.css` until all components are updated. See the [themes README](https://github.com/sl-design-system/components/tree/main/packages/themes/README.md) for details. The Clickedu theme has an updated color palette with new brand colors.

### Bug Fixes & Improvements
We've been working on numerous bug fixes and improvements. The following components have one or more issues resolved:
- [`accordion`](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md)
- [`button`](https://github.com/sl-design-system/components/blob/main/packages/components/button/CHANGELOG.md)
- [`checkbox`](https://github.com/sl-design-system/components/blob/main/packages/components/checkbox/CHANGELOG.md)
- [`combobox`](https://github.com/sl-design-system/components/blob/main/packages/components/combobox/CHANGELOG.md)
- [`data-source`](https://github.com/sl-design-system/components/blob/main/packages/components/data-source/CHANGELOG.md)
- [`date-field`](https://github.com/sl-design-system/components/blob/main/packages/components/date-field/CHANGELOG.md)
- [`dialog`](https://github.com/sl-design-system/components/blob/main/packages/components/dialog/CHANGELOG.md)
- [`form`](https://github.com/sl-design-system/components/blob/main/packages/components/form/CHANGELOG.md)
- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md)
- [`icon`](https://github.com/sl-design-system/components/blob/main/packages/components/icon/CHANGELOG.md)
- [`inline-message`](https://github.com/sl-design-system/components/blob/main/packages/components/inline-message/CHANGELOG.md)
- [`listbox`](https://github.com/sl-design-system/components/blob/main/packages/components/listbox/CHANGELOG.md)
- [`menu`](https://github.com/sl-design-system/components/blob/main/packages/components/menu/CHANGELOG.md)
- [`message-dialog`](https://github.com/sl-design-system/components/blob/main/packages/components/message-dialog/CHANGELOG.md)
- [`number-field`](https://github.com/sl-design-system/components/blob/main/packages/components/number-field/CHANGELOG.md)
- [`panel`](https://github.com/sl-design-system/components/blob/main/packages/components/panel/CHANGELOG.md)
- [`popover`](https://github.com/sl-design-system/components/blob/main/packages/components/popover/CHANGELOG.md)
- [`radio-group`](https://github.com/sl-design-system/components/blob/main/packages/components/radio-group/CHANGELOG.md)
- [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md)
- [`skeleton`](https://github.com/sl-design-system/components/blob/main/packages/components/skeleton/CHANGELOG.md)
- [`tabs`](https://github.com/sl-design-system/components/blob/main/packages/components/tabs/CHANGELOG.md)
- [`tag`](https://github.com/sl-design-system/components/blob/main/packages/components/tag/CHANGELOG.md)
- [`text-area`](https://github.com/sl-design-system/components/blob/main/packages/components/text-area/CHANGELOG.md)
- [`time-field`](https://github.com/sl-design-system/components/blob/main/packages/components/time-field/CHANGELOG.md)
- [`tool-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/tool-bar/CHANGELOG.md)
- [`tooltip`](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md)
- [`tree`](https://github.com/sl-design-system/components/blob/main/packages/components/tree/CHANGELOG.md)

### Developer Tools
- **ESLint Plugin** - New `@sl-design-system/eslint-plugin-slds` package provides an ESLint plugin for the SL Design System. This plugin includes a rule for ensuring any `<sl-button>` you use has an accessible name. There are 2 more rules that deal with `html` tagged templates. The `@sl-design-system/eslint-config` package has been updated to include the new plugin.

### Documentation Updates
We've been working on improving and expanding our documentation.
The following components received new or updated documentation:
- [Time Field](/categories/components/time-field/) - New documentation added with usage guidelines and examples.
- [Button Bar](/categories/components/button-bar/) - Documentation has been updated with improved examples and usage guidelines.
- [Paginator](/categories/components/paginator/) - New documentation added including examples with data sources.
- [Panel](/categories/components/panel/) - New documentation added with usage, accessibility, and examples.
- [Tree](/categories/components/tree/) - Documentation improvements with better examples and API descriptions.
- [Angular Wrappers](https://storybook.sanomalearning.design/?path=/docs/angular_welcome--documentation) - Added Storybook documentation for Angular wrappers and directives, making it easier to use the design system in Angular applications.

</section>
<section>

## SL Design System Update
<small>June & July 2025</small>

Here’s an update on what we’ve been working on recently:

### Component Updates
- **Card** is refactored completely in terms of design and options, and partly in terms of html-slots. The way the image is handled is improved so a grid with multiple cards will look more consistent, also helped by the `subgrid` option. Because the changes are so big there are some breaking changes, you can find more detail in the [changelog of the card component](https://github.com/sl-design-system/components/blob/main/packages/components/card/CHANGELOG.md). <ds-status status="stable"></ds-status>
- **Angular** has support added for the `DialogService`. <ds-status status="stable"></ds-status>
- **Paginator** has a new `itemLabel` property, if you want to count 'students' on the pages instead of 'items' for example. <ds-status status="draft"></ds-status>

### Other Improvements
We have been working on a lot of bug fixes, the details can be found on our [release notes page](https://github.com/sl-design-system/components/blob/main/RELEASE_NOTES.md). The following components have one or more issues resolved:
- [`combobox`](https://github.com/sl-design-system/components/blob/main/packages/components/combobox/CHANGELOG.md)
- [`date-field`](https://github.com/sl-design-system/components/blob/main/packages/components/date-field/CHANGELOG.md)
- [`form`](https://github.com/sl-design-system/components/blob/main/packages/components/form/CHANGELOG.md)
- [`icon`](https://github.com/sl-design-system/components/blob/main/packages/components/icon/CHANGELOG.md)
- [`radio-group`](https://github.com/sl-design-system/components/blob/main/packages/components/radio-group/CHANGELOG.md)
- [`text-field`](https://github.com/sl-design-system/components/blob/main/packages/components/text-field/CHANGELOG.md)
- [`tooltip`](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md)
</section>
<section>

## SL Design System Update
<small>April & May 2025</small>

Here’s an update on what we’ve been working on recently:

### Component Updates
- **Inline Message:** Accessibility improvements are underway (not released yet). Please note: this includes a **breaking change** – we’ve removed the `action` slot from the inline-message component for accessibility reasons. <ds-status status="stable"></ds-status>
- **Number Field:** [New documentation has been added.](https://sanomalearning.design/categories/components/number-field/usage/) <ds-status status="draft"></ds-status>
- **Panel:** [Added density, divider and fill properties](https://storybook.sanomalearning.design/?path=/story/layout-panel--basic) <ds-status status="draft"></ds-status>

### Figma Toolkit Testing
We’ve kicked off testing of our SLDS Figma Toolkit with a small group of designers. Thanks to everyone who signed up!
The first batch includes:
- Button
- Checkbox
- Radio Group
- Search Field
- Textarea
- Textfield

A dedicated Slack channel with a feedback system has helped us catch and fix some early issues quickly. A new batch of components will be ready for testing soon.

If you’re interested in joining the test group, feel free to reach out!

### Theming
The new variable-based theming setup in Figma is looking solid. Testers were able to apply product themes manually with little trouble. We’re also working on a small helper plugin to simplify the process – more on that soon!

### Datagrid Improvements
We're continuing to enhance the datagrid component with:
- Contextual tokens replacing old hardcoded colors and sizes
- Updated design for bulk actions
- UX improvements to in-grid filtering and sortable columns
- Refactored list data sources for better grouping support
- New filter patterns for inside/outside the datagrid
- Example data tailored for the education domain
  
Work on this is ongoing.

### Other Improvements
- Progress Bar: [Now supports more color options](https://storybook.sanomalearning.design/?path=/story/feedback-status-progress-bar--colors)
- Icons: [Now scalable](https://storybook.sanomalearning.design/?path=/story/media-icon--basic) 
- Bugfixes: Minor cosmetic fixes for Tabs, Radio Group, and Select
</section>
<section>
  
## SL Design System Update
<small>January 2025</small>


Below are the updates we made last month. Everything will be available after the release.


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
