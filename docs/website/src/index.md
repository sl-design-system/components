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



Light / dark mode 

<div class="collections">
{% for post in collections.posts %}
- [ {{ post.data.title }} ]( {{ post.url }} )
{% endfor %}
</div>
