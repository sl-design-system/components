---
'@sl-design-system/dialog': minor
---

Improve ability to `extends Dialog`

This change improves the ability to extend the Dialog component by splitting the `render()` method into smaller methods. This makes it easier to override specific parts of the Dialog component:

- `renderHeader(title: string, subtitle: string)`
- `renderBody()`
- `renderFooter()`
- `renderActions()`

The `renderHeader` method is slightly different. If all you want to do is add a title or subtitle to the header, you can override the method and call `return super.renderHeader('My title', 'My subtitle')`.

To be clear: the above API is only meant to be used when you are *extending* the `Dialog` class. If you are using the `<sl-dialog>` element in your HTML, than you can still use the `header`, `body`, and `footer` slots as before.