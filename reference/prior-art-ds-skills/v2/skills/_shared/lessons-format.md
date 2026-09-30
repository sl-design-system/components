---
topic: lessons-format
applies_to: [sl-ds-lesson, sl-ds-layout, sl-ds-plan, sl-ds-update, sl-ds-implement]
last_updated: 2026-06-09
---

# DS Lessons — Format & Reading Discipline

> **Purpose:** Canonical spec for `context/foundation/sl-ds-lessons.md` — the team-specific learning ledger. Architectural skills (`sl-ds-layout`, `sl-ds-plan`, `sl-ds-update`, `sl-ds-implement`) READ this file at start to apply accumulated rules. `/sl-ds-lesson` is the only WRITER. Standalone (no dependency on any external ecosystem — this is DS-specific learning).

## 1. Why lessons exist (and why they're separate from fe-standards)

`.agents/standards/fe/angular.md` (NG-*) and `.agents/standards/fe/sanoma-ds.md` (SDS-*) capture **framework-level invariants** ("Angular uses signals, not @Input"; "Every `<sl-*>` tag needs an imported wrapper"). They apply everywhere, never expire, change only with framework or DS library upgrades.

`context/foundation/sl-ds-lessons.md` captures **team/project-level rules** ("This project always uses Signal Store for shop/* features because of incident X"). They:
- Are specific to THIS team / project
- May expire when the context changes (lesson tagged with `valid-until` or removed)
- Are added by humans (via `/sl-ds-lesson`) when a pattern is worth surfacing
- Do NOT belong in fe-standards because they aren't universal

Each lesson is a small unit. The file accumulates them; skills filter by relevance.

## 2. File location

`context/foundation/sl-ds-lessons.md` — **standalone Sanoma Learning DS path**. The file exists only when the team has added at least one lesson via `/sl-ds-lesson`. Skills that declare `lessons_read: true` (per SCHEMA.md §3.6) handle gracefully when the file is absent.

## 3. File structure

```markdown
---
schema_version: "1.0"
last_updated: 2026-06-09
total_lessons: 4
---

# DS Lessons — Team Learning Ledger

> Curated by `/sl-ds-lesson`. Read at start by architectural skills declaring `lessons_read: true`.
> **Never edit manually unless removing an expired/wrong lesson.** Always prefer `/sl-ds-lesson` for additions.

## Active Lessons

### <lesson-id-kebab>

- **applies_to:** [<skill-id>, <skill-id>]
- **scope:** project-wide | feature:<name> | screen:<name> | figma-file:<fileId>
- **severity:** must-follow | prefer | info
- **rule:** <One-sentence actionable statement. Imperative mood.>
- **why:** <Multi-sentence rationale — incident, decision, preference.>
- **added:** <YYYY-MM-DD>
- **valid_until:** <YYYY-MM-DD | "indefinite">

### <next-lesson-id>
...

## Expired Lessons

(Lessons that have been superseded but kept for audit trail. Moved here by `/sl-ds-lesson` with `--expire` flag.)

### <expired-lesson-id> _(expired YYYY-MM-DD: <reason>)_
...
```

## 4. Field semantics

### `applies_to` (required)

List of skill IDs that should consult this lesson. The skill at start filters lessons by membership in this list.

Common values:
- `[sl-ds-plan]` — architectural decision lesson (state mgmt, structure)
- `[sl-ds-layout]` — layout/shell-related lesson
- `[sl-ds-update]` — diff interpretation lesson
- `[sl-ds-implement]` — code-writing lesson
- `[sl-ds-plan, sl-ds-implement]` — applies to both (e.g. component naming convention that affects both arch decision AND generation)

The `/sl-ds-lesson` skill enforces that values are real skill IDs (no typos).

### `scope` (required)

One of:
- `project-wide` — always applies when the skill runs (default for most rules)
- `feature:<name>` — applies when current work is under a specific feature (skill detects via `$ARGUMENTS`, `targetScope`, or `architecture.json` paths)
- `screen:<name>` — applies for a specific screen ID (kebab-case, matches `sl-ds-decisions/<screen>.md` IDs)
- `figma-file:<fileId>` — applies for a specific Figma file (matches `inputs.figmaUrl` parsed)

### `severity` (required)

