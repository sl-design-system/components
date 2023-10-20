---
title: Checkbox code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Checkbox
  key: CheckboxCode
---

<section>
<style>
  form {
    display: flex;
    gap: 2.4rem;
  }
</style>

<div class="ds-example">

<form id="checkboxes-example">
    <sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" value="yes" disabled>Disabled</sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" value="yes" checked disabled>Disabled checked</sl-checkbox>
    <sl-checkbox id="checkbox-valid" name="checkbox" value="yes" valid>Valid</sl-checkbox>
    <sl-checkbox id="checkbox-invalid" name="checkbox" value="yes" required invalid="true">Invalid</sl-checkbox>

[//]: # (  <div>)

[//]: # (    <sl-checkbox id="checkbox" name="checkbox" value="yes" indeterminate>Checkbox indeterminate</sl-checkbox>)

[//]: # (    <sl-checkbox id="checkbox-valid" name="checkbox" value="yes" valid indeterminate>Indeterminate valid</sl-checkbox>)

[//]: # (    <sl-checkbox id="checkbox-invalid" name="checkbox" value="yes" required invalid="true" indeterminate>Indeterminate invalid</sl-checkbox>)

[//]: # (    <sl-checkbox id="checkbox" name="checkbox" value="yes" indeterminate disabled>Indeterminate disabled</sl-checkbox>)

[//]: # (  </div>)
</form>

</div>

<div class="ds-code">

  ```html
  <sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>
<sl-checkbox id="checkbox-valid" name="checkbox" value="yes" valid>Checkbox</sl-checkbox>
<sl-checkbox id="checkbox-invalid" name="checkbox" value="yes" required invalid>Checkbox</sl-checkbox>


<form id="checkboxes-example">
  <div>
    <sl-checkbox id="checkbox" name="checkbox" value="yes">Checkbox</sl-checkbox>
    <sl-checkbox id="checkbox-valid" name="checkbox" value="yes" valid>Valid</sl-checkbox>
    <sl-checkbox id="checkbox-invalid" name="checkbox" value="yes" required invalid="true">Invalid</sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" value="yes" disabled>Checkbox disabled</sl-checkbox>
  </div>
  <div>
    <sl-checkbox id="checkbox" name="checkbox" value="yes" indeterminate>Checkbox indeterminate</sl-checkbox>
    <sl-checkbox id="checkbox-valid" name="checkbox" value="yes" valid indeterminate>Indeterminate valid</sl-checkbox>
    <sl-checkbox id="checkbox-invalid" name="checkbox" value="yes" required invalid="true" indeterminate>Indeterminate invalid</sl-checkbox>
    <sl-checkbox id="checkbox" name="checkbox" value="yes" indeterminate disabled>Indeterminate disabled</sl-checkbox>
  </div>
</form>
  ```

</div>

</section>

{% include "../component-table.njk" %}

<section>

## Tokens

Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<script>
// setTimeout(() => document.querySelector('form')?.reportValidity());

requestAnimationFrame(() => {
  document.querySelector('#checkboxes-example')?.reportValidity();
  console.log('form', document.querySelector('#checkboxes-example'));
});

setTimeout(() => document.querySelector('form')?.reportValidity(), 500);
</script>