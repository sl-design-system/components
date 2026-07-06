---
'@sl-design-system/checkbox': minor
'@sl-design-system/radio-group': minor
'@sl-design-system/switch': minor
'@sl-design-system/infotip': minor
---

Add infotip support to checkbox, radio, and switch components

Form controls now support an optional infotip slot that displays contextual help using the infotip component. The infotip automatically:

- Sizes itself appropriately (sm) for form controls
- Inherits the form control's label as its `describes` attribute if not explicitly set
- Positions itself alongside the form control without interfering with clicks or keyboard interactions
