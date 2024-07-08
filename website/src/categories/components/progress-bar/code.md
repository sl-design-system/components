---
title: Progress bar code
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Progress bar
  key: ProgressBarCode
---
<style>
#progress-code-example {
  display: flex;
  flex-direction: column;
  gap: 24px;
  inline-size: 60%;
}
</style>

<section class="no-heading">

<div class="ds-example">
<div id="progress-code-example">
  <sl-progress-bar value="60" label="File upload">
    Uploaded 60% of 100%
  </sl-progress-bar>
  <sl-progress-bar value="100" label="File upload" variant="success">
    File uploaded succesfully
  </sl-progress-bar>
  <sl-progress-bar value="30" label="File upload" variant="warning">
    File size is too big
  </sl-progress-bar>
  <sl-progress-bar value="100" label="File upload" variant="error">
    Uploaded an invalid file type
  </sl-progress-bar>
  <sl-progress-bar indeterminate label="Generating report">
    Please wait
  </sl-progress-bar>
</div>
</div>

<div class="ds-code">

  ```html
    <sl-progress-bar value="60" label="File upload">
      Uploaded 60% of 100%
    </sl-progress-bar>
    <sl-progress-bar value="100" label="File upload" variant="success">
      File uploaded succesfully
    </sl-progress-bar>
    <sl-progress-bar value="30" label="File upload" variant="warning">
      File size is too big
    </sl-progress-bar>
    <sl-progress-bar value="100" label="File upload" variant="error">
      Uploaded an invalid file type
    </sl-progress-bar>
    <sl-progress-bar indeterminate label="Generating report">
      Please wait
    </sl-progress-bar>
  ```

</div>

</section>

<ds-install-info link-in-navigation package="progress-bar"></ds-install-info>
{% include "../component-table.njk" %}
