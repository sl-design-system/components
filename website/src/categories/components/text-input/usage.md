---
title: Text input usage
tags: usage
eleventyNavigation:
  parent: Text input
  key: TextInputUsage
---

<section class="no-heading">

<div class="ds-example">
<form>
  <sl-label for="nickname">Nickname</sl-label>
  <sl-text-input
    id="nickname"
    hint="What would you like people to call you?"
  ></sl-text-input>
  </form>
</div>

<div class="ds-code">

  ```html
    <sl-label for="nickname">Nickname</sl-label>
    <sl-text-input id="nickname" hint="What would you like people to call you?"></sl-text-input>
  ```

</div>

</section>

<section>

## When to use

Text fields come in handy in certain situations:

<section class="ds-cards">
<figure>
{{'components/button/sl-button-when-use-actions.svg' | svgImage}}
<figcaption>

### Unique input 
When users need to input information that is unique and cannot be anticipated from a predefined set of options. Text fields provide the flexibility to capture diverse and unpredictable data.
</figcaption>
</figure>
<figure>
    {{'components/button/sl-button-when-use-navigation.svg' | svgImage}}
    <figcaption>

  ### Memorable data
  In cases where users need to input memorable data quickly, a free-form input method is more efficient than a complex control interface. Text fields offer a straightforward way for users to provide the information they have in mind.
    </figcaption>
  </figure>
</section>
</section>

<section>

## When not to use
Text fields may not be the best choice in the following scenarios:

<section class="ds-cards">
  <figure>
    {{'components/button/sl-button-when-not-use-menu.svg' | svgImage}}
    <figcaption>

  ### Predefined options
  When input data can be conveniently selected from predefined options using checkboxes, radio buttons, dropdown menus, or text areas. These structured input controls enhance efficiency and minimize errors in such cases.
    </figcaption>
  </figure>
  <figure>
    {{'components/button/sl-button-when-not-use-menu.svg' | svgImage}}
    <figcaption>

  ### Sensitive information
  For handling sensitive or confidential information, such as passwords or credit card numbers, it's advisable to utilize specialized secure input fields designed to obscure the entered data for enhanced security.
    </figcaption>
  </figure>
  <figure>
    {{'components/button/sl-button-when-not-use-menu.svg' | svgImage}}
    <figcaption>

  ### Longer text responses
  Consider using text areas when you anticipate the input length will exceed the width of a text field or when you encourage users to provide longer text responses.
    </figcaption>
  </figure>
</section>
</section>
<section>

## Anatomy
Let's dive into the fundamental elements that make up a text field and understand how they enhance user experiences.
{{ 'components/button/sl-buttons-anatomy.svg' | svgImage }}

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Container	|An input container is a structured enclosure for user input elements. It facilitates organized and user-friendly data collection in interfaces.|no|
|2|Input & Placeholder text	|Input text, entered by users, and placeholder text, providing guidance or examples.|yes|
|3|Validation icon	|Ensures input accuracy for users.|yes|

{.ds-table}

</section>

<section>

## Options

With these options you can tweak the appearance of the text input in Figma. They are available in the Design Panel so you can compose the input field to exactly fit the user experience need for the uses case you are working on.

{{ 'components/button/sl-button-figma-options.svg' | svgImage }}

|Item|Options|Description|
|-|-|-|
|Size|`'md', 'lg'`|The text input is available in two sizes. If not specified the default value is `md` (medium).|
|Variant|`'default', 'valid', 'invalid'`| When you're working on a scenario where you show what happens when a field is skipped or filled in incorrectly you can choose a different variant to show this.|
|State|`'idle','hover','active','disabled'`|These states are applied automatically in interactive examples or can be set explicitly when the use case asks for it. Default value is `idle`.|
|Placeholder|`'on', 'off'`|If the setting is enabled, the placeholder will be visible, whereas if it is disabled, the user's input will be displayed. Default value is `off`.|
|Placeholder text|`string`|Use placeholder text to give the user a short hint about what they need to input (e.g. a sample value or a short description of the expected format). <br> Read further to learn why you need to be mindful of placeholder texts on the accessibility tab.|
|Helper|`'on', 'off'`|To turn to Helper Text on or off. Default value is `off`.|
|Input Text |`string`|Will be shown as the value of the text input|
|Label|`text`|Provide users with additional context about button functionality by adding a label, ensuring clarity and ease of use.|
|Focus ring|`'on', 'off'`|Turn the focus ring option to show the focus state of the text input. Default value is `off`.|

{.ds-table .ds-table-align-top}

</section>
