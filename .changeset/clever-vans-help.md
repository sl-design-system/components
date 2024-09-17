---
'@sl-design-system/menu': patch
'@sl-design-system/sanoma-learning': patch
---

Do not transform token parts to kebab case, only add '-' in between

This change is only for the new contextual tokens. Previously any snakeCase
tokens would be transformed into kebab-case. This is not the desired behavior
for the new contextual tokens.
