---
title: Dialog code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Dialog
  key: DialogCode
---
<section>
<div class="ds-example">

<sl-button id="open-button-code" fill="solid" variant="primary">Open dialog</sl-button>
<sl-dialog id="dialog-example-code">
<span slot="title">Dialog title</span>
Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et
tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum.<br/><br/>
Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur
anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor
magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do.
<sl-button slot="primary-actions" sl-dialog-close autofocus>Close</sl-button>
</sl-dialog>

</div>

<div class="ds-code">

  ```html
<!--The trigger-->
<sl-button id="open-button" fill="solid" variant="primary">Open dialog</sl-button>

<!--The dialog-->
<sl-dialog id="dialog-example">
    <span slot="title">Dialog title</span>
    Dolore nulla ad magna nostrud cillum...
    <sl-button slot="primary-actions" sl-dialog-close autofocus>Close</sl-button>
</sl-dialog>

<!--Event binding-->
<script>
    const openBtn = document.querySelector("#open-button");
    const dialogExample = document.querySelector("#dialog-example");

    openBtn.addEventListener("click", () => {
      if (dialogExample) {
        dialogExample.showModal();
      }
    })
</script>
  ```

</div>
</section>
<ds-install-info link-in-navigation package="dialog"></ds-install-info>

<section>

## Responsive behavior

The button-bar component in the footer will automatically stack the buttons vertically when the viewport is smaller than 600px. This behavior is enabled by default.

</section>

<section>

## Commands

The `<sl-dialog>` component supports the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API). This allows you to open and close dialogs declaratively using `<sl-button>`, without needing any JavaScript.

Set the `command` property on an `<sl-button>` to specify the action, and the `commandfor` property to reference the `id` of the dialog:

| Command | Description |
| --- | --- |
| `--show-modal` | Opens the dialog as a modal |
| `--close` | Closes the dialog |
| `--request-close` | Requests the dialog to close, firing a `cancel` event that can be prevented |

{.ds-table .ds-table-align-top}

<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-button command="--show-modal" commandfor="invoker-dialog" variant="primary">Open dialog</sl-button>
    <sl-dialog id="invoker-dialog">
      <span slot="title">Dialog title</span>
      <p>This dialog was opened using the Invoker Commands API. No JavaScript needed!</p>
      <sl-button command="--close" commandfor="invoker-dialog" slot="primary-actions" autofocus>Close</sl-button>
    </sl-dialog>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-button command="--show-modal" commandfor="my-dialog" variant="primary">Open dialog</sl-button>
  <sl-dialog id="my-dialog">
    <span slot="title">Dialog title</span>
    <p>This dialog was opened using the Invoker Commands API. No JavaScript needed!</p>
    <sl-button command="--close" commandfor="my-dialog" slot="primary-actions" autofocus>Close</sl-button>
  </sl-dialog>
  ```

</div>
</section>

<section>

## Migrating to SLDS Dialog

When using the dialog in an existing application, and more importantly, using existing code in the contents of the dialog there are a few caveats. Please read our [overlay guidelines](/categories/guidelines/overlays/) on possible issues that can occur and how to prevent or solve them.
</section>

{% include "../component-table.njk" %}


<script>
  const openBtnCode = document.querySelector("#open-button-code");
  const dialogExampleCode = document.querySelector("#dialog-example-code");

  openBtnCode.addEventListener("click", () => {
    if (dialogExampleCode) {
      dialogExampleCode.showModal();
    }
  })

</script>
