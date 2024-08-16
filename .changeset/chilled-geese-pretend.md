---
'@sl-design-system/angular': major
---

BREAKING: Split entrypoints

This change splits the wrappers for each web component package into their own secondary entrypoints.

Before: `import { ButtonComponent } from '@sl-design-system/angular';`

After: `import { ButtonComponent } from '@sl-design-system/angular/button';`

This change is necessary to allow you to pick-and-choose which components you want to use in your application. This is a workaround because Angular creates Flattened ESM (FESM) bundles which include all components in a single file. This requires users to include *all* web components in their application, even if they only use one.
