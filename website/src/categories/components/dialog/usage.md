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

<section>

## When to use

The following guidance describes when to use the Dialog component.

### Critical information
  
Use dialogs to present critical information or ask for decisions. For instance, when confirming a high-risk action (e.g., deleting data), a dialog ensures user attention.

### Short tasks
  
For quick tasks that don’t warrant a full page transition, use dialogs. They allow users to stay within the context of their current workflow.

</section>

<section>

## When not to use

The following guidance describes when not to use the Dialog component.

### Complex data
  
Don’t overload dialogs with extensive data or complex interactions. Keep them concise.

### Premature triggers
  
Only show dialogs when the user explicitly triggers them. Avoid interrupting the user unnecessarily.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional|
|-|-|-|-|
| 1 | Overlay | Obscures the page content behind the panel |No|
| 2 | Panel	| Contains the header, subheader, panel content and actions |No|
| 3 | Header | An area to display content at the top of the panel (e.g. title)| Yes |
| 4 | Subheader	| An area to display the description of the title| Yes |
| 5 | Close button| Icon button for closing the dialog | Yes |
| 6 | Content | An area to display any content | Yes |

{.ds-table}

</div>

</section>

<section>

## Options
With these options, you can tweak the appearance of the dialog in Figma. They are available in the Design Panel so you can compose the checkbox to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">
  
|Item|Options|Description|
|-|-|-|
|Device|`'Desktop', 'Mobile'`| Select the device for your prototype to ensure an optimal layout.|
|Size|`'sm','md' (Default), 'lg', 'xl'`|The dialog come in four sizes: small, medium (default), large and extra large, providing flexibility to align with your design requirements.|
|Close Icon|`'Yes', 'No'`| Choose if you want to show a close button.|
|Header Order|`'Title', 'Subtitle'`| Choose if you want to start with the title or subtitle.|
|Content|`'Yes', 'No'`| Choose if you want to show content (slot component).|
|Slot Component|`'.slot'`|Select your own component to display within the dialog component.|
|Actions|`'Yes', 'No'`| Choose if you want to show actions.|
|Align|`'Left', 'Right'`| Choose if you want to show the actions on the left or right side.|

{.ds-table .ds-table-align-top}

</div>
  
</section>

<section>
  
## Behavior

### Height
The height of the dialog is dynamically calculated as a percentage of the available screen. As content is injected into the dialog, it grows vertically to accommodate the information passed to it.

### Entrance and exit motion
When the user launches the dialog, the overlay fades in from 0% to 100% opacity (transitions) and the dialog slides upward from the centre of the screen (transforms:translate the x or y axis). When the user dismisses the dialog, the same animation occurs in reverse.

### Content overflow
When content exceeds the available space, it overflows and becomes scrollable. 
  
</section>

<script>

const openBtn = document.querySelector("#open-button");
const dialogExample = document.querySelector("#dialog-example");


openBtn.addEventListener("click", () => {
    if (dialogExample) {
      dialogExample.showModal();
    }
  })

</script>
