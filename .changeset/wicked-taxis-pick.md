---
'@sl-design-system/dialog': patch
---

Fix styling of title to override any global styles

Always use an `<h1>` element with `slot="title"` for the dialog title; the component now correctly resets heading styles so it displays properly. Since a dialog is independent of the surrounding page content, it has its own content hierarchy. This means it should not follow the `h1` > `h2` > `h3` convention of the page it is opened from; the dialog title is always the top-level heading within its own context.
