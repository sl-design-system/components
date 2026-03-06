---
'@sl-design-system/shared': minor
---

Add `supportCSSAnchorPositioning` option to the anchor directive

Setting this to true will cause the directive to do nothing if CSS anchor positioning is supported in the browser. It will then use CSS anchor positioning to position the element. In older browsers it will still use floating-ui to position the element.

A component has to explicitly opt-in to using CSS Anchor Positioning by setting this option to true.
