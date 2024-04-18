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
    <sl-form-field hint="Please enter a descriptive name for the course." label="Course name">
      <sl-text-field name="courseName" required></sl-text-field>
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
      <sl-button fill="outline">Cancel</sl-button>
      <sl-button variant="primary">Create course</sl-button>
    </sl-button-bar>
  </sl-form>

</div>

<div class="ds-code">

  ```html
  <sl-form>
    <sl-form-field hint="Please enter a descriptive name for the course." label="Course name">
      <sl-text-field name="courseName" required></sl-text-field>
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
      <sl-button fill="outline">Cancel</sl-button>
      <sl-button variant="primary">Create course</sl-button>
    </sl-button-bar>
  </sl-form>
  ```

</div>

</section>

<section>

## When to use

The form component should be used whenever you have a form that needs to be filled out by a user. The form component is a container for form fields.

</section>

<section>

## When not to use

Do not use the form component if you only have one form field. Usually this indicates a specific usage of a form control, and that it should be used on its own.

</section>

<section>

## Related components

- [Form field](/categories/components/form-field/usage)

</section>