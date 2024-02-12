---
title: Text field code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Text field
  key: TextInputCode
---
<section class="no-heading">

<div class="ds-example">
<form>
  <sl-label for="nickname">Nickname</sl-label>
  <sl-text-field
    id="nickname"
    hint="What would you like people to call you?"
  ></sl-text-field>
  </form>
</div>

<div class="ds-code">

  ```html
    <sl-label for="nickname">Nickname</sl-label>
    <sl-text-field id="nickname" hint="What would you like people to call you?"></sl-text-field>
  ```

</div>

</section>

{% include "../component-table.njk" %}

<script>
  setTimeout(() => document.querySelector('#text-field-example')?.reportValidity(), 100);
</script>
