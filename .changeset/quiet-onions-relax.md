---
'@sl-design-system/rolldown-plugin-css-sheet': patch
---

Fix a crash when a `.css` import is requested from a virtual module (e.g. Storybook/Vitest browser test setup files), which surfaced as unrelated "missing export" errors
