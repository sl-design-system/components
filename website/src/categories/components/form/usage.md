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
      <sl-button>Cancel</sl-button>
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

## When to use

The form component should be used whenever you have a form that needs to be filled out by a user. The form component is a container for form fields.

## When not to use

Do not use the form component if you only have one form field. Usually this indicates a specific usage of a form control, and should be used on its own.

## Required or optional

The form itself manages a `mark` state. This determines how required or optional labels should be shown. If the required fields outnumber the optional fields, only the optional fields will be marked. If it is the other way around, then only the required fields will be marked.

This behavior happens automatically, and the developer does not need to do anything to make it work.

