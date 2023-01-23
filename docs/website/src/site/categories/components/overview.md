---
title: Components Overview
layout: "components/components-overview.njk"
eleventyNavigation:
  parent: Components
  key: Overview
  order: 1
---
<section>

  ### Components Overview

  Here we will have a list of all components

<div class="components-wrapper">

{% for component in collections.component %}
  <div class="component">
  <h3>{{component.data.title}}</h3>
  <div>
  <a href="{{ component.url | url }}">{{ component.data.title }}</a>
  </div>
  </div>
{% endfor %}

</div>

</section>