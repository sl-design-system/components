---
type: analysis        # the type of the full document (analysis | plan | task | …)
schema_version: 1
id: A-<JIRA>           # same id/type the full document uses in its repo
title: <short title>
description: <one-line summary, used for search/recall>
jira: <JIRA>           # the cross-repo join key
resource: https://bitbucket.org/<workspace>/<repo>/src/main/<path-to-full-doc>.md   # REQUIRED for a stub
status: <status>       # mirror the full document's status (kept best-effort in sync)
owner: <name>
created: <YYYY-MM-DDThh:mm:ssZ>
updated: <YYYY-MM-DDThh:mm:ssZ>
tags: [<tag>]
location: external     # marks this as a hub stub — full content lives in another repo
---

# <Title>

> **External document.** The full content lives in the `<repo>` repo —
> see `resource` above. This hub stub exists so the central repo knows about it.

## Summary

One short paragraph: what it is, why it matters, and its current state — enough to be useful
without opening the spoke repo. Do not copy the full content here; link to it.
