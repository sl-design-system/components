---
title: Upload
description: An upload component that allows users to select and upload files through click or drag-and-drop interactions.
componentType: form
shortDescription: Upload files via click or drag-and-drop.
picture: <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="none" aria-labelledby="uploadTitle uploadDesc" role="img"><title id="uploadTitle">Illustration of upload component.</title><desc id="uploadDesc">An illustrated upload component representing file upload functionality.</desc><rect x="50" y="50" width="200" height="100" rx="8" fill="#f0f0f0" stroke="#36F" stroke-width="2" stroke-dasharray="8 4"/><path d="M150 85 L150 105 M140 95 L150 85 L160 95" stroke="#36F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="150" y="125" font-size="12" text-anchor="middle" fill="#666">Drop files here</text></svg>
pictureDark: <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="none" aria-labelledby="uploadDarkTitle uploadDarkDesc" role="img"><title id="uploadDarkTitle">Illustration of upload component.</title><desc id="uploadDarkDesc">An illustrated upload component representing file upload functionality.</desc><rect x="50" y="50" width="200" height="100" rx="8" fill="#222" stroke="#5985FF" stroke-width="2" stroke-dasharray="8 4"/><path d="M150 85 L150 105 M140 95 L150 85 L160 95" stroke="#5985FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><text x="150" y="125" font-size="12" text-anchor="middle" fill="#aaa">Drop files here</text></svg>
layout: "categories/components/components.njk"
tags: component
packageName: upload
storybookCategory: form
eleventyNavigation:
  parent: Components
  key: Upload
  status: ready
---

## Usage

The upload component provides a user-friendly way to select and upload files. Users can either click to browse files or drag and drop files directly into the dropzone.

```html
<sl-upload></sl-upload>
```

## Features

- **Click to browse**: Click the dropzone to open the native file picker
- **Drag and drop**: Drag files directly onto the dropzone
- **Multiple files**: Support for single or multiple file selection
- **File validation**: Filter files by type and size
- **File preview**: Display selected files with name and size
- **Remove files**: Remove individual files from the selection
- **Form integration**: Full support for form submission and validation

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `accept` | `string` | - | Accepted file types (e.g., "image/*,.pdf") |
| `disabled` | `boolean` | `false` | Whether the upload is disabled |
| `drag-drop` | `boolean` | `true` | Whether drag-and-drop is enabled |
| `max-size` | `number` | - | Maximum file size in bytes |
| `multiple` | `boolean` | `false` | Whether multiple files can be selected |
| `required` | `boolean` | `false` | Whether the upload is required |
| `size` | `'md' \| 'lg'` | `'md'` | The size of the upload component |

## Examples

### Multiple Files

Allow users to select multiple files at once:

```html
<sl-upload multiple></sl-upload>
```

### Accept Images Only

Restrict file selection to images:

```html
<sl-upload accept="image/*"></sl-upload>
```

### Specific File Types

Accept only specific file extensions:

```html
<sl-upload accept=".pdf,.doc,.docx"></sl-upload>
```

### Maximum File Size

Limit the file size to 5MB:

```html
<sl-upload max-size="5242880" multiple></sl-upload>
```

### Large Size

Use the large variant for more prominent display:

```html
<sl-upload size="lg"></sl-upload>
```

### Custom Content

Customize the dropzone content:

```html
<sl-upload>
  <div style="text-align: center; padding: 2rem;">
    <h3>Drop your documents here</h3>
    <p>or click to browse</p>
  </div>
</sl-upload>
```

### In a Form

Use the upload component within a form:

```html
<sl-form>
  <sl-form-field label="Upload files" hint="Select one or more files">
    <sl-upload name="files" required multiple></sl-upload>
  </sl-form-field>
  
  <sl-button type="submit" variant="primary">Submit</sl-button>
</sl-form>
```

## Accessibility

The upload component is fully accessible:

- Uses a native file input element for proper keyboard navigation
- Supports screen readers with appropriate ARIA labels
- Provides clear visual feedback for drag-and-drop interactions
- Maintains focus management for keyboard users

## Events

| Event | Description |
|-------|-------------|
| `sl-change` | Emitted when files are selected or changed |
| `sl-invalid-files` | Emitted when files are rejected due to validation (type, size, or multiple constraints). Event detail contains `files` (rejected files) and `reasons` (array of rejection reasons) |
| `sl-blur` | Emitted when the component loses focus |
| `sl-focus` | Emitted when the component gains focus |

## CSS Parts

| Part | Description |
|------|-------------|
| `dropzone` | The dropzone area where users can click or drop files |
| `file-list` | The list of selected files |

## Slots

| Slot | Description |
|------|-------------|
| default | The content shown in the dropzone. Use this to customize the upload prompt |
