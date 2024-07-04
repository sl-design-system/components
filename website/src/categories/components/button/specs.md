---
title: Button specs
tags: specs
eleventyNavigation:
  parent: Button
  key: ButtonSpecs
---

<section>

## Specs

Lorem ipsum dolor sit amet
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Anatomy
![Diagrams describing the various elements of a button: Text label, Container and Icon](/assets/images/components/button/sl-buttons-anatomy.png)

<ol>
A. Text label
A. Container
A. Icon
</ol>

</section>

<section>

## Variants

|Name |Purpose| 
|---|---|
|Default|The default style is the most common button variant. Only switch to another variant if you need to adjust the element's visual weight.|
|Primary|For the main call-to-action on the page. Primary buttons should only appear once per screen (not including the application header, modal dialog, or side panel).|
|Success|Only use when you want to emphasize actions that could have a sense of success or confirmation effects on the user's data. |
|Warning|   |
|Danger|For actions that could have destructive effects on the user's data (for example, delete or remove).|

{.ds-table .ds-table-align-top}

</section>

<section>

## Types

|Name |Purpose| 
|-----|-------|
|Solid|   |
|Outline|   |
|Ghost|   |
|Link|   |

{.ds-table .ds-table-align-top}
  
</section>

<section>

## Sizes

|Name |Value|Purpose| 
|---|---|---|
|Small|`sm`|Use when there is not enough vertical space for the default or field-sized button.|
|Medium|`md`|This is the most common button size.|
|Large|`lg`|The larger type size within this button provides balance when used with a 16px body copy. It's the most expressive type of button, that's increases the findability for the user.|

{.ds-table .ds-table-align-top}
  
</section>

<section>

## Behaviour

### Mouse
Users can trigger a button by clicking anywhere within the button container.

### Keyboard Focus
Users can trigger a button by pressing Enter or Space while the button has focus. Also, see the accessibility tab.

### Tooltip when the label is hidden
When the button label is hidden, a tooltip on hover displays the label text and, if appropriate, a keyboard shortcut.

### Flexible width
The width of a button automatically adjusts to fit the label text. The padding on each side of the button equals half its height.

### Minimum width
When label buttons have a minimum width of 2.25x the button's height. This ensures that small buttons retain an identifiable shape.

</section>
