# Code Connect probe log — 17264:29098 (FAM - Users)

Server: `figma` (remote). Date: 2026-10-01.

## Root probe

`get_code_connect_map(17264:29098)` → `{}`.

This is **not** evidence that Code Connect is dead. Two sibling probes on the same
subtree returned live `hasTemplate: true` snippets seconds later. Rule 2 of the batch
brief is confirmed again: **the whole-subtree probe is unreliable; probe per node.**

## Per-node probes (8 nodes)

| Node ID                         | Node name                    | Result                                                                                      | Resolved                                                                                    |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 17266:31419                     | sl-button-rectangular        | snippet, `hasTemplate: true`                                                                | `<sl-button variant="primary">` + `<sl-icon name="far-plus">`                               |
| 17557:100187                    | sl-select (simple-prototype) | snippet, `hasTemplate: true`                                                                | `<sl-form-field label="Last login date"><sl-select>`                                        |
| 17557:100187 (`0:3` side entry) | —                            | `hasTemplate: false`, `componentName: null`, source `packages/components/form/src/label.ts` | `sl-label` — third state per rule 3: identified without a snippet                           |
| 17266:31414                     | sl-searchfield               | `{}`                                                                                        | identified by `sl-*` node name → `sl-search-field`                                          |
| 17264:29105                     | tabbar-horizontal            | `{}`                                                                                        | identified by shape + `tabs`/`tab-base`/`tab-indicator` sub-nodes → `sl-tab-group`/`sl-tab` |
| 17264:29099                     | top nav bar                  | `{}`                                                                                        | app chrome; children resolve to `sl-icon` + `sl-avatar` by data-name                        |
| 17264:29115                     | th-text-start                | `{}`                                                                                        | Vuetify data-table part (doc link = vuetifyjs.com) → `sl-table` header                      |
| 17264:29116                     | td-text-start                | `{}`                                                                                        | Vuetify data-table part → `sl-table` body cell                                              |
| 17264:29167                     | mat-data-footer              | `{}`                                                                                        | Vuetify paginator → `sl-paginator`                                                          |

## Recovery from `get_design_context` (rule 2, second method)

`data-name` attributes inside the flattened tree name real components that the CC map
never returned. The high-value recovery:

- `17264:29157` / `:29158` / `:29159` (the per-row action cells) each contain
  `data-name="sl-button-rectangular"` → **6 × `sl-button`** ("Edit"/"Delete", plain
  variant, `--sl-color-foreground-primary-bold`). The CC map returned nothing for the
  td nodes; without the design-context snippet these six buttons would have been
  invisible to the pipeline.
- `I17264:29099;25806:56903` → `data-name="sl-avatar"` → `sl-avatar`.
- `I17264:29099;23066:86145;6539:37591` → `data-name="sl-icon"` → `sl-icon`.

Also recovered: the "Component descriptions" block in
`figma-design-context-part2.md` lists library docs URLs
(`sanomalearning.design/categories/components/...`) for `sl-icon`, `sl-avatar`,
`sl-searchfield`, `sl-select (simple-prototype)`, `sl-button-rectangular` — independent
confirmation that these are real SLDS library components, not look-alikes.

## Rule 4 confirmation

Nested instance ids (`I17264:29099;23066:86145;...`) are rejected by the remote server
(`must be in the format "123:456"`), so they were never probed directly. Their absence
from the CC map means nothing.

## Not blocked

Per the batch brief, no `BLOCKED_ON_CODE_CONNECT` was emitted. Unmapped instances are
recorded as "as-is" and resolved by name/shape where possible.
