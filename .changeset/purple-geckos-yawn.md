---
'@sl-design-system/form': patch
'@sl-design-system/listbox': patch
'@sl-design-system/select': patch
---

Prepend light DOM elements to the host, instead of `append()`

The fixes any possible issues where the element is added to the light DOM and Lit itself
get's confused and thinks the element is rendered by Lit. This can cause Lit to later
in the lifecycle remove the element from the light DOM, which is not what we want.

By prepending the element to the host, we ensure that the element is not in any scope of Lit.
This scope is visible in the DOM as HTML comments.
