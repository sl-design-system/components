---
'@sl-design-system/shared': minor
---

- Remove the `FocusTrapController` and related `focus-trap` dependency

This was only used within `<sl-dialog>`. That component no longer uses this functionality. Because this was internal API, it's not seen as a breaking change.

- Add new `MediaController` class to help manage media queries
