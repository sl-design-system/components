This page shows how SLDS validation integrates with Angular forms.

In practice, validation is shared between Angular and SLDS:

- **Angular forms** track form state (`touched`, `dirty` etc.) and run Angular validators you configure.
- **SLDS form controls** maintain component level validity (for example `required` / value-missing), expose `valid`/`validity`, render the UI feedback, and emit events such as `sl-blur` and `sl-validate`.

So SLDS does not replace Angular validation, it integrates component validity with Angular form state and provides consistent validation UX.

`touched` and `dirty` are Angular form state flags, they are not the direct trigger for SLDS validation UI.

Angular marks `touched` through the `ControlValueAccessor` bridge on both `sl-blur` and `sl-change`. SLDS `validate-on-blur` is triggered on `sl-blur` (when the control loses focus).

By default, SLDS form validation is **not** on blur. Validation feedback is shown after validation is requested (for example via `reportValidity()` / submit). After that, feedback updates as values change.

Use `validate-on-blur` on `<sl-form>` to opt into validation on blur:

```html
<sl-form validate-on-blur>
  <!-- form controls -->
</sl-form>
```

With this opt-in enabled, the form validates a control when that control emits `sl-blur` (focus leaves the field), which is often less intrusive than immediate feedback.

For **required fields** specifically, `validate-on-blur` has smart behavior for keyboard and screen reader accessibility:

Keyboard and screen reader users typically tab through all form fields to understand what needs to be filled. If we show required errors on every blur—even for untouched fields—users would hear error messages for empty fields they haven't interacted with yet. This interrupts their workflow and makes it harder to understand the form.

So instead:

- Just **tabbing through** a field shows **no error** (field info is heard without noise)
- If you **type, clear, and then blur**, the error **shows** (user intended to interact with the field)
- **Mouse actions** like unchecking or clearing a value show the error when the control **loses focus**

This way, keyboard/screen reader users can freely tab through a form to learn its structure, and only receive error feedback when they've actually modified a field. Untouched required fields still validate on form submit.

By default, validation messages are announced by the live-region announcer. If your form also renders an aggregated error message (via `<sl-inline-message>`), set `announce-errors="false"` on `<sl-form>` to avoid duplicate screen reader announcements.

This works for both:

- **Reactive forms** (`formControlName` / `FormGroup`)
- **Template-driven forms** (`[(ngModel)]`)

The difference between those two is still Angular's:

- **Reactive forms** define validators in TypeScript (`FormControl`, `FormGroup`).
- **Template-driven forms** define validators in the template (`required`, etc.) with `ngModel`.

In both approaches, SLDS components show the resulting validation state in the same way.
