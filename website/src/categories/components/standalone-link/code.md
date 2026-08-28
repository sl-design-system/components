---
title: Standalone link code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Standalone link
  key: StandalonelinkCode
---
<section>

<div class="ds-example">
  <sl-link fill=${fill} variant="primary">
    <a href="/courses">Course overview</a>
  </sl-link>

  <sl-link fill=${fill} variant="secondary" shape="pill">
    <a href="/study-plan">Study plan</a>
  </sl-link>

  <sl-link fill=${fill} variant="success">
    <a href="/calendar">Calendar</a>
  </sl-link>
</div>

<div class="ds-code">

  ```html
  <sl-link fill=${fill} variant="primary">
    <a href="/courses">Course overview</a>
  </sl-link>

  <sl-link fill=${fill} variant="secondary" shape="pill">
    <a href="/study-plan">Study plan</a>
  </sl-link>

  <sl-link fill=${fill} variant="success">
    <a href="/calendar">Calendar</a>
  </sl-link>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="link"></ds-install-info>
{% include "../component-table.njk" %}
