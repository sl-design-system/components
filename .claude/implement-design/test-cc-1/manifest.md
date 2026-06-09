# `/implement-design` Manifest — Test-CC / Course Settings

- **Figma file:** Test-CC (`yRl4p1t9CdtHsgxhc6akw5`)
- **Node:** `104:1084` — "Mathematics Admin · Course Settings" (987 × 1500 px)
- **Source URL:** https://www.figma.com/design/yRl4p1t9CdtHsgxhc6akw5/Test-CC?node-id=104-1084&m=dev
- **Generated:** 2026-06-08
- **Server used:** `figma-desktop` (data calls) + `figma` remote (screenshot)
- **i18n:** ON (source locale `en`; design language English)
- **Screenshot:** `.claude/implement-design/test-cc-1/screenshot.png` (real PNG, 674 × 1024)
- **Stage reached:** 2 approved → proceeding to Stage 3 (Approve & generate)

---

# Part 1 — Design Manifest

## Overview

Figma file Test-CC, node `104:1084` "Mathematics Admin · Course Settings" (987 × 1500). An admin settings page for course "Algebra I": breadcrumb, a title bar with status badge, tab navigation (Overview selected / Content / Students / Settings), three collapsible form panels (General Information, Schedule & Capacity, Permissions & Visibility), and a bottom button bar (Cancel / Save Draft / Save & Publish).

## Existing SLDS Components Used

| Node ID                | Node Name                        | Mapped Component                                                  | CC Snippet (excerpt)                                                                         |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 119:16992              | Breadcrumb                       | `<sl-breadcrumbs>`                                                | `<sl-breadcrumbs><a>Mathematics</a>…</sl-breadcrumbs>`                                       |
| 124:6486               | Published Badge                  | `<sl-badge color="green" size="lg">`                              | `<sl-badge color="green" size="lg"><sl-icon name="fas-check"></sl-icon>Published</sl-badge>` |
| 119:17655              | Tabs                             | `<sl-tab-group>`                                                  | Overview(selected), Content, Students, Settings                                              |
| 119:18576              | Panel — General Information      | `<sl-panel density="relaxed" heading="General Information">`      | —                                                                                            |
| 119:19914              | Panel — Schedule & Capacity      | `<sl-panel density="relaxed" heading="Schedule & Capacity">`      | —                                                                                            |
| 119:20689              | Panel — Permissions & Visibility | `<sl-panel density="relaxed" heading="Permissions & Visibility">` | —                                                                                            |
| 119:21474              | Button Bar                       | `<sl-button-bar fill="outline">`                                  | Cancel / Save Draft / Save & Publish (last `variant="primary"`)                              |
| 555:2459               | Course Name                      | `<sl-form-field label="Course Name"><sl-text-field>`              | value "Algebra I — Foundations"                                                              |
| 555:2498               | Course Code                      | `<sl-form-field label="Course Code"><sl-text-field>`              | value "MATH-101"                                                                             |
| 555:2628               | Grade Level                      | `<sl-form-field label="Grade Level"><sl-text-field>`              | value "Grade 9 – 10"                                                                         |
| 555:2667               | Course Description               | `<sl-form-field label="Course Description"><sl-text-area>`        | —                                                                                            |
| 555:1031               | Difficulty Level                 | `<sl-form-field label="Difficulty Level"><sl-radio-group>`        | hint "Select the appropriate difficulty…"; Beginner/Intermediate/Advanced                    |
| 555:1885               | Additional Options               | `<sl-form-field label="Additional Options"><sl-checkbox-group>`   | hint "Choose which features to enable…"                                                      |
| 555:1857 / 555:1873    | Switches                         | `<sl-switch reverse>` (one `checked`)                             | Permissions & Visibility                                                                     |
| 555:1162 / 1180 / 1198 | Buttons                          | `<sl-button>`                                                     | Cancel / Save Draft / Save & Publish                                                         |

Also: Start/End date = `sl-text-field` + `sl-icon name="far-calendar"`; Subject Area = `sl-text-field` + `sl-icon name="far-chevron-down"` (select-style); Max Enrollment = `sl-text-field`. Null-mapped sub-nodes resolvable as SLDS (icons, breadcrumb items, radio/checkbox items, label internals) are treated as connected.

## Composition Candidates

- Title Bar (119:17649 / 17650 + badge 124:6486): two-line title/subtitle + status badge.

## Net-New Primitive Candidates

_None._ All elements map to existing SLDS components.

## Responsive Breakpoints

_Single breakpoint: 987px._

## Designer Annotations

_None._

## Token Reference

- **Color** — no `--sl-color-*` emitted. Raw: `#121721` (page bg), `#f5f7fc` (heading), `#9ea8b8` (subtitle), shadow `#00000017` / `#0000000D`.
- **Size / Spacing** — no `--sl-size-*` emitted. Raw: 18px (section gap), 4px (heading/subtitle gap), 40px/28px (page inset padding).
- **Typography** — `text-new/typeset/fontFamily/body`, `size/text-new/body/md`, `text-new/typeset/fontWeight/regular`, `text-new/typeset/fontWeight/semiBold`, `size/lineHeight/250`. Heading raw semibold 28px; subtitle normal 14px (Inter).
- **Other** — `shadow.sm`: `#00000017` (0,1) r1; `#0000000D` (0,3) r2.

