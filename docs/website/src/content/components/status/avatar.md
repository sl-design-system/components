---
title: Avatar
layout: component
eleventyNavigation:
  key: Avatar
  parent: Status
---

```html {.example .show-source}
<sl-avatar display-name="Lynn Smith"></sl-avatar>
```

## Usage

`<sl-avatar>` shows a picture, initials or icon to give a quickly recognizable representation of a
user. When no picture is available it falls back to the initials, which are derived automatically
from the display name.

Set a picture with the `picture-url` attribute. While the image loads, or if it fails, the avatar
shows the initials instead.

```html
<sl-avatar
  display-name="Lynn Smith"
  picture-url="https://sanomalearning.design/avatars/lynn.png"></sl-avatar>
```

## Examples

### Sizes

Use the `size` attribute to choose from `sm`, `md` (default), `lg`, `xl`, `2xl`, `3xl` and `4xl`.

```html {.example .show-source .horizontal}
<sl-avatar display-name="Lynn Smith" size="sm" image-only></sl-avatar>
<sl-avatar display-name="Lynn Smith" size="md" image-only></sl-avatar>
<sl-avatar display-name="Lynn Smith" size="lg" image-only></sl-avatar>
<sl-avatar display-name="Lynn Smith" size="xl" image-only></sl-avatar>
<sl-avatar display-name="Lynn Smith" size="2xl" image-only></sl-avatar>
```

### Shape

The `shape` attribute switches between a `circle` (default) and a `square` avatar.

```html {.example .show-source .horizontal}
<sl-avatar display-name="Lynn Smith" shape="circle" image-only></sl-avatar>
<sl-avatar display-name="Lynn Smith" shape="square" image-only></sl-avatar>
```

### Color and emphasis

When showing initials, use the `color` attribute to pick the background color and `emphasis` to
switch between a `subtle` (default) and a `bold` appearance. Available colors are `blue`, `green`,
`grey`, `orange`, `purple`, `red`, `teal` and `yellow`.

```html {.example .show-source .horizontal}
<sl-avatar display-name="Lynn Smith" color="blue" emphasis="subtle" image-only></sl-avatar>
<sl-avatar display-name="Robin Fox" color="green" emphasis="bold" image-only></sl-avatar>
<sl-avatar display-name="Sam Reed" color="purple" emphasis="bold" image-only></sl-avatar>
```

### Initials and name

By default the name is shown next to the avatar. Set `image-only` to hide it, or use the
`display-initials` attribute to override the automatically derived initials.

```html {.example .show-source}
<sl-avatar display-name="Lynn Smith"></sl-avatar>
<sl-avatar display-name="Lynn Smith" display-initials="LS"></sl-avatar>
<sl-avatar display-name="Lynn Smith" image-only></sl-avatar>
```

### Vertical

Set `vertical` to place the name below the avatar instead of beside it.

```html {.example .show-source .horizontal}
<sl-avatar display-name="Lynn Smith" vertical></sl-avatar>
```

### Badge

Use the `badge` slot to overlay a status indicator, such as a [badge](/components/status/badge), on
the avatar.

```html {.example .show-source .horizontal}
<sl-avatar display-name="Lynn Smith" image-only>
  <sl-badge slot="badge" color="green" emphasis="bold" size="sm"></sl-badge>
</sl-avatar>
```

## Accessibility

Always provide a `display-name`; it is used both for the visible label and as the accessible name
when the avatar is `image-only`.

## API

See the [API reference](/api-reference/sl-avatar) for all attributes and properties.
