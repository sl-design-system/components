---
title: Card
eleventyNavigation:
  parent: Components
  key: Card
  order: 3
---
<style>
  nord-card {
    margin: 16px 0;
  }
</style>

<nord-tab-group label="Title">
  <nord-tab slot="tab">Overview</nord-tab>
  <nord-tab-panel>
  <h3>
      Nordhealth cards examples
  </h3>
  <nord-card padding="l">
    <h2 slot="header">Account overview</h2>
    <nord-stack direction="horizontal">
      <nord-stack gap="l">
        <p>
          View all saved data on your Nordhealth account and choose what activity is kept to personalize your
          experience.
        </p>
        <nord-button variant="primary">Manage your account</nord-button>
      </nord-stack>
    </nord-stack>
  </nord-card>
  <nord-card padding="l">
    <h2 slot="header">Security checkup</h2>
    <nord-stack direction="horizontal">
      <nord-stack gap="l">
        <p>Our Security Checkup analyzed your account and data. We found no recommended actions this time.</p>
        <nord-button variant="primary">Manage security</nord-button>
      </nord-stack>
    </nord-stack>
  </nord-card>
  </nord-tab-panel>
  <nord-tab slot="tab">Tab 2</nord-tab>
  <nord-tab-panel>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto quasi, incidunt eum ad, rerum dolorum sequi
      numquam illum deleniti nobis doloremque asperiores natus perferendis, recusandae at dolorem et aperiam totam.
    </p>
  </nord-tab-panel>
  <nord-tab slot="tab">Tab 3</nord-tab>
  <nord-tab-panel>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, aperiam doloribus. Dolore, eaque. Distinctio
      consequatur alias quae commodi praesentium recusandae libero, voluptate veniam. Commodi, velit ad ex sequi ut
      fugit?
    </p>
  </nord-tab-panel>
</nord-tab-group>