---

# Part 2 — Approved Decomposition (trimmed)

> Approved by user with **"Approve & generate"** at the Stage 2 checkpoint, after a redirect that dropped the empty placeholder tab panels (Content/Students/Settings) and inlined the three form sections into the Overview panel.

## Component Tree

```
<sl-course-settings-page>              (new — root / data owner; location TBD at Stage 3)
  ├── uses: <sl-breadcrumbs>, <sl-tab-group>/<sl-tab>, <sl-button-bar>/<sl-button>  (existing)
  ├── <sl-course-settings-title-bar>   (new → <root>/title-bar/; presentational; uses <sl-badge>)
  └── <sl-course-settings-overview-panel>  (new → <root>/overview-panel/; presentational; Overview tab content)
        renders inline: <sl-panel> ×3 (General Information, Schedule & Capacity, Permissions & Visibility)
        + <sl-form-field>, <sl-text-field>, <sl-text-area>, <sl-radio-group>, <sl-checkbox-group>, <sl-switch>, <sl-icon>
```

## `<sl-course-settings-page>` (root, data owner)

- **Location**: chosen at Stage 3 location checkpoint.
- **Owns/fetches** a `CourseSettings` record (e.g. `GET /api/courses/:id/settings`; mock in the example): `{ id, name, code, gradeLevel, description, difficultyLevel: 'beginner'|'intermediate'|'advanced', additionalOptions: string[], startDate, endDate, subjectArea, maxEnrollment, enrollmentVisibility: boolean, selfEnrollment: boolean, status, breadcrumbs: {label,href?}[] }`. Passes subsets to children.
- **Property**: `courseId: string`.
- **Events**: `sl-cancel`, `sl-save-draft` (`{settings}`), `sl-save-publish` (`{settings}`).
- **Role**: `main`. Renders breadcrumbs, title-bar, tab-group (Overview selected), overview-panel, button-bar.
- **Tokens**: page bg raw `#121721`; inset 40/28px (no token); `shadow.sm`.

## `<sl-course-settings-title-bar>` (presentational)

- **Location**: `<root>/title-bar/`.
- **Receives**: `heading: string`, `subheading: string`, `status: 'published'|'draft'|string`.
- Renders an `<h1>` heading + subheading + `<sl-badge>` driven by `status`. Role `banner`.
- **Tokens**: heading `#f5f7fc` semibold 28px; subtitle `#9ea8b8` regular 14px (`size/text-new/body/md`); gap 4px; family `text-new/typeset/fontFamily/body`; line-height `size/lineHeight/250`.

## `<sl-course-settings-overview-panel>` (presentational)

- **Location**: `<root>/overview-panel/`.
- **Receives** (from root): `courseName, courseCode, gradeLevel, description, difficultyLevel, additionalOptions, startDate, endDate, subjectArea, maxEnrollment, enrollmentVisibility, selfEnrollment`.
- Renders the three `<sl-panel>` form sections inline (not separate components — no reuse in this design).
- **Event**: `sl-overview-change` (`{field, value}`).
- **Tokens**: 18px section gap; `shadow.sm` on panels; body typography for labels/hints.

## Localized Strings (i18n ON; source = English)

Namespaced `sl.courseSettings*` ids. Key strings: breadcrumb (Mathematics, Course Settings); title-bar (heading "Algebra I", subheading, status "Published"); tabs (Overview/Content/Students/Settings); section headings (General Information, Schedule & Capacity, Permissions & Visibility); field labels (Course Name, Course Code, Grade Level, Course Description, Difficulty Level, Additional Options, Start date, End date, Subject Area, Max Enrollment); hints ("Select the appropriate difficulty…", "Choose which features to enable…"); radios (Beginner/Intermediate/Advanced); button bar (Cancel, Save Draft, Save & Publish). (Full table in the decomposer output; implementer wires `msg('<English>', { id })`.)

## Open Questions (carried into generation)

1. Raw spacing/sizing (40/28px insets, 18px gap, 28px heading) — no `--sl-size-*` tokens; confirm or use raw with comment.
2. Raw colors (`#121721`, `#f5f7fc`, `#9ea8b8`) — confirm `--sl-color-*` equivalents or hardcode with note.
3. `shadow.sm` — does `<sl-panel>` already apply it, or wrapper concern?
4. Button-bar ownership — placed on root (spans tabs); confirm Save actions aren't Overview-only.
5. The two switch labels and the Additional Options checkbox items aren't enumerated in the manifest — implementer reads them off the screenshot.
6. Status values beyond "Published" (draft/archived?) and their badge colors.
7. Subject Area: `<sl-text-field>`+chevron vs. a real select; Date fields: decorated text field vs. date picker.
8. Future Content/Students/Settings tabs: named slots vs. consumer-controlled (deferred — panels not generated).
