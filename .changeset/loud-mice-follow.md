---
'@sl-design-system/tool-bar': patch
---

Updates ToolBar disabled behavior to prefer aria-disabled for accessibility while preserving keyboard navigation and interaction semantics.
ToolBar now sets/removes aria-disabled (instead of disabled) when the toolbar is disabled, and adjusts roving tabindex logic accordingly.
ToolBarDivider now has aria-hidden="true" to prevent screen readers from announcing it as "blank".
