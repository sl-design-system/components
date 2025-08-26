---
'@sl-design-system/inline-message': patch
---

Remove slide-up animation

This fixes a bug where the `scrollHeight` of the dialog body was increased while the slide-up animation was running. This caused the dialog to incorrectly show the scroll indicator when it shouldn't have. I was not possible to use `overflow` to prevent this from happening in the dialog. So from now on, the inline message will simply fade in and out without any sliding motion.
