---
eleventyNavigation:
  parent: Pages
  key: Design Tokens
  order: 4
title: Design Tokens
---
<link href="/css/categories/components.css" rel="stylesheet" type="text/css">

Components list
<div class="wrapper">
{% for component in collections.design-tokens %}
  <div class="component">
  <h3>{{component.data.title}}</h3>
  <nord-card padding="l">
  <a href="{{ component.url | url }}">{{ component.data.title }}</a>
  </nord-card>
  </div>
{% endfor %}
</div>
