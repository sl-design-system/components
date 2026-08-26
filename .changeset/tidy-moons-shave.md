---
'@sl-design-system/popover': major
---

The popover is now positioned with CSS anchor positioning instead of floating-ui. This removes the
per-frame repositioning loop; the browser keeps the popover in place and flips it to the opposite
side when there is not enough room.

> [!NOTE]
> CSS Anchor Positioning is not yet supported in all browsers. You may need to include the
> [CSS Anchor Positioning polyfill](https://anchor-positioning.oddbird.net/) in your application.

#### Breaking changes

- The `position` property has been removed, along with the twelve `top`/`right`/`bottom`/`left`
  values and their `-start` and `-end` variants. The side is chosen in CSS instead, with
  `position-area` and `position-try-fallbacks` on the popover; the default is `bottom span-all`,
  falling back to `flip-block`, `flip-inline` and `flip-block flip-inline`.

  ```css
  sl-popover {
    position-area: top span-all;
  }
  ```

- The `anchor` attribute and the `anchorElement` property have been removed with the
  `AnchorController` that backed them. Link the popover to its anchor with the
  [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API), or
  by passing a `source` to `showPopover()` or `togglePopover()`. A popover opened without one has
  no anchor: CSS can still position it, but it gets no arrow and no offset.
- The `[actual-placement]` and `[anchored]` attributes have been replaced by the `anchored-top`,
  `anchored-right`, `anchored-bottom` and `anchored-left` custom states. Update any custom styles
  targeting these attributes to `sl-popover:state(anchored-bottom)` and friends. The side is also
  readable from JavaScript as the `placement` property, which is `undefined` while the popover has
  no anchor.
- The `Popover.offset`, `Popover.arrowPadding` and `Popover.viewportMargin` statics have been
  removed. The gap between the anchor and the popover is now the `--_offset` custom property
  (default `12px`), and the arrow sits in that gap, overlapping the border of the container so the
  two shapes join up. The distance to the viewport is the `margin` of the popover, and there is no
  arrow padding any more: the arrow is positioned off the center of the anchor and stays pointing
  at it when the browser pushes the popover back into view.
- The `--sl-popover-max-inline-size` custom property has been removed. Set `max-inline-size` on the
  popover directly; it no longer defaults to `80vw`.
- A `wrapper` part has been added around the container and the arrow, and `container` now wraps
  only the slotted content. A style that relied on `container` being the outermost element should
  target `wrapper` instead.
- The padding of the container has been decreased from `--sl-size-300` to `--sl-size-200`, so every
  popover is a little smaller than before.

#### New features

- The popover positions itself against the element that invoked it. When it is opened by an
  invoker — either through the Invoker Commands API or by passing a `source` to `showPopover()` or
  `togglePopover()` — that element becomes the popover's anchor:

  ```html
  <sl-button command="toggle-popover" commandfor="my-popover">Toggle popover</sl-button>
  <sl-popover id="my-popover">Popover content</sl-popover>
  ```

  ```js
  popover.showPopover({ source: button });
  ```

- The popover no longer slides along its anchor to stay in view; it flips instead.
- The invoker is described by the popover with `aria-describedby` when the content is plain text
  and `no-describedby` is not set, just as the anchor was before. An `aria-describedby` you set
  yourself is left alone, and the one the popover added is removed again when it closes. The
  `aria-details` relationship is no longer set here: an invoker command gives the button that
  implicitly, on its accessible node rather than as an attribute.
