# Foundation mount

This directory is the **conventional, machine-readable location** for organization-level
foundation bundles this context builds against (CONVENTIONS § 20): infrastructure and
architecture patterns, security/privacy baselines, design-system guidance.

**Ownership.** Each foundation domain is owned and maintained by the responsible
department — architecture, security, design / design-system, platform. This context
**consumes** the bundles as authoritative input; it never authors, edits, or forks them
here. Friction or gaps flow back to the owning department, not into local patches.

**Pinning.** The versions of the bundles this context builds against are recorded in the
`.sl-aipdlc.yaml` marker at the context root, so a later foundation change does not
silently invalidate in-flight work. Update the pin deliberately, like any dependency bump.

**Why one location:** skills and agents load foundation context automatically from this
directory instead of guessing — design-system awareness, security defaults, and infra
patterns all source from here.
