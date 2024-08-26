---
'@sl-design-system/tooltip': minor
---

Have `Tooltip.lazy` return a cleanup function to remove the event listeners

When you are using `Tooltip.lazy`, the tooltip may not have initialized yet when the host is disconnected/removed from the DOM. Another scenario is when your host attempts to call `Tooltip.lazy` multiple times, the tooltip may be initialized multiple times. This PR adds a cleanup function to remove the event listeners when the host is disconnected from the DOM or when the tooltip is initialized multiple times. See `<sl-tag>` for an example of how to use the cleanup function.
