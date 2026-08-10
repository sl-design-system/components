---
'@sl-design-system/accordion': patch
'@sl-design-system/announcer': patch
'@sl-design-system/avatar': patch
'@sl-design-system/badge': patch
'@sl-design-system/breadcrumbs': patch
'@sl-design-system/button': patch
'@sl-design-system/button-bar': patch
'@sl-design-system/calendar': patch
'@sl-design-system/callout': patch
'@sl-design-system/card': patch
'@sl-design-system/checkbox': patch
'@sl-design-system/combobox': patch
'@sl-design-system/data-source': patch
'@sl-design-system/date-field': patch
'@sl-design-system/dialog': patch
'@sl-design-system/drawer': patch
'@sl-design-system/editor': patch
'@sl-design-system/ellipsize-text': patch
'@sl-design-system/emoji': patch
'@sl-design-system/form': patch
'@sl-design-system/format-date': patch
'@sl-design-system/format-number': patch
'@sl-design-system/grid': patch
'@sl-design-system/icon': patch
'@sl-design-system/infotip': patch
'@sl-design-system/inline-message': patch
'@sl-design-system/listbox': patch
'@sl-design-system/locales': patch
'@sl-design-system/menu': patch
'@sl-design-system/message-dialog': patch
'@sl-design-system/number-field': patch
'@sl-design-system/paginator': patch
'@sl-design-system/panel': patch
'@sl-design-system/popover': patch
'@sl-design-system/progress-bar': patch
'@sl-design-system/radio-group': patch
'@sl-design-system/scrollbar': patch
'@sl-design-system/search-field': patch
'@sl-design-system/select': patch
'@sl-design-system/shared': patch
'@sl-design-system/skeleton': patch
'@sl-design-system/spinner': patch
'@sl-design-system/switch': patch
'@sl-design-system/tabs': patch
'@sl-design-system/tag': patch
'@sl-design-system/text-area': patch
'@sl-design-system/text-field': patch
'@sl-design-system/time-field': patch
'@sl-design-system/toggle-button': patch
'@sl-design-system/toggle-group': patch
'@sl-design-system/tool-bar': patch
'@sl-design-system/tooltip': patch
'@sl-design-system/tree': patch
'@sl-design-system/virtual-list': patch
---

Build the package with tsdown

The build has moved from esbuild to [tsdown](https://tsdown.dev). The public API is unchanged, but the published layout is different: compiled output now lives in `dist/` instead of the package root, and the package is resolved entirely through `exports`. The `main`, `module` and `types` fields have been dropped, since `exports` already points at both the JavaScript and, alongside it, the type declarations.

Bundlers and TypeScript setups that understand `exports` (`moduleResolution: bundler`, `node16` or `nodenext`) need no changes. The legacy `moduleResolution: node` is no longer supported.
