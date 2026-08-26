This page shows how SLDS validation integrates with Angular forms.

In practice, validation is shared between Angular and SLDS:

- **Angular forms** track form state (`touched`, `dirty` etc.) and run Angular validators you configure.
- **SLDS form controls** maintain component level validity (for example `required` / value-missing), expose `valid`/`validity`, render the UI feedback, and emit events such as `sl-blur` and `sl-validate`.

So SLDS does not replace Angular validation, it integrates component validity with Angular form state and provides consistent validation UX.

`touched` and `dirty` are Angular form state flags, they are not the direct trigger for SLDS validation UI.

Angular marks `touched` through the `ControlValueAccessor` bridge on both `sl-blur` and `sl-change`. This means for controls like checkbox, `touched` can become `true` on the first change, before blur. SLDS `validate-on-blur` runs only on `sl-blur`, so they are conceptually separate even though they often appear to align.

By default, SLDS form validation is **not** on blur. Validation feedback is shown after validation is requested (for example via `reportValidity()` / submit). After that, feedback updates as values change.

Use `validate-on-blur` on `<sl-form>` to opt into blur-driven validation behavior:

```html
<sl-form validate-on-blur>
  <!-- form controls -->
</sl-form>
```

With this opt-in enabled, the form validates a control when that control emits `sl-blur` (focus leaves the field), which is often less intrusive than immediate feedback.

This works for both:

- **Reactive forms** (`formControlName` / `FormGroup`)
- **Template-driven forms** (`[(ngModel)]`)

The difference between those two is still Angular's:

- **Reactive forms** define validators in TypeScript (`FormControl`, `FormGroup`).
- **Template-driven forms** define validators in the template (`required`, etc.) with `ngModel`.

In both approaches, SLDS components show the resulting validation state in the same way.
