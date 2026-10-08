---
'@sl-design-system/segmented-control': minor
---

Add new `<sl-segmented-control>` component: an unordered list of buttons for switching between a small set of related options.

- Supports `shape` (`rect`, `pill`), `size` (`md`, `lg`) and `fill` (`solid`, `outline`); defaults are `rect`, `md` and `solid`
- Accessible name via `aria-label` or `aria-labelledby`
- The selected option has `aria-current="true"`, all others `aria-current="false"`
- Single tab stop; use the left and right arrow keys to move between options
