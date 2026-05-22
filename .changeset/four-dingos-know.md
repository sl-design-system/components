---
'@sl-design-system/grid': patch
---

Fixed Grid row accessibility by rendering `aria-rowindex` as a 1-based value for both data rows and group rows instead of using the internal zero-based virtualizer index
