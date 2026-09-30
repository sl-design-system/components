---
topic: curation-workflow
applies_to: [sl-ds-lesson]
last_updated: 2026-06-09
---

# Curation Workflow — Parsing + ID Generation + Duplicate Detection

> **Purpose:** Loaded by `/sl-ds-lesson` Step 2 (parse), Step 4 (ID generation), and duplicate-detection paths. Heuristics + edge case handling that would bloat SKILL.md.

## 1. Parsing the user's freeform rule (Step 2)

User's text is usually one of these shapes:

### Shape A: rule-because-why

> "We always use Signal Store for shop/* features because the cart Service had a race condition in Q3"

**Parser:**
1. Find "because" / "due to" / "since" → split into rule (left) + why (right)
2. Rule = left half, normalize to imperative ("we always use X" → "Always use X")
3. Why = right half, keep as-is

### Shape B: rule-period-why

> "Never use sl-card for grid containers. Shadow DOM padding can't be overridden — caused +32px drift in cart."

**Parser:**
1. Find sentence boundaries
2. First sentence = rule
3. Subsequent sentences = why

### Shape C: rule-only (rare)

> "Always use Signal Store for shop/* features."

**Parser:**
1. No "because" / no second sentence → rule is the whole thing
2. **ASK user for why** — `why` is required per format spec. Without it, lesson rots fast.

### Shape D: ambiguous / multi-clause

> "When Figma renames Promo to Cta we should treat it as semantic and rename code identifiers, also the same for Banner to Hero"

**Parser:**
1. Detect "also" / "and" connecting two distinct rules → SPLIT into 2 lessons; ask user which to record first (or both)
2. After Q1, recurse for the second

### Imperative normalization

Convert to imperative voice:
- "we always use X" → "Always use X"
- "we never X" → "Never X"
- "I think we should X" → "X" (drop hedges)
- "let's X" → "X"
- "make sure to X" → "X"

## 2. Scope inference (Step 2)

Look for these patterns in the rule + why text:

| Pattern in text | Inferred scope |
|---|---|
| `shop/*`, `shop/`, `under shop`, `in shop feature` | `feature:shop` |
| `teacher-portal`, `teacher-dashboard`, `<feature>-portal` | `feature:<feature>` |
| Specific screen name matching `sl-ds-decisions/<screen>.md` | `screen:<screen>` |
| `this Figma file`, `figma file X`, mentions of file URL | `figma-file:<extracted-id>` |
| No specific feature/screen/file mention | `project-wide` (default) |

If multiple patterns match → pick the MOST SPECIFIC (`figma-file:<id>` > `screen:<id>` > `feature:<name>` > `project-wide`).

If no clear scope → ASK Q2 in SKILL.md Step 3.

## 3. Skill inference (Step 2 — pre-Q1)

Look for keywords to PRE-FILL Q1:

| Keywords | Likely skill |
|---|---|
| "store", "service", "data", "state mgmt", "RxJS", "Signal Store", "component structure", "decomposition" | `sl-ds-plan` |
| "shell", "topbar", "sidebar", "nav", "footer", "layout", "shared screens" | `sl-ds-layout` |
| "diff", "Figma changed", "categorize", "rename", "structural change" | `sl-ds-update` |
| "code style", "import", "selector", "i18n", "translation key", "Polish strings", "generated code" | `sl-ds-implement` |
| Multiple categories | Ask Q1 explicitly without pre-fill |

This is HEURISTIC — the user's Q1 answer wins. Pre-filling just makes the question faster.

## 4. ID generation (Step 4)

```
function generateId(rule, existingIds):
  # Extract first 3-5 meaningful words
  words = rule.lower().split()
  stopwords = {'always', 'never', 'a', 'an', 'the', 'is', 'are', 'to', 'for', 'of', 'in', 'on', 'when', 'we', 'should', 'must'}
  meaningful = [w for w in words if w not in stopwords]
  candidate = '-'.join(meaningful[:4])
  candidate = candidate.replace('/', '').replace('*', '').replace(',', '')
  # Truncate to 40 chars max
  candidate = candidate[:40]
  # Collision check
  if candidate in existingIds:
    suffix = 2
    while f"{candidate}-{suffix}" in existingIds:
      suffix += 1
    return f"{candidate}-{suffix}"
  return candidate
```

**Examples:**
- "Always use Signal Store for shop/* features" → `use-signal-store-shop`
- "Never use sl-card for grid containers" → `use-sl-card-grid`
- "Treat Promo→Cta renames as semantic" → `treat-promo-cta-renames`

If the auto-generated ID is unclear → ASK user to provide one. Otherwise prefer the auto-generated.

## 5. Duplicate detection

Before generating an ID, check if the new rule is semantically similar to an existing lesson:

### 5.1 Same rule, different wording

Approximation: compare lowercased rules with stopwords stripped. If ≥70% word overlap with an existing rule → flag as potential duplicate:

```
> ⚠️ Possible duplicate of existing lesson `<existing-id>`:
>   existing rule: <rule>
>   new rule:      <new rule>
>
> ⭐ Update the existing lesson (use /sl-ds-lesson --edit <existing-id>)
> Add as new lesson (the rules are different enough)
> Cancel
```

### 5.2 Conflicting rule

If the new rule contradicts an existing one (e.g. existing says "Always X", new says "Never X" with same scope) → STOP and surface:

```
> 🛑 New lesson contradicts existing lesson `<existing-id>`:
>   existing: <existing rule>
>   new:      <new rule>
>
> ⭐ Expire the existing lesson — provide reason, then add new
> Cancel — review existing first
```

Contradictions are detected via simple negation patterns: "always X" vs "never X" with same noun phrase.

## 6. Edge cases

### 6.1 User pastes a long incident report

> "So yesterday we had this bug where the cart component showed empty for 200ms because RxJS combineLatest fired before initial state arrived, and after debugging for an hour we figured out that Signal Store with withState guarantees synchronous initial value..."

**Handling:** parser extracts the rule (Signal Store usage) and why (the race condition). If the text is >500 words → ASK user to summarize the rule first. Don't accept walls of text — distilling is the user's job.

### 6.2 User adds rule that says "do what the fe-standards say"

> "Use signals, not @Input"

**Handling:** match against `.agents/standards/fe/angular.md` (NG-*), `sanoma-ds.md` (SDS-*), and other fe-standards files. If the rule is already there → STOP with "This is a fe-standards universal — already in `<file>` rule `<ID>`. No new lesson needed."

### 6.3 User adds rule conditional on something complex

> "If the Figma file has more than 10 pages AND the project uses Nx, then prefer per-feature structure"

**Handling:** complex conditionals don't fit lessons cleanly. Split:
- Lesson 1: "For Nx workspaces with multi-screen Figma files, prefer per-feature structure" (broad rule)
- OR record it as architectural decision in `sl-ds-decisions/<screen>.md` (not lessons)

Ask user which they prefer.

## 7. What NOT to do

- ❌ Don't add `info` severity to placate users — `info` lessons clutter the file without affecting decisions; only use when truly informational
- ❌ Don't generate IDs longer than 40 chars — they get unwieldy in references
- ❌ Don't pre-fill `severity: must-follow` from text heuristics — severity is a deliberate decision (always ask Q3)
- ❌ Don't write lessons silently — always confirm with user before appending (Step 8 confirm is post-write; pre-write confirmation could be Step 4.5 if needed)
- ❌ Don't try to "fix" the rule's wording beyond imperative normalization — preserve the user's voice
