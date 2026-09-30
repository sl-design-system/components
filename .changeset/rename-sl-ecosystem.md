---
'@sl-design-system/sl-ecosystem': major
---

Rename the Teacher Assistant theme to SL Ecosystem. The package `@sl-design-system/teacher-assistant` is now published as `@sl-design-system/sl-ecosystem`.

To migrate:

- Replace the `@sl-design-system/teacher-assistant` dependency with `@sl-design-system/sl-ecosystem`
- Update all JS and CSS imports from `@sl-design-system/teacher-assistant/...` to `@sl-design-system/sl-ecosystem/...`
- Replace the `data-teacher-assistant-subthemes` attribute with `data-sl-ecosystem-subthemes`
