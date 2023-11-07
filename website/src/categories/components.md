---
eleventyNavigation:
  parent: Pages
  key: Components
  order: 5
title: Components
---
<link href="/css/categories/components.css" rel="stylesheet" type="text/css">

Components list
<div class="wrapper">
{% for component in collections.components %}
  <div class="component">
  <h3>{{component.data.title}}</h3>
  <nord-card padding="l">
  <a href="{{ component.url | url }}">{{ component.data.title }}</a>
  </nord-card>
  </div>
{% endfor %}
</div>

