---
title: Toggle button usage
tags: usage
eleventyNavigation:
  parent: Toggle button
  key: ToggleButtonUsage
---

<section>

<div class="ds-example" style="flex-direction: column; gap: 2rem;">
<sl-toggle-group multiple>
<sl-toggle-button aria-label="Bold" pressed>
<sl-icon name="far-bold" slot="default"></sl-icon>
<sl-icon name="fas-bold" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Italic">
<sl-icon name="far-italic" slot="default"></sl-icon>
<sl-icon name="fas-italic" slot="pressed"></sl-icon>
</sl-toggle-button>
<sl-toggle-button aria-label="Underline" pressed>
<sl-icon name="far-underline" slot="default"></sl-icon>
<sl-icon name="fas-underline" slot="pressed"></sl-icon>
</sl-toggle-button>
</sl-toggle-group>
<sl-toggle-group>
  <sl-toggle-button>All types</sl-toggle-button>
  <sl-toggle-button>Primary education</sl-toggle-button>
  <sl-toggle-button pressed>Secondary education</sl-toggle-button>
</sl-toggle-group>
</div>

<div class="ds-code">

  ```html
    <sl-toggle-group multiple>
      <sl-toggle-button aria-label="Bold" pressed>
        <sl-icon name="far-bold" slot="default"></sl-icon>
        <sl-icon name="fas-bold" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Italic">
        <sl-icon name="far-italic" slot="default"></sl-icon>
        <sl-icon name="fas-italic" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Underline" pressed>
        <sl-icon name="far-underline" slot="default"></sl-icon>
        <sl-icon name="fas-underline" slot="pressed"></sl-icon>
      </sl-toggle-button>
    </sl-toggle-group>
    <sl-toggle-group>
      <sl-toggle-button>All types</sl-toggle-button>
      <sl-toggle-button>Primary education</sl-toggle-button>
      <sl-toggle-button pressed>Secondary education</sl-toggle-button>
    </sl-toggle-group>
  ```

</div>

</section>

<section>

## When to use
Toggle group are best used in situations where users need to make a single selection from multiple options within a defined group. Here are two common scenarios:

### Related Exclusive Choices
Use a toggle group when offering a set of options where only one can be active at a time. This is ideal for scenarios like mode selection, where choosing one option automatically deselects others (e.g., light vs. dark mode). The toggle group ensures clear feedback, allowing users to easily understand which option is currently active.

### Multiple of Related Actions
A toggle group is useful when presenting a series of actions that are related but independent, where users can activate one, some, or all options at once. This pattern works well for scenarios like turning on different filters or settings, where multiple combinations of active toggles are allowed. The visual grouping helps users understand the relationship between these actions.

### Requirer Immediate Feedback
When the selected state of each button should immediately reflect changes in the interface, such as activating a real-time filter or adjusting a visual layout. For example, a toggle group might be used for applying different text formatting styles (e.g., bold, italic, underline), where users can combine styles or toggle them off individually without confusion.

Grouping these toggles visually conveys that the buttons are connected and provide immediate, on-screen feedback, enhancing usability in real-time decision-making scenarios.

</section>

<section>

## When not to use

While toggle group are a valuable UI element in many situations, there are instances when it's best to avoid using them:

### Unrelated Actions
Avoid using a toggle group when the actions or options are unrelated and do not influence each other. If each option serves a completely different purpose or affects different parts of the interface, placing them in a toggle group may confuse users into thinking they are interconnected. In such cases, it's better to present them as separate controls to make their independence clearer.

### Persistent Interactions
If the user selections need to persist across different interactions or sessions. Toggle groups are best suited for actions that require immediate feedback and may not be suitable for settings that need to be saved long-term. For more persistent states, consider using checkboxes, radio buttons, or a settings menu that ensures the selections remain even after the user navigates away or reloads the page.

</section>

<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Toogle Button |Description |Yes|
|2|Container |Description |Yes|
|3|Icons |Description |No|
|3|Label |Description |No|

{.ds-table}

</section>

<section>

## Sizing

Toggle Group come in two sizes, to match diferents scenarios:

- **Medium:** The medium-sized toggle group function as the default option across our user interfaces. It achieves a balanced blend of size and clarity, establishing itself as the standard and user-friendly choice for single-choice.

- **Large:** Choosing a large toggle group for touch-based devices offers several advantages, as it provides a larger tap target that improves accessibility and ease of interaction. This larger size is especially beneficial in important or high-priority scenarios, where ensuring precise user input is critical.

</section>

<section>

## Status

Toggle Group come in two sizes, to match diferents scenarios:

- **Default:** This is the initial state of the toggle when it is inactive but available for user interaction. It visually indicates that no action has been applied yet, but the toggle is ready to be selected.

- **Pressed:** The toggle is in an selected state, signifying that the corresponding action is currently applied or in effect. This state provides clear feedback that the user’s input has been recognized.

- **Disabled:** The toggle is inactive and cann't be interacted with, typically because the options are unavailable or restricted in the current context. This state visually indicates that no action can be performed on the toggle at this time.

</section>

<section>

## Variants

Toggle Group come in various versions, each suited for specific situations:

- **Icon (Default):** This variant displays only an icon, providing a compact visual representation of the action, ideal for limited space or familiar actions.

- **Label:** This variant shows just a text label, offering clear and direct descriptions of the action, best for situations where clarity is prioritized.

- **Icon & Label:** TThis variant combines both an icon and a label, delivering both visual and textual cues to enhance clarity and recognition, ideal for important or less familiar actions.

</section>

<section>

## Figma options

With these options, you can tweak the appearance of the radio in Figma. They are available in the Design Panel so you can compose the toggle group to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Size|`'md', 'lg'`|The button is available in three sizes. If not specified the default value is `md` .|
|Segments|`'5'` to `'2'`|The toggle group offers the possibility to display fron 5 to 2 controls|
|Configuration|`'icon + label', 'label', 'icon only'`.|There are three toggle group types to choose from so you can use, depending of the scenario. |

{.ds-table .ds-table-align-top}

</section>

<section>

## Behavior
Let's explore the behavior of the toggle group:

### Focusable area
When you reach the toggle group, the first control is focused, and you can move with the left and right arrows between the controls. 

### Validation
To enhance usability, the toggle group provides clear visual cues for selected and unselected states. In Icon + Label and Icon Only variants, unselected toggles show a line icon, while selected toggles use a solid icon, making active states easy to spot. For Label Only toggles, a check mark appears on selection, ensuring consistent, intuitive feedback across all variants.

### Default Selection
When a toggle control is pre-selected by default, it either reflects a recommended choice or a selection the user made in the past. This approach minimizes decision-making by presenting users with a familiar or suggested option while allowing easy adjustments if needed.

### Exclusive & Multiple Selections
The toggle group can support both exclusive and multiple selections, adapting to different needs. In exclusive mode, only one toggle can be active, ideal for mutually exclusive options. In multiple-selection mode, users can activate several toggles simultaneously, enabling flexible, combined choices for more complex actions.

</section>