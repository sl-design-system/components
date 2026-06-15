---
title: Editor
layout: component
eleventyNavigation:
  key: Editor
  parent: Form
---

```html {.example .show-source}
<sl-form-field label="Description">
  <sl-editor></sl-editor>
</sl-form-field>
```

## Usage

`<sl-editor>` is a rich text editor for formatted content. It provides a toolbar for common
formatting — bold, italic, lists and more — and integrates with `<sl-form>` like any other form
control.

Wrap it in an [`<sl-form-field>`](/components/form/form-field) to add a label, hint and validation
messages.

## Examples

### Basic

```html {.example .show-source}
<sl-editor></sl-editor>
```

### Disabled

```html {.example .show-source}
<sl-editor disabled></sl-editor>
```

## Setting and reading content

The editor's content is available through its `value` property. Set it to pre-fill the editor, and
read it to get the current content.

```html
<sl-editor id="editor"></sl-editor>

<script type="module">
  const editor = document.getElementById('editor');

  // Pre-fill the editor
  editor.value = '<p>Hello <strong>world</strong></p>';

  // Read the content later
  console.log(editor.value);
</script>
```

## API

See the [API reference](/api-reference/sl-editor) for all attributes and properties.
