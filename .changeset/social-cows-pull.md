---
'@sl-design-system/menu': patch
---

Fix clicking a second time did not dismiss the menu

When a user clicked the menu button to open the menu and then clicked it again to close it, the menu would immediately reopen. This happened because the button click fired after the popover's `toggle` event, causing the button's click handler to call `togglePopover()` again on an already-closed menu. The fix tracks a `#popoverJustClosed` flag via the `beforetoggle` event and skips the click handler when the flag is set.
