---
'@sl-design-system/infotip': minor
---

`sl-infotip` renders its own `<button>` instead of an `sl-button`, and opens the popover through the
[Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API). This
drops the dependency on `@sl-design-system/button` and removes the click and keydown handling that
went with it; the browser toggles the popover.

#### Breaking changes

- The `size` property has been removed. The button is no longer a button in the design system sense,
  so it has no sizes to pick from; it sizes itself to its icon. Style the icon with `--sl-icon-size`
  on the infotip if you need it larger or smaller.
- The `toggleInfotip()` method has been removed. Toggle the infotip from an invoker instead:

  ```html
  <button command="toggle-popover" commandfor="...">More information</button>
  ```

#### Other changes

- Focus is delegated to the internal `<button>` via `delegatesFocus: true`, replacing the `focus()`
  override. Calling `focus()` on the infotip still focuses the button.
- The popover is positioned by `sl-popover` using CSS anchor positioning, rather than the `anchor`
  and `position` attributes it used to be given. It opens below the button and flips when there is
  not enough room, instead of always opening above it.
- The popover content is capped at `min(80dvw, 400px)`.
- The icon uses `--sl-color-foreground-subtlest`, both the default one and one you slot in yourself,
  and the button has its own focus ring.
