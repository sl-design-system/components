# Corpus candidates — survey of 2026-09-30 (revised after review)

> **Machine-readable:** [`corpus-candidates.json`](corpus-candidates.json) — the same two lists as
> data, which is what the corpus registry is built from.
>
> **Visual review page:** <https://claude.ai/code/artifact/9817634e-3ff8-4317-9960-d06d8e3b4f25> —
> every candidate rendered, with its metrics and a link to the frame in Figma.

Input to `T-NOJIRA-figma-to-code-04`. The first pass selected on structure alone and produced
fragments, wireframes, covers and near-duplicate variants. This pass adds three filters and a
visual check.

**Filters that worked, and are worth keeping in the intake report:**

1. **Frame width must match a real viewport** (360/375/390/768/1024/1280/1366/1440/1512/1920 ±8)
   and height ≥ 600. Removes widgets, boards and thumbnails — the `481×1024`, `764×412`,
   `1029×617`, `1695×720` frames that dominated the first list.
2. **At least 10 distinct component types**, and instance density between 0.08 and 0.6. Removes
   covers, annotation frames and component variants: a full page draws on many components, a
   fragment on a handful.
3. **Full-frame overlay detection** — a rectangle or boolean shape covering the frame at reduced
   opacity is a designer's marking, not part of the design. 43 frames excluded on this, including
   the grey sheet over the MyPortal page and the `highlight` layer at 52% opacity that sits on
   **every** Folio full page.
4. **Deduplicate by component histogram** (cosine > 0.85 within a team = the same screen). This is
   what collapsed 410 frames into 51 distinct families, and it catches variants that differ only
   by a colour, a note or one element — which name-matching never would.

Result: 545 screens → 410 full pages → **51 visually distinct families**.

---

## List A — verified by eye, ready to freeze

Eleven cases, each rendered and looked at. See the review page linked above for the images.

| # | Team | Screen | Role in the corpus |
|---|---|---|---|
| A1 | Kampus | Subchapter feed page | clean, richest — 83 component types |
| A2 | NSP | class overview | clean, largest — 10 936 nodes |
| A3 | MyPortal | Chapter / Digital Exercises | rich product page, moderate override |
| A4 | Sesame | My Groups | override extreme — 91% |
| A5 | ETSL | Metadata usage | widget dashboard, partial coverage 82% |
| A6 | Itsl-Collab | Shared folder – teacher view | rich, 71 component types |
| A7 | MyPortal | Materials / Overviews | detached candidates + 64% override |
| A8 | NSP | Group list | detached candidates (12) |
| A9 | SANNA | Login 1 | simplest clean page — the sanity case |
| A10 | ETSL | FAM – Users | data table page: filters, table, row actions, pagination |
| A11 | Sesame | Learning materials | mobile, 360 wide — the only responsive case |

Two entries were replaced after review. **ETSL `Part 1`** was a fragment — the search area of a page,
not a page — and is replaced by `FAM – Users`, found by surveying four more of ETSL's 21 pages.
**Kampus `1920`** was a cover and is out; the mobile slot it left is filled by Sesame's 360-wide
page instead.

**A9 is the deliberate floor case.** A login screen is simple, and that is the point: if the
pipeline cannot reproduce the simplest clean page in the corpus, no score on the harder ones means
anything. It is also the first case to drop if it proves to teach nothing.

---

## Rejected on sight, and why

- **Itsl-Collab `collaboration folder - teacher`** — a wireframe: placeholder boxes labelled
  *Description* and *Table content + actions*, with a handwritten *main content* annotation.
  Real chrome, unfinished body. Not a fidelity case.
- **NSP `Widget`** — no instances at all; guidance for designers, not a screen.
- **SANNA `Frame 1000001011`** — a thumbnail, and its node id addresses a node inside an
  instance, so it cannot be frozen as a case.
- **Near-duplicate pairs** (`Localization`, `Default home page`, `Advanced search`,
  `Group details`, `Feedback - General`, `COVER`/`PARAGRAPH`) — now collapsed automatically
  by the histogram fingerprint rather than spotted by hand.

## Still open

- **Five teams are not yet represented in List A**: SANNA, NSP is present only via a simple
  page, It's learning, TEAS and Folio's second team. TEAS produced **no** full-page
  candidate at all under these filters — worth checking whether its designs are simply
  smaller, or whether the filters are too strict for it.
- **MAX and the Folio team link** remain unsurveyed; both need the `projects:read` scope.
- **`lib` still means *a* published library, not *ours*** — needs `team_library_content:read`.
- The representativeness sample (List B, two per team) should be rebuilt from the 51
  families rather than from the first pass.

## Team profiles — unchanged, from all 545 screens

Median library resolution is 90–100% in every team. What separates them is overrides:
It's learning 11–12%, Kampus 15%, SANNA 17%, NSP 21%, Folio 24%, MyPortal 54%, ETSL 60%,
Sesame 85%, TEAS 85%. That is a team profile rather than noise, and it is the single
strongest argument for keeping a per-team sample alongside the type-based corpus.
