---
'@sl-design-system/search-field': patch
---

Debounce the `sl-clear` event while typing

Previously applications using the search field component would have to debounce the `sl-clear` event themselves. With this change the component now debounces the event internally with a default delay of 300ms.
