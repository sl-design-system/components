---
'@sl-design-system/dialog': patch
---

Fixed dialog flickering on viewport resize and improved close/open animations:
- Fixed flickering when resizing between mobile and desktop,
- Fixed close animation in Safari/Firefox: Browsers without `overlay` support remove the dialog from the top layer immediately on `close()`, which broke exit transitions. The `close()` method now adds a `.closing` class and waits for animations to finish before calling the native `dialog.close()`, so the exit animation plays while the dialog is still visible.
