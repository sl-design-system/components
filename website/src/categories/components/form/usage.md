---
title: Form usage
tags: usage
eleventyNavigation:
  parent: Form
  key: FormUsage
---

<section class="no-heading">

<div class="ds-example">

  <sl-form>
    <sl-form-field label="Course name">
      <sl-text-field name="courseName"></sl-text-field>
    </sl-form-field>
    <sl-form-field label="Subjects">
      <sl-checkbox-group name="subjects">
        <sl-checkbox>Mathematics</sl-checkbox>
        <sl-checkbox>Geography</sl-checkbox>
        <sl-checkbox>Physics</sl-checkbox>
        <sl-checkbox>History</sl-checkbox>
      </sl-checkbox-group>
    </sl-form-field>
    <sl-button-bar align="end">
      <sl-button>Cancel</sl-button>
      <sl-button variant="primary">Create course</sl-button>
    </sl-button-bar>
  </sl-form>

</div>

<div class="ds-code">

  ```html
  <sl-form>
    <sl-form-field label="Course name">
      <sl-text-field name="courseName"></sl-text-field>
    </sl-form-field>

    <sl-form-field label="Subjects">
      <sl-checkbox-group name="subjects">
        <sl-checkbox checked>Mathematics</sl-checkbox>
        <sl-checkbox>Geography</sl-checkbox>
        <sl-checkbox>Physics</sl-checkbox>
        <sl-checkbox>History</sl-checkbox>
      </sl-checkbox-group>
    </sl-form-field>

    <sl-button-bar align="end">
      <sl-button>Cancel</sl-button>
      <sl-button variant="primary">Create course</sl-button>
    </sl-button-bar>
  </sl-form>
  ```

</div>

</section>
