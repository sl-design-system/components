---
'@sl-design-system/angular': patch
---

Use the current Angular callbacks for blur and validation events, including when they are registered after the form control directive initializes. This keeps reactive form validity in sync when checkbox and radio groups finish initializing or their constraints change, without rerunning Angular validators when the component reports the same validation result.

If you extend `FormControlElementDirective` or one of the Angular form directives and override `validate()`, move your validation logic to the protected `getValidationErrors()` method so the base directive can track validation results.
