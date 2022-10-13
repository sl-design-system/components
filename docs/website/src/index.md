---
title: Welcome to Sanoma Learning Design System
layout: "base.njk"
eleventyNavigation:
  key: Pages
---

<style>
.collections {
  border-radius: 3px;
  width: 50%;
  padding: 16px 0;
  box-shadow: 0 0 0 1px lightgray,0 1px 5px rgba(12, 12, 12, 0.05),0 0 40px rgba(12, 12, 12, 0.015);
}
</style>

<demo-greeter name="World"> test</demo-greeter>

<my-element></my-element>

Teaser page

SL DS components:
<sl-button>Primary</sl-button>
<sl-button disabled>Disabled</sl-button>
<sl-button variant="secondary">Secondary</sl-button>
<sl-button variant="secondary" disabled>Disabled</sl-button>
<sl-button variant="success">Success</sl-button>
<sl-button variant="success" disabled>Disabled</sl-button>
<sl-button variant="danger">Danger</sl-button>
<sl-button variant="danger" disabled>Disabled</sl-button>
<sl-button variant="info">Info</sl-button>
<sl-button variant="info" disabled>Disabled</sl-button>
<sl-button variant="warning">Warning</sl-button>
<sl-button variant="warning" disabled>Disabled</sl-button>

Light / dark mode 

<div class="collections">
{% for category in collections.categories %}
- [ {{ category.data.title }} ]( {{ category.url }} )
{% endfor %}
</div>
