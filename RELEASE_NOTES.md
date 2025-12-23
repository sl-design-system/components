# Release notes for the SL Design System

This is a collection of release notes for the SL Design System. Each release note is a summary of the changes for that release. If you want specific details on a version, you should read the `CHANGELOG.md` file in that particular package. The release notes do not list every change, but they do list the most important changes.

The release notes are ordered by the date the release was made. From latest, to oldest.

# December 23, 2025

## New features

- [`tool-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/tool-bar/CHANGELOG.md) has major improvements including a new `contained` property to enable contained mode, keyboard navigation support for arrow keys when toolbar is focused, and an `inverted` property for the divider component. The overall styling has been improved and overflow behavior issues have been fixed. The `no-border` property has been removed; the border now only shows in `contained` variant (except when `inverted`). When using this version of the tool-bar make sure to use panel v0.3.1 or later

## Bug fixes

- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md) fixes styling issues in bulk-actions and moves the close button outside the tool-bar in the bulk-actions.
- [`message-dialog`](https://github.com/sl-design-system/components/blob/main/packages/components/message-dialog/CHANGELOG.md) accessibility improvement - the message dialog now uses `<h2>` for the title.
- [`panel`](https://github.com/sl-design-system/components/blob/main/packages/components/panel/CHANGELOG.md) fixes `no-header` attribute not being set correctly when header is empty. When using this version of the panel make sure to use tool-bar v0.2.0 or later

# December 17, 2025

## New features

- [`breadcrumbs`](https://github.com/sl-design-system/components/blob/main/packages/components/breadcrumbs/CHANGELOG.md) has a new `hideHomeLabel` property (and static option) to allow hiding the "Home" label text in the first home breadcrumb.

## Bug fixes

- [`angular`](https://github.com/sl-design-system/components/blob/main/packages/angular/CHANGELOG.md) fixes the combobox filename and added it to the list of exported components in the public API.
- [`text-area`](https://github.com/sl-design-system/components/blob/main/packages/components/text-area/CHANGELOG.md) fixes `resize` `none` and `auto` in the text-area component.

# December 4, 2025

## Breaking changes

- All theme packages have a major version bump. This is a breaking change after the refactoring of the Figma tokens and subsequently the web components. With this release we removed the old tokens from the default CSS files, and moved all legacy tokens to a separate file. If you have components in your application that are not updated yet to the version that uses the new tokens, the styling will be broken if you don't take action after using this version of the theme. To support these older component versions you can include `light-deprecated.css` in all places where you now include `light.css` until all components are updated and you can remove the legacy file. (`light.css` is taken as an example, this of course goes for all files, also `dark`, `base` and the `scss` files)
You can find information on whether your component version needs the deprecated css file in the [Readme file in the themes folder](https://github.com/sl-design-system/components/tree/main/packages/themes/README.md)

- [`angular`](https://github.com/sl-design-system/components/blob/main/packages/angular/CHANGELOG.md) has been updated to support Angular 21 and requires Angular 19.0 or higher (tested with Angular 21.0) and TypeScript 5.9.0 or higher. This means that support for Angular 18 is removed.

## New features

- [`badge`](https://github.com/sl-design-system/components/blob/main/packages/components/badge/CHANGELOG.md) can now have a label on `sm` badges; this will be shown behind the dot.
- [`callout`](https://github.com/sl-design-system/components/blob/main/packages/components/callout/CHANGELOG.md) is a new component, visually similar to the `inline-message` but with a different purpose: it can be used to provide additional, non-interrupting information and may include actions (e.g. buttons). It must not be shown/hidden dynamically in response to user actions (unlike the `inline-message`). There is no ARIA role on this component as it is not meant to interrupt the user (no live region).
- [`panel`](https://github.com/sl-design-system/components/blob/main/packages/components/panel/CHANGELOG.md) has improved `density` property values. From now on, use `default` and `relaxed` for the `density` property. The `plain` and `comfortable` values are deprecated, they will be kept for backward compatibility for now but removed in the future.
- [`search-field`](https://github.com/sl-design-system/components/blob/main/packages/components/search-field/CHANGELOG.md) now debounces the `sl-search` event while typing. Previously applications using the search field component would have to debounce the `sl-search` event themselves. With this change the component now debounces the event internally with a default delay of 300ms.
- [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md) now automatically adjusts its width based on the largest option available. If any of the options contain HTML elements, the automatic sizing is disabled to ensure accurate rendering. This enhancement improves the user experience by preventing text truncation and ensuring that all options are fully visible.
- [`tabs`](https://github.com/sl-design-system/components/blob/main/packages/components/tabs/CHANGELOG.md) has updated styling to align with Figma of the tab `indicator` (increased width and border radius) and the `part="container"` (increased border width).

## Bug fixes

- [`button`](https://github.com/sl-design-system/components/blob/main/packages/components/button/CHANGELOG.md) fixes a bug in Angular where the text content of the button is changed after the custom element has been initialized, but the `slotchange` event does not fire. Now uses a `MutationObserver` to detect changes to the text content.
- [`data-source`](https://github.com/sl-design-system/components/blob/main/packages/components/data-source/CHANGELOG.md) fixes data not being invalidated when calling `FetchListDataSource.update()`.
- [`emoji`](https://github.com/sl-design-system/components/blob/main/packages/components/emoji/CHANGELOG.md) refactored tokens for headings that were still using deprecated tokens.
- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md) improves reliability of selection mode. When you add an `<sl-grid-selection-column>` to a grid, the selection column automatically enables multiple selection mode on the data source.
- [`icon`](https://github.com/sl-design-system/components/blob/main/packages/components/icon/CHANGELOG.md) changes `IconPrefix` type so we no longer get errors every time a new prefix is added in FontAwesome, and refactored token for multi-colour icons.
- [`magister`](https://github.com/sl-design-system/components/blob/main/packages/themes/magister/CHANGELOG.md) inverted onBold colour changed to blue.
- [`menu`](https://github.com/sl-design-system/components/blob/main/packages/components/menu/CHANGELOG.md), [`paginator`](https://github.com/sl-design-system/components/blob/main/packages/components/paginator/CHANGELOG.md), [`progress-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/progress-bar/CHANGELOG.md), [`tag`](https://github.com/sl-design-system/components/blob/main/packages/components/tag/CHANGELOG.md), [`toggle-button`](https://github.com/sl-design-system/components/blob/main/packages/components/toggle-button/CHANGELOG.md), [`toggle-group`](https://github.com/sl-design-system/components/blob/main/packages/components/toggle-group/CHANGELOG.md) refactored tokens that were still using deprecated tokens.
- [`time-field`](https://github.com/sl-design-system/components/blob/main/packages/components/time-field/CHANGELOG.md) fixes several issues: for `required` time-field, native validation message is now used; fixes an issue where the dialog time picker value did not update when the user typed a new value; fixes toggling time picker when clicking on the clock button.
- [`tree`](https://github.com/sl-design-system/components/blob/main/packages/components/tree/CHANGELOG.md) fixes lazy loaded children to inherit the selected state of the parent node.

# October 21, 2025

Tree has been promoted from draft to preview.

## New features
- [`button-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/button-bar/CHANGELOG.md) has new `fill` and `variant` properties that will apply to all buttons inside the button bar.
- [`clickedu`](https://github.com/sl-design-system/components/blob/main/packages/themes/clickedu/CHANGELOG.md) has an updated color palette with new brand colors.
- [`icon`](https://github.com/sl-design-system/components/blob/main/packages/components/icon/CHANGELOG.md) Support Font Awesome 7.1.
- [`tree`](https://github.com/sl-design-system/components/blob/main/packages/components/tree/CHANGELOG.md) now support sorting
- [`virtual-list`](https://github.com/sl-design-system/components/blob/main/packages/components/virtual-list/CHANGELOG.md) is a new utility package that provides a virtual scrolling solution based on `@tanstack/virtual-core`.

## Bug fixes
- [`accordion`](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md) removes the background so the component now blends in better with the surrounding.
- [`accordion`](https://github.com/sl-design-system/components/blob/main/packages/components/accordion/CHANGELOG.md) fixes missing `part="icon"` on the icon element.
- [`button`](https://github.com/sl-design-system/components/blob/main/packages/components/button/CHANGELOG.md) fixes text color of disabled buttons with a variant.
- [`checkbox`](https://github.com/sl-design-system/components/blob/main/packages/components/checkbox/CHANGELOG.md) removes superfluous `aria-checked` attribute.
- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md) fixes changes in the bulk actions slot not propagating to the tool-bar component.
- [`panel`](https://github.com/sl-design-system/components/blob/main/packages/components/panel/CHANGELOG.md) fixes the background being too dark in certain themes.
- [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md) fixes issue in Chrome where the dropdown would flicker when one of its parents had a `translate` transform applied.
- [`select`](https://github.com/sl-design-system/components/blob/main/packages/components/select/CHANGELOG.md) fixes weird behavior when selecting the last option in the list.
- [`shared`](https://github.com/sl-design-system/components/blob/main/packages/components/shared/CHANGELOG.md) fixes `scrollParent` to work with overflow elements that do not (yet) scroll.
- [`tool-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/tool-bar/CHANGELOG.md) fixes changes to slotted elements not propagating properly.
- [`tree`](https://github.com/sl-design-system/components/blob/main/packages/components/tree/CHANGELOG.md) various fixes: improve look and behavior of the indent guides, better screen reader announcements, remove incorrect use of `aria-checked`.

# October 1, 2025

Menu, number-field and tag have been promoted from draft to preview.

New `<sl-time-field>` component in the `@sl-design-system/time-field` package.

## New features
- [`angular`](https://github.com/sl-design-system/components/blob/main/packages/angular/CHANGELOG.md) has new bindings for `<sl-time-field>`.
- [`button`](https://github.com/sl-design-system/components/blob/main/packages/components/button/CHANGELOG.md) has support for `aria-disabled="true"` to disable a button while keeping it focusable (for example, when using tooltips).
- [`tool-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/tool-bar/CHANGELOG.md) now supports `<sl-menu-button>`.
- [`tooltip`](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md) now supports passing a config object to the `tooltip()` Lit directive.
- [`tooltip`](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md) now supports an `ariaRelation` option which you can use to tell it to use `aria-describedby` or `aria-labelledby`.

## Bug fixes
- [`checkbox`](https://github.com/sl-design-system/components/blob/main/packages/components/checkbox/CHANGELOG.md) fix initial validity when checked.
- [`data-source`](https://github.com/sl-design-system/components/blob/main/packages/components/data-source/CHANGELOG.md) fix issue where the "select all" flag wasn't being cleared after manually deselecting every item.
- [`form`](https://github.com/sl-design-system/components/blob/main/packages/components/form/CHANGELOG.md) fix alignment issue of icon when error text spans multiple lines.
- [`grid`](https://github.com/sl-design-system/components/blob/main/packages/components/grid/CHANGELOG.md) various fixes.
- [`icon`](https://github.com/sl-design-system/components/blob/main/packages/components/icon/CHANGELOG.md) has a fix for the new Font Awesome 7 icons which were sometimes shown clipped.
- [`menu`](https://github.com/sl-design-system/components/blob/main/packages/components/menu/CHANGELOG.md) fix missing initial `aria-expanded` for menu item with sub menu.
- [`menu`](https://github.com/sl-design-system/components/blob/main/packages/components/menu/CHANGELOG.md) fix keyboard shortcut not being announced properly by using `aria-keyshortcuts`.
- [`panel`](https://github.com/sl-design-system/components/blob/main/packages/components/panel/CHANGELOG.md) fix styling issue with overlapping buttons.
- [`tag`](https://github.com/sl-design-system/components/blob/main/packages/components/tag/CHANGELOG.md) fix missing focus after removing a tag.
- [`tag`](https://github.com/sl-design-system/components/blob/main/packages/components/tag/CHANGELOG.md) fix focus outline clipping due to `z-index`.
- [`tool-bar`](https://github.com/sl-design-system/components/blob/main/packages/components/tool-bar/CHANGELOG.md) fix weird behavior due to nested `slotchange` events.
- [`tooltip`](https://github.com/sl-design-system/components/blob/main/packages/components/tooltip/CHANGELOG.md) fix issue where the Lit directive would not work when used on an `<sl-button>`.
- [`tree`](https://github.com/sl-design-system/components/blob/main/packages/components/tree/CHANGELOG.md) fix empty `aria-setsize` attribute when size is unknown.

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
