---
'@sl-design-system/bingel-dc': major
'@sl-design-system/bingel-int': major
'@sl-design-system/clickedu': major
'@sl-design-system/editorial-suite': major
'@sl-design-system/itslearning': major
'@sl-design-system/kampus': major
'@sl-design-system/magister': major
'@sl-design-system/max': major
'@sl-design-system/my-digital-book': major
'@sl-design-system/neon': major
'@sl-design-system/sanoma-learning': major
'@sl-design-system/sanoma-pro': major
'@sl-design-system/sanoma-utbildning': major
'@sl-design-system/teacher-assistant': major
'@sl-design-system/teas': major
'@sl-design-system/tig': major
---

The main css file has changed name; the new file that needs to be included is `theme.css`. This is done because both light and dark variants (for themes that have a dark mode) are available in this same `theme.css` file.
The `light-deprecated.css` and `dark-deprecated.css` files remain unchanged.
Additionally a new `typography.css` has been added, that contains styles for body text, headers, label, captions etc. It is optional to use this for the time being.
