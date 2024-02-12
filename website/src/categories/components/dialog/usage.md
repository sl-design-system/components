---
title: Dialog usage
tags: usage
eleventyNavigation:
  parent: Dialog
  key: DialogUsage
---

<section>
<div class="ds-example">

<sl-button id="open-button" fill="outline" variant="primary">Open dialog</sl-button>
<sl-dialog id="dialog-example">
<span slot="title">Dialog title</span>
Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et
tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum.
Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur
anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor
magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do.
<sl-button slot="action" sl-dialog-close autofocus>Close</sl-button>
</sl-dialog>

</div>

<div class="ds-code">

  ```html
<sl-button id="open-button" fill="outline" variant="primary">Open dialog</sl-button>

<sl-dialog id="dialog-example">
    <span slot="title">Dialog title</span>
    Dolore nulla ad magna nostrud cillum veniam sint et consectetur anim Lorem. Sint fugiat id deserunt magna et
    tempor veniam eu fugiat fugiat. Fugiat mollit sint labore adipisicing do mollit eu dolore nulla enim cillum.
    Pariatur amet occaecat dolor consectetur aliqua mollit est aliquip irure cupidatat. Reprehenderit consectetur
    anim sunt voluptate dolor aute non enim aliqua sit. Occaecat irure ullamco aliquip minim labore occaecat dolor
    magna duis. Voluptate tempor amet cupidatat officia labore ipsum ad do.
    <sl-button slot="action" sl-dialog-close autofocus>Close</sl-button>
</sl-dialog>

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

<section>

## When to use

The following guidance describes when to use the Dialog component.

<div class=ds-do-dont>

<div class="ds-success">

<div class="ds-success__content">

### Critical information
  
Use dialogs to present critical information or ask for decisions. For instance, when confirming a high-risk action (e.g., deleting data), a dialog ensures user attention.

</div>

</div>

</div>

<div class=ds-do-dont>

<div class="ds-success">

<div class="ds-success__content">

### Short tasks
  
For quick tasks that don’t warrant a full page transition, use dialogs. They allow users to stay within the context of their current workflow.

</div>

</div>

</div>

</div>
</section>

<section>

<section>

## When not to use

The following guidance describes when not to use the Dialog component.

<div class=ds-do-dont>

<div class="ds-danger">

<div class="ds-danger__content">

### Complex data
  
Don’t overload dialogs with extensive data or complex interactions. Keep them concise.

</div>

</div>

</div>

<div class=ds-do-dont>

<div class="ds-danger">

<div class="ds-danger__content">

### Premature triggers
  
Only show dialogs when the user explicitly triggers them. Avoid interrupting the user unnecessarily.

</div>

</div>

</div>

</div>
</section>

<section>

## Anatomy

Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

<script>

const openBtn = document.querySelector("#open-button");
const dialogExample = document.querySelector("#dialog-example");


openBtn.addEventListener("click", () => {
    if (dialogExample) {
      dialogExample.showModal();
    }
  })

</script>
