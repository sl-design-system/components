---
title: Second
eleventyNavigation:
  parent: Pages
  key: Second
  order: 2
---

<style>
  sl-card {
    margin-top: 16px;
  }
</style>

Second page content

<nord-tab-group label="Title">
  <nord-tab slot="tab">Overview</nord-tab>
  <nord-tab-panel>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt amet ipsam enim sed sequi voluptatibus, culpa
      explicabo voluptate maxime a, cumque ea reprehenderit ad consequuntur veniam? Fuga impedit iste tenetur.
    </p>
<sl-card class="card-footer">
    This card is a web component from Shoelace.
    This card has a footer.

  <div slot="footer">
    <sl-button slot="footer" variant="primary">Preview</sl-button>
  </div>
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

