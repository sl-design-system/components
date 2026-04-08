---
'@sl-design-system/shared': minor
---

Improved `MediaController` (used in `sl-dialog`):
- Added `device` getter to query the current breakpoint
- Added `MediaControllerConfig` with an `onChange` callback that fires when the viewport crosses a breakpoint
- Added `MediaChangeEvent` interface with `previous` and `current` device info
