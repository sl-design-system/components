# Release notes for the SL Design System

This is a collection of release notes for the SL Design System. Each release note is a summary of the changes for that release. If you want specific details on a version, you should read the `CHANGELOG.md` file in that particular package. The release notes do not list every change, but they do list the most important changes.

The release notes are ordered by the date the release was made. From latest, to oldest.

# April 29, 2025

## New features

`@sl-design-system/eslint-plugin-slds` is a new package that provides an ESLint plugin for the SL Design System. This plugin includes a rule for ensuring any `<sl-button>` you use has an accessible name. There are 2 more rules that deal with `html` tagged templates. `@sl-design-system/eslint-config` has been updated to include the new plugin.

## Bug fixes

- `button` has added `flex-shrink: 0` so the button never get's too small in a flex container
- `listbox`, `shared` and `tree` include a fix where `<lit-virtualizer>` was accidentally registered on the global custom element registry
- `tabs` fixes not being able to change the background just for the panels
- `tabs` fixes triggering the `<sl-tab>` properly from the overflow menu; also when used with `[routerLink]` in Angular
- `tag` fixes focusing removable tags when `stacked`, but no stack visible

# April 16, 2025

## New features

- `grid` has improved filtering and selection functionality
- `progress-bar` has new `color` option
- `icon` now scales with the text size when no explicit size is set
- `panel` uses the new contextual tokens and has new `density`, `divider` and `fill` properties. The `subheading` option has been removed.
- All themes have a new primitive size token added and updated pressed/hover colors.

## Bug fixes

- `badge`, `menu`, `tag`, `tree` were updated because of a removed css variable in icon.
- `grid` Fix bug where adding/removing columns to the grid would not update the scrollbar
- `grid` Fix colors on hover/active clickable grid rows
- `grid` Fix "No path set" displayed value for empty columns


# April 8, 2025

## Breaking changes

- `dialog` has been refactored to better work on mobile. This involves new `primary-actions` and `secondary-actions` slots. It also means that the `subtitle` property has been removed from the dialog configuration options.

- `spinner` uses the new contextual tokens. The `variant` property has been removed. It now uses the text color of the parent element.

## New features

- `popover` uses the new contextual tokens
- `tooltip` uses the new contextual tokens
- `tree` uses the new contextual tokens

## Bug fixes

- `data-source` Fix default sorting order when list is grouped
- `paginator` Fix translations
- `popover` Fix overflowing text in certain scenarios
- `toggle-button` Improved contrast between selected and unselected state

# March 27, 2025

## New features

First release of the draft versions of `<sl-date-field>` (`@sl-design-system/date-field`) and `<sl-calendar>` (`@sl-design-system/calendar`).

## Bug fixes

- `checkbox` Fix infinite loop when the value is `null`
- `combobox` Fix visible placeholder in Safari
- `combobox` Fix resize observer loop in FF when toggling stack visibility
- `form` Updated `font-weight` for error messages
- `format-date` Add missing export of `format()` function
- `select` Log a warning if `<sl-option>` elements are not registered as custom elements
- `shared` Fix incorrect paths in `.d.ts` files related to the `Constructor` type
- Various: Replace generic `unknown` type with `any` to be more forgiving

# March 17, 2025

## New features

The theme packages now include a `global.css` file that can be used to set global styles. This is useful for setting link colors and other global styles. At the moment this only contains link colors, but will likely be extended in the future.

## Bug fixes

- `checkbox` Fix Axe error because the component has 2 labels
- `combobox` Further improvements & fixes (still has draft status)
- `grid` Fix link colors
- `number-field` Fix validation not always updating and lifecycle warnings in console
- `search-field` Fix lifecycle warning in console
- `select` Fix bugs preventing you from selecting options
- `switch` Fix Axe error because the component has 2 labels
- `text-field` Fix cursor when in readonly mode and fix lifecycle warnings

# March 10, 2025

## Bug fixes

- `grid` & `panel` Fix transparent backgrounds due to obsolete tokens
- `editorial-suite` Replace teal color with blue
- All themes: Fix missing contextual tokens in css/base.css and css/<variant>.css

# March 6, 2025

## Noteworthy

### From Component-Specific Tokens to Contextual Tokens

