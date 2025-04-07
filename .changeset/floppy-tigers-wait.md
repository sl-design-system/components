---
'@sl-design-system/progress-bar': minor
---

- Refactored to use new contextual tokens
- Moved sub label (in main slot) above the progress bar
- The text in the main slot in `error` variant is no longer the danger color. To communicate errors you can use the new `error` slot. That is placed underneath the progressbar and shown in a contrasting colour.
