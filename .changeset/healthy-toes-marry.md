---
'@sl-design-system/tabs': minor
---

Tabs improvements

Features:
- Refactor styling to use new contextual tokens
- Add activation property for auto or manual activation (see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Simplify `<sl-tab>` styling using grid layout; makes the tab more flexible

Fixes:
- Scroll to the focused tab when using the keyboard
- Make sure the selected tab is fully visible on initial render and doesn't smooth scroll
- Fix bug where the RovingTabIndexController on `<sl-tab-group>` caused the inability to focus anything other than a tab
- Fix bug where the `<a href>` could get focus when pressing TAB when the `<sl-tab>` had focus