| Severity | Behavior in framing | Behavior in question |
|---|---|---|
| `must-follow` | Surfaced as constraint in Interpretation. **Proposed direction must comply.** | Options violating the lesson get a 🚫 marker; not picked as ⭐ Recommended |
| `prefer` | Surfaced in Interpretation as "Lesson suggests X". Tilts ⭐ Recommended toward it. | Options aligned with the lesson get a 👍 marker |
| `info` | Surfaced in Observation. No effect on Proposed direction or options. | Mentioned in evidence block, doesn't drive recommendation |

### `rule` (required)

ONE sentence, imperative mood. Examples:
- ✅ "Always use Signal Store for any feature under shop/*; never Service+RxJS."
- ✅ "Treat Figma node renames from PromoXX to CtaXX as semantic; rename code identifiers."
- ✅ "Never use sl-card for grid containers, even when Figma names it Card."
- ❌ "Signal Store is preferred" (vague — what's the action?)
- ❌ "Long rule explaining several edge cases and considerations across multiple sentences and contexts" (too complex; split into multiple lessons)

### `why` (required)

Multi-sentence rationale. Cite an incident, decision date, or preference reasoning. This is what makes the lesson DEFENSIBLE when a skeptic asks. Without `why`, lessons rot — no one remembers why they exist, so they get ignored or removed unsafely.

### `added` (required)

ISO date `YYYY-MM-DD`. Set by `/sl-ds-lesson` at write time.

### `valid_until` (optional, defaults to "indefinite")

ISO date or `indefinite`. If a date and that date has passed → skill emits warning "Lesson <id> may be stale (expired <date>)" and treats severity as `info`.

## 5. Reading discipline (consumers — sl-ds-layout, sl-ds-plan, sl-ds-update, sl-ds-implement)

### 5.1 At skill start

```
1. test -f context/foundation/sl-ds-lessons.md
   → if absent: no lessons; log "No team lessons file; proceeding with defaults"; continue
2. parse the file
3. filter applicable lessons:
   - applies_to includes my skill ID
   - scope matches current context:
     - project-wide → always match
     - feature:<name> → match if targetScope path or screen ID contains <name>
     - screen:<name> → match if current screenName == <name>
     - figma-file:<id> → match if figmaUrl resolves to <id>
4. filter out expired (valid_until in past) and Expired Lessons section
5. categorize remaining by severity (must-follow | prefer | info)
6. carry forward into framing block
```

### 5.2 In framing block — and conflict resolution with fe-standards

When applying [`framing-discipline.md`](framing-discipline.md), integrate lessons:

**In Observation:**
- List `info`-severity lessons that apply: "Lesson `<id>`: <rule>"

**In Interpretation:**
- For `must-follow`: "Lesson `<id>` REQUIRES <rule> — constrains proposal to options that comply"
- For `prefer`: "Lesson `<id>` suggests <rule>; this tilts the recommended direction"

**In Proposed direction:**
- For `must-follow`: ⭐ recommendation MUST comply; non-complying options get 🚫
- For `prefer`: ⭐ recommendation aligns with the lesson where possible
- For `info`: no effect

#### Conflict resolution priority (v1.2 — single source of truth)

**This is the canonical conflict order for the entire Sanoma Learning DS suite. All other docs cite this section.** When multiple rule sources disagree, this priority decides (top = wins):

1. **`sl-ds-lessons.md` lesson with `severity: must-follow`** — **always wins.**
   Project/team-specific override. The lesson MUST cite the rule ID from fe-standards that it overrides (e.g. "this lesson overrides STATE-2 for shop/* features because of the Q3 incident"). If no citation, `/sl-ds-lesson` emits a WARN at write time.

2. **`.agents/standards/fe/sanoma-ds.md` SDS-*** — Sanoma Learning DS specialization.
   Wins over generic fe-standards and over `angular.md` for projects using SLDS. Example: SDS-3 (NEVER use `sl-card` as a layout container) wins over COMP-2 (layout = skeleton — generic) in matters of Shadow DOM padding.

3. **`.agents/standards/fe/angular.md` NG-*** — framework specialization.
   Wins over generic for framework-specific idioms. Example: NG-1 (standalone+zoneless+OnPush) wins over generic component rules.

4. **Generic fe-standards** — `architecture.md` (ARCH-*, NAME-*), `components.md` (COMP-*), `data-and-state.md` (STATE-*, DATA-*), `styling.md` (STYLE-*), `forms.md` (FORM-*), `errors.md` (ERR-*), `testing.md` (TEST-*), `conventions-and-tooling.md` (TOOL-*, A11Y-*, SEC-*, PERF-*, DEPS-*, GIT-*, I18N-*), `antipatterns.md` (AP-*), `refactoring.md` (REF-*), `checklist.md` (CHK-*).

5. **`lessons.md` lessons with `severity: prefer`** — soft tilt.
   Tilts the ⭐ recommendation in their direction; does not block other options. May be overridden by higher layers (1-4) on conflict.

6. **`lessons.md` lessons with `severity: info`** — neutral information surfaced in Observation.

7. **Default behaviour** — when no rule matches.

**Practical implementation in skills:** the orchestrator receives all applicable rules (lessons + fe-standards subset) as one priority-ordered list. The sub-agent is instructed: *"apply in priority order; if conflict, higher priority wins; document the conflict in `appliedRules` with a `priority_resolution: <id-or-source>` note."*

**Anti-pattern:** a `must-follow` lesson that contradicts an SDS-* rule without citing the rule ID and without an incident-style justification → `/sl-ds-lesson` MUST emit WARN: *"Lesson appears to override SDS-X without explicit rationale — most must-follow lessons should cite the rule they're overriding."*

### 5.3 In structured questions (reframe)

If user picks "INTERPRETATION off" or "PROPOSAL adjust" and their override violates a `must-follow` lesson:

```
> ⚠️ Your choice violates lesson `<id>`:
>   <rule>
>   Why this lesson exists: <why>
>
> ⭐ I'll respect the lesson and pick a complying option
> Override the lesson for this decision — log the exception in sl-ds-decisions
> Expire the lesson — mark it stale via /sl-ds-lesson --expire <id>
```

NEVER silently violate a `must-follow` lesson. Surface the conflict.

## 6. Writing discipline (`/sl-ds-lesson` skill — the only writer)

See [`.agents/skills/sl-ds-lesson/SKILL.md`](.../sl-ds-lesson/SKILL.md) for the full workflow. Briefly:

1. User provides freeform rule + reason
2. Skill asks structured questions:
   - applies_to (which skills)
   - scope
   - severity
3. Skill generates `<lesson-id-kebab>` from the rule's first 3-5 words
4. Skill verifies the ID isn't a duplicate
5. Appends to `## Active Lessons` section
6. Updates frontmatter `total_lessons` count + `last_updated`

`/sl-ds-lesson --expire <id>` moves a lesson from Active → Expired with reason.

## 7. Worked example

User invokes:
```
/sl-ds-lesson "we always use Signal Store for shop/* features because the cart Service had a race condition in Q3"
```

After structured Qs:
- applies_to: `[sl-ds-plan]`
- scope: `feature:shop`
- severity: `must-follow`
- generated ID: `signal-store-for-shop`

Appended block:

```markdown
### signal-store-for-shop

- **applies_to:** [sl-ds-plan]
- **scope:** feature:shop
- **severity:** must-follow
- **rule:** Always use Signal Store for any feature under shop/*; never Service+RxJS.
- **why:** Incident 2025-Q3 — cart Service had race condition: RxJS combineLatest fired before initial state arrived, producing temporary empty cart UI. Signal Store withState guarantees synchronous initial value, eliminating this class of bug.
- **added:** 2026-06-09
- **valid_until:** indefinite
```

Next time `/sl-ds-plan` is invoked for a `shop/*` screen → reads this lesson, integrates into framing:

```
> ## Architecture for "shop/cart" — Framing
>
> **Observation:**
> - ... (codebase scan facts)
> - Lesson `signal-store-for-shop` applies: severity must-follow, scope feature:shop
>
> **Interpretation:**
> - → Lesson `signal-store-for-shop` REQUIRES Signal Store for this feature; data approach choice is constrained
> - ...
>
> **Proposed direction:**
> - → Data: ⭐ Signal Store (lesson-mandated). Service+RxJS marked 🚫 (would violate must-follow lesson).
> - ...
```

## 8. What NOT to do

- ❌ Don't write lessons that duplicate `.agents/standards/fe/` rules (NG-*, SDS-*, COMP-*, etc.) — those files are for framework/library universals
- ❌ Don't write vague lessons ("prefer good code") — must be actionable
- ❌ Don't have lessons without `why` — they rot
- ❌ Don't have >50 active lessons — at that scale, lessons aren't lessons, they're a process manual; promote recurring patterns into `.agents/standards/fe/` rules instead
- ❌ Don't edit `sl-ds-lessons.md` manually unless removing/expiring (use `/sl-ds-lesson` for additions to prevent format drift)
- ❌ Don't override `must-follow` lessons without recording the exception in `sl-ds-decisions/<screen>.md`
