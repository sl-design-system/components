---
'@sl-design-system/breadcrumbs': patch
---

Open the overflow menu with the
[Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
instead of a click handler, so `sl-popover` anchors it to the button that opened it. It used to be
linked with the `anchor` attribute, which has been removed from `sl-popover`.
