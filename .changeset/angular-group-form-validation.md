---
'@sl-design-system/angular': patch
---

Use the current Angular callbacks for blur and validation events, including when they are registered after the form control directive initializes. This keeps reactive form validity in sync when checkbox and radio groups finish initializing or their constraints change.
