# get_design_context raw responses (gathered while probing Code Connect coverage, before the BLOCKED_ON_CODE_CONNECT determination was finalized)

These calls independently corroborate the Code Connect finding: the generated code for every region below is plain reconstructed React+Tailwind (divs, raw hex colors, raw px), with NO `<sl-*>` elements and no Code-Connect-resolved snippets anywhere — consistent with the get_code_connect_map results (all empty).

## Region: notes-sidepanel (5308:32162)

Screenshot: side panel with "Notes" header, "See all" button, close (x) icon-button, two checkbox filters ("Highlights", "Notes"), and two note-thread groups each containing "saved general" (plain note) and "saved" (highlight note) cards with edit icon-button, date text, and (for highlights) a yellow `Highlight` marker under the quoted title.

Component descriptions surfaced by Figma for nodes inside this region:

- Icon-button (11360:135408) — "implemented, Variants"
- Button (12026:147754) — "implemented"
- cross (601:1856) — search hints: "x close"
- Checkbox-with-text (5306:67658) — "implemented"
- Choice=Checked, State=Default (4214:11777) — "Checkbox / Checked"
- check-sec (1707:28345) — search hints: "success, correct, check"
- Spacer (5306:67703) — "Empty frames used to define margins and paddings around elements."

Style/token names referenced: Primary/$kampus-color-purple-7 (#643695), UI/Button, Neutrals/$kampus-color-white (#FFFFFF), Neutrals/$kampus-color-gray-9 (#0E0E0F), Headings/Level 5, Primary/Default (#643695), UI/Small, grays/gray-1 (#F5F5F6), grays/gray-3 (#CECFD2), Neutrals/$kampus-color-gray-8 (#29292B), Body/Small, Neutrals/$kampus-color-gray-7 (#444548), UI/Tiny, Neutrals/$kampus-color-gray-1 (#F5F5F6), Neutrals/$kampus-color-gray-3 (#CECFD2), Dashboard/SU Not assessed (#DB7109), $color-ui-lightgrey (#DFE3E6).

## Region: content (5308:32163) — breadcrumb, chapter title, student-view toggle, subchapter card grid

Component descriptions surfaced:

- Button (12026:147754) — "implemented"
- chevron-right (107:1162) — search hints: "chevron-right, chevronright, forward, next"
- Icon-button (11360:135408) — "implemented, Variants"
- chevron-left (1701:8112) — search hints: "chevron left, chevronleft, back, previous"
- Icon-button (1701:4877) — "implemented, Variants"
- Simple-toggle (1702:18965) — "implemented"

Style/token names referenced: Primary/$kampus-color-purple-7, UI/Button, Primary/Default, Neutrals/$kampus-color-gray-9, UI/Extra-small-semibold, Neutrals/$kampus-color-gray-1, Primary/$kampus-color-purple-1 (#F0ECF5), "breadcrumb gradient grey" (gradient, no hex given), New look & feel 2023/h1 (desktop), Neutrals/$kampus-color-gray-6 (#6D6E73), shadow-low (drop shadow #6D6E7359, offset 0/2, radius 8), Body/Small, New look & feel 2023/h4 (desktop), Neutrals/$kampus-color-white, Neutrals/$kampus-color-gray-3.

8 subchapter-card instances repeat the same "🏗️ subchapter-link-card_base" component (two variants: solid-shadow card and dashed/locked "opacity-50" card), each: cover image(s) with a purple overlay wash, title text, and an ellipsis Icon-button top-right.

## Region: Left-toolbar (5308:32182)

Vertical icon rail, 74px wide: profile photo thumbnail, then 5 "Filter"/"left-toolbar-item" rows (Contents / Edit content / Assignments / Notes [active, purple bg + bottom border] / Access key), two of which carry a "number-tag" badge (Edit content: unlabelled dot; Assignments: "1").

Component descriptions: toc (1701:8296) search hints "table of contents, TOC"; number-tag (1001:2105) "implemented"; access-key-sec (1701:8300) search hints "access key".

Tokens: Primary/$kampus-color-purple-7, UI/Extra-Tiny, Neutrals/$kampus-color-gray-3, Neutrals/Full White, Dashboard/kampus-color-orange-8 (#DB7109), Neutrals/$kampus-color-white, UI/Tiny-bold, Primary/$kampus-color-purple-1, "Bottom Borders/Primary 4px" (inset shadow, color #643695, offset 0/-4), shadow-low.

## Region: Header-navigation (5308:32183)

Purple top nav bar, 1280px wide: "My page" (with home icon), main nav ("Learning materials" active/lighter purple pill, "Tests", "Dashboard"), then right-aligned icon buttons (search, notification bell with "3" badge, help, account).

Component descriptions: notification (1701:4728) search hints "notification, bell"; number-tag (1701:4721) "implemented"; account (401:3572) search hints "profile, account".

Tokens: Neutrals/$kampus-color-white, UI/Button, Primary/$kampus-color-purple-7, UI/Extra-tiny-semibold, Dashboard/kampus-color-orange-8, shadow-low.

## Region: Fullscreen toggle (5308:32159)

Small floating control: a circular white Icon-button (expand icon) + two-line "View fullscreen" caption below it.

Component descriptions: Icon-button (11360:135408) "implemented, Variants".

Tokens: Primary/$kampus-color-purple-7, Neutrals/$kampus-color-white, shadow-low, UI/Extra-Tiny.

## NOT drilled into (left unexplored due to budget / because the run blocked on Code Connect before completing the remaining regions)

- Table of contents - Elements basics (5308:32161) — hidden in this variant, not rendered.
- Student view (hidden duplicate, 5308:32181) — hidden, not rendered.
- Individual nested leaf-level instances inside notes_side-panel_content-area beyond what the notes-sidepanel call already exposed (e.g. the hidden "add new general" / "add new to highlight" editor-toolbar variants, "empty state" variant) — these are alternate/hidden states of the notes list, not part of the visible "With notes" composition.
- get_variable_defs was not called (run blocked before this required step).
- get_screenshot was not called (run blocked before this step; per instructions, screenshot/variable-defs are skipped once BLOCKED_ON_CODE_CONNECT is determined).
