---
'@sl-design-system/date-field': minor
---

Add a `hide-picker` attribute to `<sl-date-field>` so custom action controls can close the calendar popup after handling their own click.

This makes it easy to build actions like Today or Clear that update the field and then dismiss the picker automatically.
