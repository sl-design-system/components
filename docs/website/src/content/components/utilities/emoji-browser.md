---
title: Emoji browser
layout: docs
eleventyNavigation:
  key: Emoji browser
  parent: Utilities
---

`<sl-emoji-browser>` is a searchable emoji picker. It shows emojis grouped by category, supports
searching by name, and can highlight a set of frequently used emojis at the top.

The emoji data is loaded at runtime, so you must tell the component where to find it through the
`base-url` attribute.

## Usage

```html
<sl-emoji-browser base-url="/emoji" style="height: 400px"></sl-emoji-browser>
```

Make sure the emoji data files are served from the URL you pass to `base-url`.

## Examples

### Frequently used

Pass a space-separated list of emojis to `frequently-used` to show them in a dedicated section at
the top.

```html
<sl-emoji-browser base-url="/emoji" frequently-used="😀 😂 😎 🤔 🤷‍♂️" style="height: 400px"></sl-emoji-browser>
```

### Initial search query

Use the `query` attribute to open the browser with a search already applied.

```html
<sl-emoji-browser base-url="/emoji" query="point" style="height: 400px"></sl-emoji-browser>
```

### Locale

Use the `locale` attribute to localize the emoji names used for searching and labelling.

```html
<sl-emoji-browser base-url="/emoji" locale="nl" style="height: 400px"></sl-emoji-browser>
```

## API

See the [API reference](/api-reference/sl-emoji-browser) for all attributes, properties and events.
