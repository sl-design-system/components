# architecture/decisions/

The single ADR home. Ticket-tied ADRs in `<JIRA>/AD-<id>-<slug>.md`; repo-wide ADRs
(`jira: null`) flat here. An ADR may only be created once its driving analysis has
`status: done` — enforced by `scripts/check-adr-gate.sh` (CONVENTIONS § 18).
