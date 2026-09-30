# get_design_context raw response — node 334:20573 (Group list), fileKey 4TdMrcnIVOn3Hrfj2OpVZU

NOTE: The MCP response was truncated by the tool at its 25000-token output cap (the header of a
"sl-button-pill" / header-bar section — node 334:20685 and its descendants — was the last part
returned before truncation notice; the header-bar markup below IS fully captured, truncation hit
right after it). The screenshot, variable/style summary, and Code Connect component-description
block were all still within the returned (non-truncated) portion and are included below verbatim.

## Reference code (React/Tailwind reference emitted by the tool — NOT the implementation target;

target is Lit per the run's framework parameter)

(See conversation transcript for the exact code payload — reproduced faithfully in the manifest's
component/token analysis below. Key excerpts preserved for reproducibility:)

- Asset path prefix: https://www.figma.com/api/mcp/asset/a09e3494-2cc8-4b58-b3bf-989a4bd5711b
- Top-level node: data-node-id="334:20573" data-name="Group list"
- Headings: "Welcome back, Sarah" (334:20576), subtext (334:20577)
- "Live now" section label (334:20582) with sl-badge dot (334:22670, badge-base-sm/dot)
- Live lesson card (334:20585): image (334:20586), "Class H4A" / "English" (334:20588-590),
  avatar cluster (334:20591/20592) with sl-avatar instance 334:20593 (display-name="7 students
  already joined", display-initials="JV", color=primary, emphasis=bold) plus three exploded/
  detached "sl-avatar" frames (334:20594, 334:20618, 334:20642) rendering the stacked-circle
  avatar imagery, each with internal Avatar/avatar-content/Mask/Base-Icon/image anatomy.
  Action buttons (334:20666/20667): "Action 1" = sl-button variant=primary shape=pill "Join live
  lesson" (334:20668); "Action 3" = sl-button shape=pill "Use lesson code" (334:20669); "Action 2"
  = sl-button fill=ghost shape=pill "Open e-book" (364:19522).
- "My groups" section label (334:20673) + 2-column grid (334:20677) of sl-card Actionable
  instances: 334:20678 (Class H5A / Biologie voor jou - havo 5), 334:20679 (Class V5B / vwo 5),
  334:20680 (Class V6C / vwo 6), 334:20681 (Class V4A / vwo 4), 334:20682 (Class H4A / havo 4),
  334:20683 hidden=true (not rendered, excluded from count).
- Top header bar (334:20685 "Frame 26"): Logo instance (I334:20685;111:12383, asset imgLogo),
  icon button "sl-button-pill" (I334:20685;10:557, teal outline, bell/notification icon via
  icon-color-mask), account control (I334:20685;10:4007) containing sl-avatar
  (I334:20685;10:4007;10:2841) + sl-icon "chevron-down" (I334:20685;10:4007;10:3939), and a
  notification sl-badge dot (I334:20685;67:2159) absolutely positioned over the bell button.

## Font styles referenced

Heading/xl, Body/lg/regular, Heading/lg, Body/md/regular, Body/md/bold, Heading/md — all resolved
via `text-new/typeset/*` variables (fontFamily/heading = fontFamily/body = Open Sans in variable
defs; theme.css confirms Open Sans hookup).

## Code Connect component descriptions returned inline by get_design_context

- accent=red, emphasis=bold, size=sm (4:7027) — "A vibrant blue background option, applied purely
  for stylistic purposes without specific meaning."
- sl-badge (4:6994) — "A badge is a non-interactive visual indicator used to communicate status."
  Docs: https://sanomalearning.design/categories/components/badge/usage/
- badge-base-sm (4:6417) — "Use for headers and labels."
- sl-avatar (10:824) — "An avatar is a visual representation of an entity, such as a user or an
  organization." Docs: https://sanomalearning.design/categories/components/avatar/usage/
- sl-button-pill (1:4411) — "A button initiates an action when clicked... INVERTED BUTTONS are
  only to be used with elevation.surface.raised.inverted and elevation.surface.raised.primary."
  Docs: https://sanomalearning.design/categories/components/button/usage/
- Icon only=false, Size=MD (1:873) — "Use for borders that highlight secondary actions."
- sl-card Actionable (4:7262) — "Cards display content or actions related to a single subject...
  should be easy to scan." Docs: https://sanomalearning.design/categories/components/card/usage/
- Icon only=true, Size=MD (1:874) — "Use for borders that highlight secondary actions."
- sl-icon (1:397) — "Icons communicate messages, enhance interactivity, and highlight critical
  information." Docs: https://sanomalearning.design/categories/components/icon/usage/

## Screenshot returned alongside this call

1024x820 px render (see get_screenshot output / cached screenshot.png), showing: teal "Welcome
back, Sarah" heading, teal dot + "Live now" label, a teal-bordered live-lesson card (photo, "Class
H4A"/English, stacked avatar circles + "7 students already joined", 3 stacked pill buttons: solid
teal "Join live lesson", light-grey "Use lesson code", text-only "Open e-book"), a "My groups"
section heading, and a 2-column x 3-row grid of 5 visible class cards (thumbnail + class name +
subtitle), and a top header bar: teal square "S" logo mark, bell icon button with a small red
notification dot badge, and an avatar + chevron-down "account" pill control.
