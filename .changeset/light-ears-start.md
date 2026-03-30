---
'@sl-design-system/shared': minor
---

Improved `MediaController` (used in `sl-dialog`):
- Added `device` and `previousDevice` getters to query the current and previous breakpoint
- Added `MediaControllerConfig` with an `onChange` callback that fires when the viewport crosses a breakpoint
- Added `MediaChangeEvent` interface with `previous` and `current` device info
