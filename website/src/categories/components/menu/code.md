---
title: Menu code
tags: code
APIdescription: {
  sl-menu: "Component has a range of properties to define the experience in different use cases.",
  sl-menu-button: "Component has a range of properties to define the experience in different use cases.",
  sl-menu-item: "Component has a range of properties to define the experience in different use cases.",
  sl-menu-item-group: "Component has a range of properties to define the experience in different use cases."
}
eleventyNavigation:
  parent: Menu
  key: MenuCode
---

<section>

<div class="ds-example">

<sl-menu-button position="bottom-end">
  <span slot="button">More settings</span>
  <sl-menu-item-group selects="single">
    <sl-menu-item selectable selected shortcut="$mod+Digit1">List</sl-menu-item>
    <sl-menu-item selectable shortcut="$mod+Digit2">Cards</sl-menu-item>
  </sl-menu-item-group>
  <hr />
  <sl-menu-item>
    Sort by
    <sl-menu selects="single" slot="submenu">
      <sl-menu-item selectable selected>Newest</sl-menu-item>
      <sl-menu-item selectable>Oldest</sl-menu-item>
      <sl-menu-item selectable>Name</sl-menu-item>
    </sl-menu>
  </sl-menu-item>
  <hr />
  <sl-menu-item disabled>Edit</sl-menu-item>
  <sl-menu-item>Remove</sl-menu-item>
</sl-menu-button>

</div>

<div class="ds-code">

  ```html
    <sl-menu-button position="bottom-end">
      <span slot="button">More settings</span>
      <sl-menu-item-group selects="single">
        <sl-menu-item selectable selected shortcut="$mod+Digit1">List</sl-menu-item>
        <sl-menu-item selectable shortcut="$mod+Digit2">Cards</sl-menu-item>
      </sl-menu-item-group>
      <hr />
      <sl-menu-item>
        Sort by
        <sl-menu selects="single" slot="submenu">
          <sl-menu-item selectable selected>Newest</sl-menu-item>
          <sl-menu-item selectable>Oldest</sl-menu-item>
          <sl-menu-item selectable>Name</sl-menu-item>
        </sl-menu>
      </sl-menu-item>
      <hr />
      <sl-menu-item disabled>Edit</sl-menu-item>
      <sl-menu-item>Remove</sl-menu-item>
    </sl-menu-button>
  ```

</div>

</section>
<ds-install-info link-in-navigation package="menu"></ds-install-info>
{% include "../component-table.njk" %}
