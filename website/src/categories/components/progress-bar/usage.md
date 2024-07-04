---
title: Progress bar usage
tags: usage
eleventyNavigation:
  parent: Progress bar
  key: ProgressBarUsage
---

<section class="no-heading">

<div class="ds-example">
  example
</div>

<div class="ds-code">

  ```html
    example
  ```

</div>

</section>


<section>

## When to use

### Long operations
A progress bar is essential for tasks that can take a considerable amount of time to complete or have unpredictable durations. It helps users stay informed about the ongoing status of the process.

### File uploads/downloads
A progress bar is used to visually indicate the progression of system operations like downloading and uploading files. It provides users with real-time feedback on the status of these processes.

### Quantitative information
A progress bar is suitable when the progress of a task can be quantitatively measured, such as using percentages. For instance, it's effective for showing teachers the percentage completion of their students' assignments.

</section>


<section>

## When not to use

### Expanded information
When the loading time is anticipated to display extensive information, opt for [skeleton](categories/components/spinner/) states instead of a progress bar.

### Short actions
If a process completes quickly, typically in less than 5 seconds, it's better to use a [spinner](categories/components/spinner/) instead of implementing a progress bar.

</section>


<section>

## Anatomy

<div class="ds-table-wrapper">

| Item | Name | Description | Optional|
|-|-|-|-|
| 1 | Label | Text describing the process referenced by the progress bar. Can be visually hidden but must be defined for accessibility purposes. |yes|
| 2 | Hint |  Assistive text providing additional information about the ongoing process. For determinate progress bars, it typically displays progression as a percentage, fraction, ratio, or numeric value. |no|
| 3 | Track | The static area that the bar indicator moves on top of and acts as a fixed visual reference of what the total length and duration of the process could be.|no|
| 4 | Bar indicator	| Indicates how much the process has progressed. |yes|
| 5 | Status icon	| Indicates the state of the progress bar. |yes|

{.ds-table .ds-table-align-top}

</div>

</section>


<section>

## Figma Options

With these options, you can tweak the appearance of the progress bar in Figma. They are available in the Design Panel so you can compose the progress bar to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|State|`default` `success` `error` `warning`|To indicate the state of the progress bar.|
|Progress|`0%` `25%` `50%` `75%` `100%` `inderterminate`| To visualise the progress. |
|Label|`boolean`| To show the label on top of the progress bar. |
|Hint|`value`| To enter the value of the hint. |

{.ds-table .ds-table-align-top}


</section>

