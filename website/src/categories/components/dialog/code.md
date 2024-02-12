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

<sl-button id="open-button-code" fill="outline" variant="primary">Open dialog</sl-button>
<sl-dialog id="dialog-example-code">
<span slot="title">Dialog title</span>
Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et
tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum.<br/><br/>
Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur
anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor
magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do.
<sl-button slot="actions" sl-dialog-close autofocus>Close</sl-button>
</sl-dialog>

</div>

<div class="ds-code">

  ```html
<!--The trigger-->
<sl-button id="open-button" fill="outline" variant="primary">Open dialog</sl-button>

<!--The dialog-->
<sl-dialog id="dialog-example">
    <span slot="title">Dialog title</span>
    Dolore nulla ad magna nostrud cillum...
    <sl-button slot="actions" sl-dialog-close autofocus>Close</sl-button>
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
