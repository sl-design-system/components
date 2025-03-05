# Release notes for the SL Design System

This is a collection of release notes for the SL Design System. Each release note is a summary of the changes for that release. If you want specific details on a version, you should read the `CHANGELOG.md` file in that particular package. The release notes do not list every change, but they do list the most important changes.

The release notes are ordered by the date the release was made. From latest, to oldest.

# March 3, 2025

## Noteworthy

### New contextual tokens

This release adds new contextual tokens for all themes. The old tokens are still here and are still in use. When the old tokens are no longer used throughout the design system, they will be removed.

This greatly simplifies the theming system and makes it easier to create new themes & maintain existing ones. Some components have already been refactored to use the new tokens. These include:
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

### Accessibility audit improvements

This release includes the last fixes for the issues reported in the accessibility audit. We won't stop there as we are still continuing to improve the accessibility of the design system.

## Breaking changes

- `@sl-design-system/angular` has been updated to support Angular 18 and 19. This means support for version 17 has been dropped.

- `@sl-design-system/select` has received a major update. The options and option groups have been removed from the package. You should now use the options and option groups from the `@sl-design-system/listbox` package. The listbox component is a more flexible and powerful component that can be used to create a variety of custom select-like components.

## New features

- `@sl-design-system/announcer` provides a new `<sl-announcer>` component that can be used to send announcements to a central live-aria for screen readers to read it and notify users.

- `@sl-design-system/badge` has a new `color` property that replaces the (now deprecated) `variant` property.

- `@sl-design-system/breadcrumbs` adds a new `inverted` property. Use this if you need to display breadcrumbs on a dark background.

- `@sl-design-system/button` has a new `shape` property that allows for rounded buttons using the `pill` value. It also has a new `inverted` variant for when a button is used in a dark background (or light, depending on light/dark mode). The `default` variant has been renamed to `secondary`. Since this was the default value of the `variant` property, it is not considered a breaking change.

- `@sl-design-system/data-source` has been refactored and split into a new `ListDataSource` and `TreeDataSource` class. This is necessary to support the new `<sl-tree>` component. If you are already using the `DataSource` class, you should be able to switch to the new `ListDataSource` class without any issues. This is not considered a breaking change because this package still has "draft" status.

- `@sl-design-system/format-number` provides a new `<sl-format-number>` utility component based on the (Intl.NumberFormat)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat] API. This component allows you to format numbers in a variety of ways, including currency, percentage, and more.

- `@sl-design-system/grid` includes improvements to horizontal scrolling and allows for sticky columns at the end of the grid.

- `@sl-design-system/inline-message` now has a `size` property that goes down to `sm`. By default the component will automatically switch between `md` and `lg` based on the content.

- `@sl-design-system/number-field` provides the new `<sl-number-field>` component for inputting numbers. Use this when you specifically need to input numbers, and not text. This component provides a number of features, including validation, min/max values, and more.

- `@sl-design-system/paginator` provides new components for handling pagination.

- `@sl-design-system/panel` provides a new `<sl-panel>` component. This component is meant to be used as a UI container. Not to be confused with `<sl-card>`, which is meant for navigation.

- `@sl-design-system/scrollbar` provides a new utility `<sl-scrollbar>` component for those places where you need a scrollbar, but are unable to use a native one. The only place this is currently used is in `<sl-grid>` when sticky columns are active. Most users will probably never use this component directly.

- `@sl-design-system/select` has a new `clearable` property, which allows a user to clear a selected option from the select component.

- `@sl-design-system/tabs` has a new `activation` property that allows you to set it to `auto`. This will automatically activate the tab that is focused. For backwards compatibility, the default value is `manual`.

- `@sl-design-system/tree` provides a new `<sl-tree>` component. This component is meant to be used to display hierarchical data in a tree-like structure. It uses the new `TreeDataSource` class from the `@sl-design-system/data-source` package.

## Bug fixes

- `@sl-design-system/grid` fixes a bug where a `path` with an empty string would render as "No path set"
- `@sl-design-system/icon` has updated the types to be compatible with the latest FontAwesome versions (6.7.0).
- `@sl-design-system/select` fixes an issue where `<sl-select-button>` could be deleted by Lit

And lots more. See the `CHANGELOG.md` file in each package for more details.
