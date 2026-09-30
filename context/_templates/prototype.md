---
type: prototype
schema_version: 1
id: PT-<JIRA>-NN        # e.g. PT-ABC-88-01
title: <short title>
description: <one-line summary, used for search/recall>
jira: <JIRA>            # e.g. ABC-88, or null
resource: https://<your-instance>.atlassian.net/browse/<JIRA>   # authoritative source (Jira URL); null if NOJIRA
status: current         # current | superseded | archived
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
variant_of: null        # null for a base prototype; PT-<JIRA>-NN for a variant
change: null            # null for a base; for a variant, the ONE declared difference
artifact: null          # URL where the built prototype lives; null while it is only local
---

# <Title>

> Generated — **do not hand-edit.** Re-run the describe step instead: a stale description is a
> re-run, not a rewrite.

**What this document is for.** It is the **record** of a prototype that exists: what it showed, and
— for a variant — what changed and from what. It is *not* the thing a variant is rebuilt from; a
variant copies the prototype's own files. So the value here is a trustworthy, readable, diffable
account, not a reconstruction source.

**What counts as the prototype.** One screen file is one screen. The designer's **source material**
(uploaded PDFs, pasted screenshots) and their **working artifacts** (scratch images, check
screenshots) are *not* part of it and do not belong in this record — describing the inputs as if
they were the artifact is the mistake to avoid.

## What it is

One paragraph: what this prototype demonstrates, and for whom. Enough for someone who has never seen
it to know why it exists. Not a feature list.

## Screens

In walkthrough order — the order someone is walked through it, not the order they were built.

A screen file that is **not** part of the walkthrough (a fragment, a spare, an abandoned draft)
still gets a row — with its purpose saying so. Silently omitting it makes the record look complete
when a reader opening the project will find more than this lists.

| # | Screen | Purpose |
|---|--------|---------|
| 1 |        |         |
| 2 |        |         |

## Components used

Per screen, by name, as defined in the design system.

**If a screen uses no design-system components at all, write `none — <what it uses instead>`**
(e.g. `none — inline-styled markup`). That is a real and common answer for a fast prototype, and it
is worth knowing: it is the gap between what was built and what the product would use.

| Screen | Components |
|--------|------------|
| 1      |            |

## Content shown

> **Rule: verbatim, never summarised.**
>
> Every string a viewer can read goes here exactly as it appears — headings, labels, button text,
> placeholders, names, numbers, dates, empty-state copy.
>
> - **Right:** `Nouns and verbs — Lesson 3` · `Continue` · `Amira K.` · `18 of 24 completed`
> - **Wrong:** *"a lesson title, a continue button, a student name and a progress count"*
>
> The wrong version reads perfectly well and quietly destroys the record's value: nobody can later
> tell what a research participant actually saw, and two variants cannot be meaningfully diffed.
> When in doubt, transcribe.
>
> **Three places content hides.** Text nodes are the obvious one. It also lives in **visible
> attributes** (`placeholder`, `alt`, `title`) and, in a templated prototype, in the **data behind
> `{{ }}` bindings** — the exercise words, table rows, names. A record built from text nodes alone
> looks complete and is a sieve.
>
> **Media is referenced, not transcribed**: filename or URL, plus one line of what it depicts. A
> text glyph standing in for an image — a single letter as a logo — is **media**, not content; note
> it as `logo glyph "M"` rather than transcribing a stray letter.
>
> **Masks are not content.** A password field showing `••••••••` carries no information; record the
> field, not the dots.

### <Screen name>

```
<literal text, exactly as shown>
```

## Interactions

What is clickable, and where it leads. One row per interaction; a target of "nothing" belongs in the
next section instead.

Where a control only changes state on the same screen (a toggle, a timer, a reveal), say so rather
than inventing a destination — *"stays on this screen"* is a real answer.

| Screen | Element | Leads to |
|--------|---------|----------|
| 1      |         |          |

## Deliberately not implemented

The dead ends, stated on purpose. A link that goes nowhere, a control that does not respond, a
screen reachable only by direct URL.

**Fill this in — an empty section here is almost always wrong.** Every prototype has edges. Empty
reads as *"nothing to report"* when it usually means *"not looked for"*, and a reader then assumes
completeness the prototype never had.

- <what is not implemented, and where a viewer would meet it>

## Notes

Anything the sections above cannot carry: known rough edges, why an obvious thing is absent, what a
viewer tends to ask about. Optional.
