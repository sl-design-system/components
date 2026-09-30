---
type: architecture
schema_version: 1
id: ARCH-<slug>         # e.g. ARCH-system-overview
title: <short title>
description: <one-line summary, used for search/recall>
jira: null              # usually cross-cutting; set a ticket if it has one
resource: null          # link to an authoritative source if one exists
status: draft           # draft | current | superseded
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, set once
updated: <YYYY-MM-DDThh:mm:ssZ>   # ISO 8601, bump on every edit
tags: [<tag>, <tag>]
# --- external sources (§ 16) ---
# references:            # external sources this document was built from (URLs only; title/date as comment)
#   - https://…          # <what it is>, read <YYYY-MM-DD>
---

# <Title>

## Purpose
What this document describes and who should read it.

## Overview
The design itself — diagrams (C4, sequence), component responsibilities, data flows.
Embed diagrams as fenced code blocks (mermaid/plantuml) or link to image assets.

## Key decisions
Link the decisions that shaped this design:
- [AD-<id>](AD-<id>-<slug>.md) — <what it decided>

## Open questions / risks
Anything unresolved.
