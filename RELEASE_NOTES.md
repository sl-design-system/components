# Release notes for the SL Design System

This is a collection of release notes for the SL Design System. Each release note is a summary of the changes for that release. If you want specific details on a version, you should read the `CHANGELOG.md` file in that particular package. The release notes do not list every change, but they do list the most important changes.

The release notes are ordered by the date the release was made. From latest, to oldest.

# September 17, 2025

## New features
- [`skeleton`](https://github.com/sl-design-system/components/blob/main/packages/components/skeleton/CHANGELOG.md) has been refactored to use the new contextual tokens.
- [`tooltip`](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md) added ability to specify the `ariaRelation` when using the tooltip component.

## Bug fixes
- [`listbox`](https://github.com/sl-design-system/components/blob/main/packages/components/listbox/CHANGELOG.md) fixes missing border between group and lone option.
- [`radiogroup`](https://github.com/sl-design-system/components/blob/main/packages/components/radio-group/CHANGELOG.md) fixes issue where the validity did not match the initial group value.
- [`tabs`](https://github.com/sl-design-system/components/blob/main/packages/components/tabs/CHANGELOG.md) fixes issue selecting a tab when zoomed in was not working correctly in some browsers.
- [`magister`](https://github.com/sl-design-system/components/blob/main/packages/themes/magister/CHANGELOG.md) various theme improvements.

# September 11, 2025

## New features
- [`angular`](https://github.com/sl-design-system/components/blob/main/packages/angular/CHANGELOG.md) has new form directives for `<sl-combobox>` and `<sl-number-field>`.
- [`accordion`](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md) has a new `iconType` property that allows you to use a chevron icon instead of plus/minus. It now also uses contextual tokens for styling.
- [`avatar`](https://github.com/sl-design-system/components/blob/main/packages/components/avatar/CHANGELOG.md) has new `color`, `emphasis` and `shape` properties for easier customization (similar to `<sl-badge>`).
- [`form`](https://github.com/sl-design-system/components/blob/main/packages/components/form/CHANGELOG.md) now supports more than 1 form control per field.
- [`icon`](https://github.com/sl-design-system/components/blob/main/packages/components/icon/CHANGELOG.md) now supports version 7 of Font Awesome.
- [`text-field`](https://github.com/sl-design-system/components/blob/main/packages/components/text-field/CHANGELOG.md) will now log a warning to the console when used with `type="number"`. Use `<sl-number-field>` instead.

## Bug fixes
- [`combobox`](https://github.com/sl-design-system/components/blob/main/packages/components/combobox/CHANGELOG.md), [`date-field`](https://github.com/sl-design-system/components/blob/main/packages/components/date-field/CHANGELOG.md), [`menu`](https://github.com/sl-design-system/components/blob/main/packages/components/menu/CHANGELOG.md), [`popover`](https://github.com/sl-design-system/components/blob/main/packages/components/popover/CHANGELOG.md), [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md) fixes issue where pressing the escape key would close a parent container (such as a dialog or popover).
- [`data-source`](https://github.com/sl-design-system/components/blob/main/packages/components/data-source/CHANGELOG.md) fixes issue where a selected group would not be cleared after calling `deselectAll()`.
- [`data-source`](https://github.com/sl-design-system/components/blob/main/packages/components/data-source/CHANGELOG.md) fixes issue where `FetchListDataSourceError` would be compiled incorrectly using NodeJS types.
- [`dialog`](https://github.com/sl-design-system/components/blob/main/packages/components/dialog/CHANGELOG.md) fixes various issues related to a dialog unexpectedly closing.
- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md) fixes issue where calling `deselectAll()` on the data source would not cause an update of the grid.
- [`inline-message`](https://github.com/sl-design-system/components/blob/main/packages/components/inline-message/CHANGELOG.md) removes the slide-up animation due to unexpected behavior in `<sl-dialog>`.
- [`number-field`](https://github.com/sl-design-system/components/blob/main/packages/components/number-field/CHANGELOG.md) fixes various issues related to validation and input handling.
- [`radio-group`](https://github.com/sl-design-system/components/blob/main/packages/components/radio-group/CHANGELOG.md) fixes issue where `sl-change` event would be emitted during initial render.
- [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md) fixes various issues related to validation and disabled state.
- [`tree`](https://github.com/sl-design-system/components/blob/main/packages/components/tree/CHANGELOG.md) fixes transparent background
- All components have minor styling changes due to the focus indicator
- All components have bumped the patch version of the `@open-wc/scoped-elements` peer dependency
- All themes have been updated after moving to Tokens Studio from Figma

# August 6, 2025

## New features
- [`card`](https://github.com/sl-design-system/components/blob/main/packages/components/card/CHANGELOG.md) is refactored completely in terms of design and options, and partly in terms of html-slots. The way the image is handled is improved so a grid with multiple cards will look more consistent, also helped by the `subgrid` option.
- [`angular`](https://github.com/sl-design-system/components/blob/main/packages/angular/CHANGELOG.md) has support added for the `DialogService`.
- [`paginator`](https://github.com/sl-design-system/components/blob/main/packages/components/paginator/CHANGELOG.md) has a new `itemLabel` property, if you want to count 'students' on the pages instead of 'items' for example.
- TIG theme is added

## Breaking changes
- [`card`](https://github.com/sl-design-system/components/blob/main/packages/components/card/CHANGELOG.md) a lot of the css-properties have been removed or renamed (see the full changelog for details), the `actions` slot functionality and position has changed; this is now placed at the bottom. `padding` propery has been renamed to `media-margin` and the `explicit-height`, `height` and `media-position` properties have been removed.

## Bug fixes
- `combobox` fixes issue where chosen option disappears when option has a 'value' attribute and issue where dispatching an sl-change event when initial value is set.
- `date-field` fixes showing/removing invalid state for required validation
- `form` fixes issue where sl-form-fields inside custom components didn't register to the sl-form correctly.
- `icon` fixes issue where icon in a flex container was squeezed too small and added a fallback for older browser because when the unit `cap` isn't supported.
- `radio-group` fixes dispatching sl-change event when initial value is set.
- `text-field` adds onChange method, called when the input changes.
- `tooltip` fixes issue where tooltip hides when hover is on child of element that has the tooltip attached to it and fixes issue where tooltip could inherit the font from the wrong container.
- All themes have been updated to support the new version of the `icon` component



# June 16, 2025

## New features
- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md#060) adds a new `row-action` property and removes the `selects` property. Using `row-action="activate"` will now activate the row when clicked, while `row-action="select"` will select the row. The `selects` property is no longer supported. You should always have an interactive element inside the row, such as a button or link, to ensure proper accessibility and user experience. Do not rely on just `row-action` for interaction.

## Bug fixes
- [`inline-message`](https://github.com/sl-design-system/components/blob/main/packages/components/inline-message/CHANGELOG.md#201) adds a missing dependency on `@sl-design-system/announcer`
- [`tool-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/tool-bar/CHANGELOG.md#0010) fixes a bug where the focus outline of buttons was cut-off when it was aligned to the right

# June 11, 2025

This release features major improvements to the `<sl-grid>` component, including new features and bug fixes. Some highlights include:
- New visual styles throughout the component
- New way for bulk actions to be displayed
- Cleaner implementation by moving "view model" logic into the `data-source` package
- Improved performance by removing unnecessary re-renders
- Initial improvements to keyboard navigation (more to come)
- Fixes drag & drop regression (more dnd to come in the future)

## Breaking changes

The `action` slot in `inline-message` has been removed due to accessibility concerns. We do not recommend using inline messages with interactive elements inside them.

## New features
- `angular` has been updated to support Angular 20. Version 18 is still supported (18 is still LTS).
- `data-source` has seen significant improvements; this work was necessary in order to improve the `<sl-grid>` component
- `inline-message` now uses the announcer to announce the message to screen readers
- `search-field` now has the ability to slot a different icon in the `prefix` slot

## Bug fixes
- `avatar` fixes a bug where the name did not wrap correctly
- `checkbox` fixes a styling regression when a label was not used
- `combobox` fixes a validation bug
- `listbox` fixes long text not breaking correctly in a narrow container
- `paginator` fixes bugs related to `pageSize` and the buttons
- `radio-group` increases the gap between radio buttons when in a horizontal layout
- `select` various styling fixes
- `tabs` fixes a bug with the gradient overlay
- `tag` fixes tabindexes for hidden tags in the stacked variant
- `tool-bar` fixes various bugs
- `tooltip` fixes a bug where it was shown at the wrong time
- All translations now have an `id`. This will prevent any translations from breaking when the source message changes.

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
