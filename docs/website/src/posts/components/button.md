---
title: Button
eleventyNavigation:
  parent: Components
  key: Button
  order: 2
---
<style>  
  h3 {
    margin-bottom: 16px;
  }
</style>

<nord-tab-group label="Title">
  <nord-tab slot="tab">Overview</nord-tab>
  <nord-tab-panel>
  <h3>
      Nordhealth button examples inside shoelace card
  </h3>
  <sl-card>
        <nord-button href="#">Default</nord-button>
        <nord-button href="#" variant="primary">Primary</nord-button>
        <nord-button href="#" variant="danger">Danger</nord-button>
        <nord-button href="#" variant="dashed">
          <nord-icon slot="start" size="s" name="interface-filter"></nord-icon>
          Filter
        </nord-button>
        <nord-button href="#">
          <nord-icon size="s" color="var(--n-color-icon)" name="interface-menu-small" label="Options"></nord-icon>
        </nord-button>
        <nord-button href="#" variant="plain">Plain</nord-button>
        <nord-button href="#" disabled>Disabled</nord-button>
  </sl-card>
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
