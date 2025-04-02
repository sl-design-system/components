---
title: Spinner usage
tags: usage
eleventyNavigation:
  parent: Spinner
  key: SpinnerUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-spinner size="xl"></sl-spinner>

</div>

<div class="ds-code">
  
  ```html
  <sl-spinner size="xl"></sl-spinner>
  ```

</div>

</section>


<section>

## When to use

### Feedback for Delays
If there's a delay in the response time, using a spinner can reassure users that their action is being processed, reducing uncertainty and impatience.

### Processing Actions
Spinners are particularly useful in asynchronous operations where users might need to wait for a response without the system appearing frozen. This could include actions like submitting a form.

</section>


<section>

## When not to use

### Predictable Delays
If the delay is predictable and very short, less than a second, using a spinner might not be necessary and can even be distracting. When action happens instantaneously, like clicking a button that toggles something immediately visible on the interface, it doesn't require a spinner.

### Dynamic Content
Avoid using a spinner when content is dynamically loaded or refreshed, use a [skeleton](/categories/components/skeleton/usage) instead. You can use a spinner during searching, which gives users immediate feedback that their action is processing. This enhances the perceived responsiveness of the application, but when it is loading, the new content is the skeleton.

</section>


<section>

## Anatomy

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Spin Line |This section of the circular shape indicates the visual effect of something processing while it rotates. |no|
|2|Spin Shadow |The visual element that creates the circular shape, often resembling a ring. This shape serves as the base for the spinner animation. |no|


{.ds-table .ds-table-align-top}

</section>


<section>

## Figma Options

With these options, you can tweak the appearance of the spinner in Figma. They are available in the Design Panel so you can compose the spinner to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Size|`xs` `sm` `md` `lg` `xl` `2xl` `3xl`|Indicates the size of the spinner. If not specified the default value is `medium`.|

{.ds-table .ds-table-align-top}

</section>
