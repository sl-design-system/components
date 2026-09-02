---
title: Standalone link code
tags: code
APIdescription: API reference for configuring standalone links across common use cases.
eleventyNavigation:
  parent: Standalone link
  key: StandalonelinkCode
---
<section>

<div class="ds-example">
  <sl-link fill="outline" variant="primary">
    <a href="/courses">Course overview</a>
  </sl-link>

  <sl-link variant="secondary" shape="pill">
    <a href="/study-plan">Study plan</a>
  </sl-link>

  <sl-link variant="success">
    <a href="/calendar">Calendar</a>
  </sl-link>
</div>

<div class="ds-code">

  ```html
  <sl-link fill="outline" variant="primary">
    <a href="/courses">Course overview</a>
  </sl-link>

  <sl-link variant="secondary" shape="pill">
    <a href="/study-plan">Study plan</a>
  </sl-link>

  <sl-link variant="success">
    <a href="/calendar">Calendar</a>
  </sl-link>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="link"></ds-install-info>
{% include "../component-table.njk" %}
