---
title: Grid
tags: overview
eleventyNavigation:
  parent: Grid (PoC)
  key: GridOverview
---

Rendering content for "componentTagName": "sl-grid" is not working!!! Build doesn'y work.
[11ty] Problem writing Eleventy templates: (more in DEBUG output)

🏃 [build:site:prod:eleventy] Running command "NODE_ENV=PROD eleventy --config=site.eleventy.cjs"
[11ty] Writing dist/site/search-index.json from ./src/site/scripts/filters/search-index-json.njk
[11ty] Problem writing Eleventy templates: (more in DEBUG output)
[11ty] 1. Having trouble writing template: "dist/site/categories/components/grid/index.html" (via EleventyTemplateError)
[11ty] 2. Transform `htmlMinifier` encountered an error when transforming ./src/site/categories/components/grid/grid.md. (via EleventyTransformError)


<section>
<div class="ds-example">

<div class="ds-example__skeleton">
<sl-skeleton effect="shimmer" aria-label="loading avatar"></sl-skeleton>
<sl-skeleton effect="shimmer" aria-label="loading avatar"></sl-skeleton>
<sl-skeleton effect="shimmer" aria-label="loading avatar"></sl-skeleton>
</div>

</div>

<div class="ds-code">

  ```html
<div class="ds-example__skeleton">
    <sl-skeleton effect="shimmer" style="--sl-skeleton-border-radius: 0.5rem;" aria-label="loading avatar"></sl-skeleton>
    <sl-skeleton effect="shimmer" style="--sl-skeleton-border-radius: 0.5rem;" aria-label="loading avatar"></sl-skeleton>
    <sl-skeleton effect="shimmer" style="--sl-skeleton-border-radius: 0.5rem;" aria-label="loading avatar"></sl-skeleton>
</div>

<style>
    .ds-example__skeleton {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  
    .ds-example__skeleton sl-skeleton:nth-child(1) {
      inline-size: 40rem;
    }
  
    .ds-example__skeleton sl-skeleton:nth-child(2) {
      inline-size: 90%;
    }
  
    .ds-example__skeleton sl-skeleton:nth-child(3) {
      inline-size: 80%;
    }
</style>
  ```

</div>
</section>

<section>

## Lorem ipsum dolor sit amet

Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

<div class=ds-do-dont>

<div class="ds-success">

![Alt text example](/assets/images/example-do.svg "do picture"){.ds-do-dont__picture}

<div class="ds-success__content">

### Do
  
Place text here

</div>

</div>

<div class="ds-danger">

![Alt text example](/assets/images/example-dont.svg "don't picture"){.ds-do-dont__picture}

<div class="ds-danger__content">

### Don't
      
Place text here

</div>

</div>

</div>
</section>

{% include "../component-table.njk" %}

<section>

## Key Points

Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
  
### Resources

Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Lorem ipsum dolor sit amet
  
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Related

Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>