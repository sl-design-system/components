---
type: spec
schema_version: 1
id: SPEC-<slug>         # e.g. SPEC-<product-slug>
title: <short title>
description: <one-line summary, used for search/recall>
jira: null              # usually product-level / cross-cutting
resource: null          # link to an authoritative source if one exists
status: draft           # draft | current | superseded
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [product, <tag>]
# --- external sources (§ 16) ---
# references:            # external sources this document was built from (URLs only; title/date as comment)
#   - https://…          # <what it is>, read <YYYY-MM-DD>
---

# <Title>

## Vision
Where this is going and why it matters. One paragraph.

## Problem
The user/business problem being solved.

## Personas
| persona | needs | pains |
|---------|-------|-------|
|         |       |       |

## Scope
What this product/initiative covers.

## Functional requirements
| id    | requirement                  | priority |
|-------|------------------------------|----------|
| FR-1  |                              | must     |

## Non-functional requirements
| id     | requirement (perf, security, a11y, …) | target |
|--------|----------------------------------------|--------|
| NFR-1  |                                        |        |

## Assumptions
- …

## Out of scope
- …
