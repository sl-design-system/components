---
title: Progress bar
layout: component
eleventyNavigation:
  key: Progress bar
  parent: Status
---

```html {.example .show-source}
<sl-progress-bar value="60" label="Uploading file">Uploaded 60% of 100%</sl-progress-bar>
```

## Usage

`<sl-progress-bar>` shows the progress of a task. Use it when you can measure how far along
something is (for example an upload). When the duration is unknown, use the `indeterminate` state or
a [spinner](/components/status/spinner) instead.

Set the progress with the `value` attribute (0–100), describe the task with the `label` attribute,
and optionally add helper text in the default slot.

## Examples

### Basic

```html {.example .show-source .vertical}
<sl-progress-bar value="60" label="Uploading file">Uploaded 60% of 100%</sl-progress-bar>
```

### Variants

The `variant` attribute communicates the outcome of the task: `success`, `warning` or `error`.

```html {.example .show-source .vertical}
<sl-progress-bar value="100" label="Upload complete" variant="success">File uploaded</sl-progress-bar>
<sl-progress-bar value="40" label="Low disk space" variant="warning">40% of 100%</sl-progress-bar>
<sl-progress-bar value="50" label="Upload failed" variant="error">50% of 100%</sl-progress-bar>
```

### Colors

Use the `color` attribute for a decorative, non-semantic color such as `blue`, `green`, `orange`,
`purple`, `red`, `teal` or `yellow`.

```html {.example .show-source .vertical}
<sl-progress-bar value="60" label="Color blue" color="blue"></sl-progress-bar>
<sl-progress-bar value="60" label="Color purple" color="purple"></sl-progress-bar>
<sl-progress-bar value="60" label="Color teal" color="teal"></sl-progress-bar>
```

### Indeterminate

When you can't measure progress, add the `indeterminate` attribute to show continuous activity.

```html {.example .show-source .vertical}
<sl-progress-bar indeterminate label="Generating report">This may take a few minutes</sl-progress-bar>
```

## API

See the [API reference](/api-reference/sl-progress-bar) for all attributes and properties.
