---
eleventyNavigation:
  parent: Pages
  key: Design Tokens
  order: 6
title: Design Tokens
---
<style>
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 32px;
  }

  .component {
    display: flex;
    flex-direction: column;
  }
</style>

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
