---
title: Toggle button usage
tags: usage
eleventyNavigation:
  parent: Toggle button
  key: ToggleButtonUsage
---

<section>

<div class="ds-example" style="flex-direction: column; gap: 2rem;">
  <sl-toggle-group multiple>
    <sl-toggle-button aria-label="Bold" pressed>
      <sl-icon name="far-bold" slot="default"></sl-icon>
      <sl-icon name="fas-bold" slot="pressed"></sl-icon>
    </sl-toggle-button>
    <sl-toggle-button aria-label="Italic">
      <sl-icon name="far-italic" slot="default"></sl-icon>
      <sl-icon name="fas-italic" slot="pressed"></sl-icon>
    </sl-toggle-button>
    <sl-toggle-button aria-label="Underline" pressed>
      <sl-icon name="far-underline" slot="default"></sl-icon>
      <sl-icon name="fas-underline" slot="pressed"></sl-icon>
    </sl-toggle-button>
  </sl-toggle-group>
  <sl-toggle-group>
    <sl-toggle-button>All types</sl-toggle-button>
    <sl-toggle-button>Primary education</sl-toggle-button>
    <sl-toggle-button pressed>Secondary education</sl-toggle-button>
  </sl-toggle-group>
</div>

<div class="ds-code">

  ```html
    <sl-toggle-group multiple>
      <sl-toggle-button aria-label="Bold" pressed>
        <sl-icon name="far-bold" slot="default"></sl-icon>
        <sl-icon name="fas-bold" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Italic">
        <sl-icon name="far-italic" slot="default"></sl-icon>
        <sl-icon name="fas-italic" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button aria-label="Underline" pressed>
        <sl-icon name="far-underline" slot="default"></sl-icon>
        <sl-icon name="fas-underline" slot="pressed"></sl-icon>
      </sl-toggle-button>
    </sl-toggle-group>
    <sl-toggle-group>
      <sl-toggle-button>All types</sl-toggle-button>
      <sl-toggle-button>Primary education</sl-toggle-button>
      <sl-toggle-button pressed>Secondary education</sl-toggle-button>
    </sl-toggle-group>
  ```

</div>

</section>

<section>

## When to use

...

</section>

<section>

## When not to use

...

</section>

<section>

## Anatomy

...

</section>

<section>

## Figma Options

...

</section>
