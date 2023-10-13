---
title: Checkbox usage
tags: usage
eleventyNavigation:
  parent: Checkbox
  key: CheckboxUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>

<sl-checkbox id="checkbox" name="checkbox" value="yes" size="lg">Checkbox</sl-checkbox>

</div>

<div class="ds-code">

  ```html
  <sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>

  <sl-checkbox id="checkbox" name="checkbox" value="yes" size="lg">Checkbox</sl-checkbox>
  ```

</div>

</section>

<section>

## When to use

### Binary Decisions
Checkboxes simplify making yes-or-no decisions. Users can independently toggle options, whether it's about their preferences, agreeing to terms, or picking from a list.

### Multiple Selections
When users need to pick multiple items from a list, checkboxes are a go-to. They offer flexibility, helping users select multiple choices or refine their search results.

### Filtering and Sorting
Checkboxes are handy for users dealing with lots of options. They can fine-tune what they see by selecting specific attributes.

</section>

<section>

## When not to use

### Exclusive choices
While checkboxes work well in forms and filters, they're not suitable for exclusive selections. Instead, use radio buttons for single choices.

### Toggle preferences
For actions that affect preferences or application behavior, opt for a switch for a better user experience.

</section>

<section>

## Anatomy

```html
  (Visual)
```

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Checkbox input (unchecked)	|An unchecked checkbox input is like a blank canvas. It represents an option or choice that is currently unselected, waiting for the user to make a decision and activate it.	|no|
|2|Icon	|The icon in a checkbox is a visual confirmation of user selection.	|no|
|3|Label	|A checkbox label is a brief, descriptive text next to the checkbox element.|yes|

{.ds-table}

</section>

<section>

## Options

With these options, you can tweak the appearance of the radio in Figma. They are available in the Design Panel so you can compose the checkbox (group) to exactly fit the user experience need for the use case you are working on.

```html
  table
```

|Item|Options|Description|
|-|-|-|
|Size|`???`.|The checkbox and the label element come in two sizes: medium (default) and large, providing flexibility to align with your design requirements.|
|Variant|`???`|Default, valid or invalid|
|State|`???`|Idle, hover, active and disabled|
|Status |`???`|Checked or unchecked|
|Label|`???`|Position the label to the right (at the end) of the checkbox to provide contextual information.|
|Focus ring|`???`|Turn the focus ring option to show the focus state of the checkbox|
|Checkbox group|`???`|Use the checkbox group component to group multiple checkboxes with the same category, together with the group label and help text for clear organization and user guidance.|

{.ds-table .ds-table-align-top}

</section>

<section>

## Behaviors

Let's explore the behavior of the checkbox:

### Label overflow wrap
When a label is too long for the available horizontal space, it wraps to form another line, with the text aligned to the top.

```html
  (Visual)
```

### Clickable area
The checkbox has a clickable area around both the checkbox and label for more space to press. We've left a bit of space on the left side to ensure smooth alignment and avoid any unexpected layout issues.

```html
  (Visual)
```

### Focusable area
Both the checkbox input and label are interactive elements, allowing users to interact with them. However, when it comes to focusing, whether through keyboard navigation or voice commands, the visible focus state is only visible on the checkbox itself.

```html
  (Visual)
```

### Validation
If an issue arises after submitting a form, the help text will switch to an 'invalid' state. This serves as a valuable guide for users, clearly explaining the necessary actions to resolve any problems.

```html
  (Visual)
```

### Default checked
Set the initial state of the checkbox according to your preferences. You can choose whether it starts as checked or unchecked by default, providing you with control over its initial behavior in your interface.

```html
  (Visual)
```

### Indeterminate State
Useful in scenarios where checkboxes are nested, we've incorporated an indeterminate state. Users can't set the indeterminate state by clicking on it, but it can be programmatically set to this state.

```html
  (Visual)
```


</section>