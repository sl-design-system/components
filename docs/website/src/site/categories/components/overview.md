---
title: Components Overview
layout: "components/components-overview.njk"
eleventyNavigation:
  parent: Components
  key: Overview
  order: 1
---

 ### Components Overview

Here we will have a list of all components

[//]: # (not collections.components)
<div class="components-wrapper">
{% for component in collections.component %}
  <div class="component">
  <h3>{{component.data.title}}</h3>
  <div>
  <a href="{{ component.url | url }}">{{ component.data.title }}</a>

[//]: # (<a href="{{ component.url | url }}">{{ component.data }}</a>)
  </div>
  </div>
{% endfor %}
</div>


<nav>
    {%- for item in collections.component -%}
        <a href="{{ item.url }}">{{ item.data.title }}</a>
    {%- endfor -%}
</nav>