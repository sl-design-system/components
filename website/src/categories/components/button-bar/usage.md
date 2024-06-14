---
title: Button bar usage
tags: usage
eleventyNavigation:
  parent: Button bar
  key: ButtonBarUsage
---

<section>

<div class="ds-example">
  <div class="ds-example__code-wrapper">
    <sl-button-bar align="center" aria-label="example of button bar">
    <sl-button fill="link" variant="default">Cancel</sl-button>
    <sl-button fill="outline" variant="primary">Save for later</sl-button>
    <sl-button fill="solid" variant="primary">Send</sl-button>
    </sl-button-bar>
  </div>
</div>

<div class="ds-code">

  ```html
  <sl-button-bar align="center" aria-label="example of button bar">
    <sl-button fill="link" variant="default">Cancel</sl-button>
    <sl-button fill="outline" variant="primary">Save for later</sl-button>
    <sl-button fill="solid" variant="primary">Send</sl-button>
  </sl-button-bar>
  ```

</div>

</section>

<section>

## When to use

The Button bar component is typically used in user interfaces where a group of actions can be performed related to a specific context or where the user needs to make a choice between a few options. It's designed to provide a clean and organized way to present up to three buttons side by side, which can be useful in various scenarios such as form submissions, navigation, or initiating different functionalities.

Here are a few examples:
- **Form Actions**: When you have a form that requires actions like 'Submit', 'Cancel', or 'Reset', a button bar can group these actions together.
- **Navigation**: In cases where you need to guide the user through a multi-step process, like a wizard or a survey, the button bar can be used to navigate between steps with 'Next', 'Previous', or 'Finish' buttons.
- **Functional Grouping**: If there are multiple actions that can be taken on a particular piece of content or a section within a page, such as 'Edit', 'Delete', or 'Save', the button bar will group these actions in a logical and visually cohesive manner.

</section>

<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Name	|Descriptiom	|yes/no|
|2|Name	|Descriptiom	|yes/no|
|3|Name	|Descriptiom	|yes/no|


{.ds-table}

</section>

<section>

<section>

## Options

With these options you can tweak the appearance of the button bar in Figma. They are available in the Design Panel so you can compose the button to exactly fit the user experience need for the uses case you are working on.

{{ 'components/button/sl-button-figma-options.svg' | svgImage }}

|Item|Options|Description|
|-|-|-|
|Item|`option`|Description|
|Item|`option`|Description|
|Item|`option`|Description|
|Item|`option`|Description|

{.ds-table .ds-table-align-top}

</section>
