---
title: Button
tags: overview
templateEngineOverride: njk,md
eleventyNavigation:
  parent: Button
  key: ButtonOverview
---

<section>

<div class="ds-example">

<sl-button fill="default" variant="primary" size="md">Button</sl-button>

</div>

<div class="ds-code">

  ```html
  <sl-button fill="default" variant="primary" size="md">Button</sl-button>
  ```

</div>

</section>

<section>

## Lorem ipsum dolor sit amet
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

<div class=ds-do-dont>

<div class="ds-success">

![Alt text example](/assets/images/example-do.svg "do picture"){.ds-do-dont__picture}

<div class="ds-success__content">

### Do

Place text here

</div>

</div>


<div class="ds-danger">

![Alt text example](/assets/images/example-dont.svg "don't picture"){.ds-do-dont__picture}

<div class="ds-danger__content">

### Don't

Place text here

</div>

</div>

</div>

</section>

<section>

## Variants

[//]: # (TODO: generate table from json)


| Element | Attribute              | Value                | Description                                                                                    |
---------|------------------------|----------------------|------------------------------------------------------------------------------------------------|
| Label   | <code>ariaLabel</code> | <code>string</code>  | Define a string that labels the action to be performed when the user interacts with the button |
| Label  | <code>ariaLabel</code>       | <code>string</code> | Define a string that labels the action to be performed when the user interacts with the button |
| Label   | <code>ariaLabel</code>       | <code>string</code>     | Define a string that labels the action to be performed when the user interacts with the button |
| Label   | <code>ariaLabel</code>       | <code>string</code>     | Define a string that labels the action to be performed when the user interacts with the button |

{.ds-table}

### Key Points
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

### Resources
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Lorem ipsum dolor sit amet
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

<section>

## Related
Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

{{page.url}}
{{page.data.file}}

{% for component in collections.components %}

[//]: # (  <h3>{{component.data.title}}</h3>)
[//]: # (  <h3>{{component.url}}</h3>)

[//]: # (  {{page.data.file}})

[//]: # (  <h3>{{component.data.file}}</h3>)
  {% if page.url == component.url %}
  <h2>{{component.data.file}}</h2>

  <ul>
      {% for module in custom-elements.custom-elements.modules -%}
        {% if module.path.includes(component.data.file) %}
          <h2>{{component.data.file}}</h2>
          <h3>test</h3>
        {% endif %}
      <li>{{ module.path }}</li>
      <li>{{ module.declarations }}</li>
      <li>{{ module.declarations.kind }}</li>
      <li>{{ module.declarations.name }}</li>
        {% for declaration in module.declarations -%}
          <li>{{ declaration.kind }}</li>
          <li>{{ declaration.name }}</li>
        {% endfor -%}
      {% endfor -%}
  </ul>
  {% endif %}
{% endfor %}

{% if page.url %}
{{page.data.file}}
{% endif %}


{% for module in custom-elements.custom-elements.modules -%}
<li>{{ module.path }}</li>
<li>{{ module.declarations }}</li>
<li>{{ module.declarations.kind }}</li>
<li>{{ module.declarations.name }}</li>
  {% for declaration in module.declarations -%}
    <li>{{ declaration.kind }}</li>
    <li>{{ declaration.name }}</li>
  {% endfor -%}
{% endfor -%}


<ul>
    {% for module in custom-elements.custom-elements.modules -%}
    <li>{{ module.path }}</li>
    <li>{{ module.declarations }}</li>
    <li>{{ module.declarations.kind }}</li>
    <li>{{ module.declarations.name }}</li>
      {% for declaration in module.declarations -%}
        <li>{{ declaration.kind }}</li>
        <li>{{ declaration.name }}</li>
      {% endfor -%}
    {% endfor -%}
</ul>


<ul>
{% for item in custom-elements.custom-elements.modules %}
  <li>{{ item.path }}</li>
{% else %}
  <li>This would display if the 'item' collection were empty</li>
{% endfor %}
</ul>

{% for animal in custom-elements.custom-elements.modules -%}
<li>{{ animal }}</li>
{% endfor -%}

[//]: # (TODO: liquid instead of nunjucks on the top and in if statement)