---
'@sl-design-system/stylelint-config': minor
'@sl-design-system/eslint-config': minor
---

Remove prettier from the ESLint and Stylelint configs. Running `oxfmt` as a separate formatting step is more performant than including prettier as a plugin in those configs.

See https://oxc.rs/docs/guide/usage/formatter.html for more information about `oxfmt`.
