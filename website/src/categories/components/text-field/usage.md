---
title: Text field usage
tags: usage
eleventyNavigation:
  parent: Text field
  key: TextInputUsage
---

<section class="no-heading">

<div class="ds-example">
  <sl-text-field
    id="first-name"
    value="John"
    aria-label="First name"
  ></sl-text-field>
</div>

<div class="ds-code">

  ```html
    <sl-text-field id="first-name" value="John" aria-label="First name"></sl-text-field>
  ```

</div>

</section>

<section>

## When to use

The following guidance describes when to use the Text Field component.

### Unique input 
When users need to input information that is unique and cannot be anticipated from a predefined set of options. Text fields provide the flexibility to capture diverse and unpredictable data.

### Single-line input
Text fields are ideal for capturing single-line responses.
</section>

<section>

## When not to use
Text fields may not be the best choice in the following scenarios:

### Sensitive information
For handling sensitive or confidential information, such as passwords or credit card numbers, it's advisable to utilize specialized secure input fields designed to obscure the entered data for enhanced security.

### Longer text responses
Consider using a [text area](/categories/components/textarea/) when you anticipate the input length will exceed the width of a text field or when you encourage users to provide longer text responses.
  
</section>

<section>

## Anatomy

<div class="ds-table-wrapper">
  
|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container	|An input container is a structured enclosure for user input elements. It facilitates organized and user-friendly data collection in interfaces.|no|
|2|Input & Placeholder text	|Input text, entered by users, and placeholder text, providing guidance or examples.|yes|
|3|Validation icon	|Ensures input accuracy for users.|yes|

{.ds-table}

</div>

</section>

<section>

## Options

With these options you can tweak the appearance of the text field in Figma. They are available in the Design Panel so you can compose the input field to exactly fit the user experience need for the uses case you are working on.

<div class="ds-table-wrapper">
  
|Item|Options|Description|
|-|-|-|
|Size|`md` `lg`|The text field is available in two sizes. If not specified the default value is `md` (medium).|
|Variant|`default` `valid` `invalid`| When you're working on a scenario where you show what happens when a field is skipped or filled in incorrectly you can choose a different variant to show this.|
|State|`idle` `hover` `active` `disabled`|These states are applied automatically in interactive examples or can be set explicitly when the use case asks for it. Default value is `idle`.|
|Placeholder|`boolean`|If the setting is enabled, the placeholder will be visible, whereas if it is disabled, the user's input will be displayed. Default value is `off`.|
|Placeholder text|`value`|Use placeholder text to give the user a short hint about what they need to input (e.g. a sample value or a short description of the expected format). Placeholder is not a replacement for labels. It's an optional feature that disappears once users begin entering their data. |
|Hint|`boolean`|To turn to hint on or off. Default value is `off`.|
|Input Text |`value`|Will be shown as the value of the text field|
|Label|`value`|Provide users with additional context about button functionality by adding a label, ensuring clarity and ease of use.|
|Focus ring|`boolean`|Turn the focus ring option to show the focus state of the text field. Default value is `off`.|

{.ds-table .ds-table-align-top}

</div>

</section>
