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
'@sl-design-system/myvanin': major
'@sl-design-system/neon': major
'@sl-design-system/sanoma-learning': major
'@sl-design-system/sanoma-utbildning': major
'@sl-design-system/teas': major
'@sl-design-system/tig': major
---

This is a major change after the refactoring of the Figma tokens and subsequently the webcomponents; with this release we removed the old tokens from the default css files, and moved all legacy tokens to a separate file. This means a breaking change; if you have  components in your application that are not updated yet to the version that uses the new tokens the styling will be broken if you don't take action after using this version of the theme.
To support these older component versions you can include `light-deprecated.css` in all places where you now include `light.css` until all components are updated and you can remove the legacy file.
(`light.css` is taken as an example, this of course goes for all files, also `dark`, `base` and the `scss` files)
