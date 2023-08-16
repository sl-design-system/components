---
title: Components
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
layout: "components/components-overview.njk"
eleventyNavigation:
  parent: Components
  key: Overview
  order: 1
---
<div class="ds-components__content-wrapper">

TODO: Add zoom in animation on hover and changing component name colour

TODO: coming badge for PoCs

TODO: light adn dark mode

TODO: different resolutions

<div class="components-wrapper">

<section>
{% for component in collections.component %}
  <div class="component-card">
  <div class="component-card__picture">
    {{ component.data.picture }}
  </div>
  <h3>{{component.data.title}}</h3>{{ component.data.componentType }}
  <div>
  <a href="{{ component.url | url }}">{{ component.data.title }}</a>
  </div>
<a href="{{ component.url | url }}" class="header-anchor ds-heading-2">
{{ component.data.title }}
</a>
  <p>{{ component.data.shortDescription }}</p>
  </div>
{% endfor %}
</section>

</div>

## Actions {.ds-heading-1}

This is a short introduction of the section, we want to keep this within 2 or 3 lines.

<section class="ds-components__cards">
{% for component in collections.component %}
{% if component.data.componentType == "action" %}
  <div class="component-card">
  <div class="component-card__picture">
    {{ component.data.picture }}
  </div>
<a href="{{ component.url | url }}" class="header-anchor ds-heading-2">
{{ component.data.title }}
</a>
  <p>{{ component.data.shortDescription }}</p>
{{ component.data.componentType }}
  </div>
{% endif %}
{% endfor %}
</section>


## Selection {.ds-heading-1}

This is a short introduction of the section, we want to keep this within 2 or 3 lines.

<section class="ds-components__cards">
{% for component in collections.component %}
{% if component.data.componentType == "selection" %}
  <div class="component-card">
  <div class="component-card__picture">
    {{ component.data.picture }}
  </div>
<a href="{{ component.url | url }}" class="header-anchor ds-heading-2">
{{ component.data.title }}
</a>
  <p>{{ component.data.shortDescription }}</p>
{{ component.data.componentType }}
  </div>
{% endif %}
{% endfor %}
</section>

## Editable {.ds-heading-1}

This is a short introduction of the section, we want to keep this within 2 or 3 lines.

<section class="ds-components__cards">
{% for component in collections.component %}
{% if component.data.componentType == "editable" %}
  <div class="component-card">
  <div class="component-card__picture">
    {{ component.data.picture }}
  </div>
<a href="{{ component.url | url }}" class="header-anchor ds-heading-2">
{{ component.data.title }}
</a>
  <p>{{ component.data.shortDescription }}</p>
{{ component.data.componentType }}
  </div>
{% endif %}
{% endfor %}
</section>

## Feedback {.ds-heading-1}

This is a short introduction of the section, we want to keep this within 2 or 3 lines.

<section class="ds-components__cards">
{% for component in collections.component %}
{% if component.data.componentType == "feedback" %}
  <div class="component-card">
  <div class="component-card__picture">
    {{ component.data.picture }}
  </div>
<a href="{{ component.url | url }}" class="header-anchor ds-heading-2">
{{ component.data.title }}
</a>
  <p>{{ component.data.shortDescription }}</p>
{{ component.data.componentType }}
  </div>
{% endif %}
{% endfor %}
</section>

</div>