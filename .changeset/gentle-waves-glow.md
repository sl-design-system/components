---
'@sl-design-system/button': minor
---

Add support for the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) (`command` and `commandfor` properties)

The Invoker Commands API allows buttons to declaratively control interactive elements like `<sl-dialog>` without writing any JavaScript. For example, setting `command="--show-modal"` and `commandfor="my-dialog"` on a button will automatically open the referenced `<sl-dialog>` when clicked.
