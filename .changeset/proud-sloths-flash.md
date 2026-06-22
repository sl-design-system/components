---
'@sl-design-system/ellipsize-text': patch
'@sl-design-system/inline-message': patch
'@sl-design-system/message-dialog': patch
'@sl-design-system/toggle-button': patch
'@sl-design-system/number-field': patch
'@sl-design-system/progress-bar': patch
'@sl-design-system/search-field': patch
'@sl-design-system/toggle-group': patch
'@sl-design-system/breadcrumbs': patch
'@sl-design-system/date-field': patch
'@sl-design-system/text-field': patch
'@sl-design-system/time-field': patch
'@sl-design-system/accordion': patch
'@sl-design-system/paginator': patch
'@sl-design-system/text-area': patch
'@sl-design-system/calendar': patch
'@sl-design-system/combobox': patch
'@sl-design-system/tool-bar': patch
'@sl-design-system/callout': patch
'@sl-design-system/infotip': patch
'@sl-design-system/listbox': patch
'@sl-design-system/tooltip': patch
'@sl-design-system/avatar': patch
'@sl-design-system/dialog': patch
'@sl-design-system/select': patch
'@sl-design-system/switch': patch
'@sl-design-system/emoji': patch
'@sl-design-system/panel': patch
'@sl-design-system/form': patch
'@sl-design-system/grid': patch
'@sl-design-system/menu': patch
'@sl-design-system/tabs': patch
'@sl-design-system/tree': patch
'@sl-design-system/tag': patch
---

Update `@open-wc/scoped-elements` due to typing fix

This update fixes the export of the typings, which causes errors due to missing `override` keywords in the components. This is a patch update, as it only contains a fix for the export of the typings and does not introduce any breaking changes.
