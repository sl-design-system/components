---
title: Spinner usage
tags: usage
eleventyNavigation:
  parent: Spinner
  key: SpinnerUsage
---

<section class="no-heading">

<div class="ds-example">

<sl-spinner variant="alert" size="md"></sl-spinner>

</div>

<div class="ds-code">
  
  ```html
  <sl-spinner variant="alert" size="xl"></sl-spinner>
  ```

</div>

</section>


<section>

## When to use
Radio buttons are best used in situations where users need to make a single selection from multiple options within a defined group. Here are two common scenarios:

### Feedback for Delays
If there's a delay in the response time, using a spinner can reassure users that their action is being processed, reducing uncertainty and impatience.

### Asynchronous Operations
Spinners are particularly useful in asynchronous operations where users might need to wait for a response without the system appearing frozen. This could include actions like submitting a form.

### Dynamic Content Loading
When content is dynamically loaded or refreshed, a spinner can indicate that the content is being updated. This could be searching in a database and updating the content. Using a spinner during searches gives users immediate feedback that their query is processing. This approach also enhances the perceived responsiveness of the application, even during slower backend operations.

</section>


<section>

## When not to use

While radio buttons are a valuable UI element in many situations, there are instances when it's best to avoid using them:

### Predictable Delays
If the delay is predictable and very short, less than a second, using a spinner might not be necessary and can even be distracting. When action happens instantaneously, like clicking a button that toggles something immediately visible on the interface, it doesn't require a spinner.

### Minimize Usage
Avoid displaying spinners overly, especially for instantaneous actions or actions that are inessential to the user experience, such as rapid navigation transitions between pages. This can lead to user frustration and create a perception of reduced application performance. Instead, reserve spinner usage for processes where their presence informs users about ongoing actions or delays.

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

## Sizing

Spinner come in two sizes, to match diferents scenarios:

  - **Small:** Suitable for displaying spinners in areas with limited space, such as buttons, small form fields, or compact dialog boxes..

  - **Medium:** Default size spinners fit most applications and interfaces, providing a balanced visual presence without being too overwhelming.

  - **Large:** Ideal for situations where spinners need to be more prominent or easily visible, such as during longer loading times or within larger containers or components.

  - **Extra Large:** Designed to maximize visibility and ensure users can quickly identify ongoing activity, useful for displaying spinners in areas where you need to grab the user's attention quickly.

  - **2 Extra Large:** This size provides even greater visibility, making them suitable for interfaces where users may struggle with smaller elements or a bold visual presence is desired.

  - **3 Extra Large:** The biggest spinner size, offering maximum visibility and ensuring that ongoing activity is unmistakable. This is particularly useful in environments where the user's attention needs to be firmly captured or in interfaces with significant accessibility considerations.

</section>



<section>

## Variants

Spinner come in various versions, each suited for specific situations:

  - **Default:** The standard spinner appearance is suitable for general use cases without specific emphasis or contextual meaning.

  - **Accent:** Used to highlight spinners in areas that require additional attention or emphasis, typically to draw focus to important actions or processes within the interface.

  - **Info:** Utilized to indicate spinners associated with informational content or actions, providing users with feedback on ongoing processes or informative updates.

  - **Success:** Used to indicate successful actions or processes, showing users that an operation is successful or that progress will have a positive outcome.

  - **Warning:** Associated with warning or cautionary messages or actions, alerting users to potential issues or risks that require their attention or further action to mitigate.

  - **Danger:** Reserved for spinners that indicate potentially critical actions, alerting users to processes that may have negative consequences if not handled carefully or resolved promptly.

</section>


<section>

## Options

With these options, you can tweak the appearance of the radio in Figma. They are available in the Design Panel so you can compose the spinner to exactly fit the user experience need for the use case you are working on.

|Item|Options|Description|
|-|-|-|
|Size|`'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'`|The spinner is available in six sizes. If not specified the default value is `medium` .|
|Variant|`'default', 'light', 'accent', 'info', 'success', 'warning', 'danger'`|The spinner offers seven distinct intents, each conveying a unique meaning or solution to the user.|

{.ds-table .ds-table-align-top}

</section>