In this release, we've improved our token setup by transitioning from component-specific tokens to contextual tokens. This shift enhances flexibility, ensures consistency across components, and simplifies maintenance. Contextual tokens adapt better to different themes and usage contexts, making the design system more scalable and future-proof. The old tokens are still here and are still in use. When the old tokens are no longer used throughout the design system, they will be removed.

If you are using our old tokens, now is the time to start using the new tokens! Please contact us if you have any questions about the new tokens.

Some components have already been refactored to use the new tokens. These include:
- badge
- breadcrumbs
- button
- button-bar
- checkbox
- form
- inline-message
- radio-group
- menu
- number-field
- paginator
- search-field
- select
- switch
- tabs
- tag
- text-area
- text-field
- toggle-button
- toggle-group

The rest will soon follow.

### Components 2.0 in Figma

We're developing a new Figma library that supports all themes using Figma variables. While your current library still uses the old token setup, the new library is built with contextual tokens. As a result, there may be some inconsistencies between design and code during this transition.
Some components using the new contextual tokens are already available in the Sanoma Learning theme. If you’d like to test them, feel free to request access. In the coming period, we'll roll out the components in the new library across all themes.

### Accessibility audit improvements

This release includes the last fixes for the issues reported in the accessibility audit. We won't stop there as we are still continuing to improve the accessibility of the design system.

## Breaking changes

- `angular` has been updated to support Angular 18 and 19. This means support for version 17 has been dropped.

- `select` has received a major update. The options and option groups have been removed from the package. You should now use the options and option groups from the `@sl-design-system/listbox` package. The listbox component is a more flexible and powerful component that can be used to create a variety of custom select-like components.

## New features

- `announcer` provides a new `<sl-announcer>` component that can be used to send announcements to a central live-aria for screen readers to read it and notify users.

- `badge` has a new `color` property that replaces the (now deprecated) `variant` property.

- `breadcrumbs` adds a new `inverted` property. Use this if you need to display breadcrumbs on a dark background.

- `button` has a new `shape` property that allows for rounded buttons using the `pill` value. It also has a new `inverted` variant for when a button is used in a dark background (or light, depending on light/dark mode). The `default` variant has been renamed to `secondary`. Since this was the default value of the `variant` property, it is not considered a breaking change.

- `data-source` has been refactored and split into a new `ListDataSource` and `TreeDataSource` class. This is necessary to support the new `<sl-tree>` component. If you are already using the `DataSource` class, you should be able to switch to the new `ListDataSource` class without any issues. This is not considered a breaking change because this package still has "draft" status.

- `format-number` provides a new `<sl-format-number>` utility component based on the (Intl.NumberFormat)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat] API. This component allows you to format numbers in a variety of ways, including currency, percentage, and more.

- `grid` includes improvements to horizontal scrolling and allows for sticky columns at the end of the grid.

- `inline-message` now has a `size` property that goes down to `sm`. By default the component will automatically switch between `md` and `lg` based on the content.

- `number-field` provides the new `<sl-number-field>` component for inputting numbers. Use this when you specifically need to input numbers, and not text. This component provides a number of features, including validation, min/max values, and more.

- `paginator` provides new components for handling pagination.

- `panel` provides a new `<sl-panel>` component. This component is meant to be used as a UI container. Not to be confused with `<sl-card>`, which is meant for navigation.

- `scrollbar` provides a new utility `<sl-scrollbar>` component for those places where you need a scrollbar, but are unable to use a native one. The only place this is currently used is in `<sl-grid>` when sticky columns are active. Most users will probably never use this component directly.

- `select` has a new `clearable` property, which allows a user to clear a selected option from the select component.

- `tabs` has a new `activation` property that allows you to set it to `auto`. This will automatically activate the tab that is focused. For backwards compatibility, the default value is `manual`.

- `tree` provides a new `<sl-tree>` component. This component is meant to be used to display hierarchical data in a tree-like structure. It uses the new `TreeDataSource` class from the `@sl-design-system/data-source` package.

## Bug fixes

- `grid` fixes a bug where a `path` with an empty string would render as "No path set"
- `icon` has updated the types to be compatible with the latest FontAwesome versions (6.7.0).
- `select` fixes an issue where `<sl-select-button>` could be deleted by Lit

And lots more. See the `CHANGELOG.md` file in each package for more details.
