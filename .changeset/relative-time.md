---
'@sl-design-system/relative-time': minor
---

Add new `<sl-relative-time>` component, which shows how long ago (or how far in the future) a date is, using `Intl.RelativeTimeFormat`: "3 minutes ago", "yesterday at 10:00", "in 2 weeks". With `sync` it keeps itself up to date.

```html
<sl-relative-time date="2026-11-25T10:00:00" sync></sl-relative-time>
```
