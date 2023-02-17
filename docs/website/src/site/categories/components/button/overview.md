---
title: Button
tags: overview
eleventyNavigation:
  parent: Button
  key: ButtonOverview
---

[//]: # (templateEngineOverride: njk,md)

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

{% include "../component-table.njk" %}

[//]: # (TODO: liquid instead of nunjucks on the top and in if statement)

{% for component in collections.components -%}

<h1>{{component.data.file}}</h1>
<h1>{{component.url}}</h1>
<h1>{{page.url}}</h1>
{% assign componentUrl = component.url | append: "" %}
{% assign pageUrl = page.url | append: "" %}
{% if pageUrl == componentUrl %}
<h2 style="color:red">{{pageUrl}}</h2>
<h2 style="color:green">{{componentUrl}}</h2>
{% endif %}
{% endfor -%}




{% for component in collections.components -%}
{% for module in custom-elements.custom-elements.modules -%}

{% assign path = module.path | append: "" %}
{% assign fileName = component.data.file | append: "" %}
{% assign componentUrl = component.url | append: "" %}
{% assign pageUrl = page.url | append: "" %}

{% if path contains fileName and pageUrl == componentUrl %}


{% assign declarations = module.declarations %}
{% for declaration in declarations -%}

<h1>{{fileName}}</h1>



{% assign members = declaration.members %}
<h2>Properties</h2>
<table class="ds-table">
<thead>
<tr>
<th>Element</th>
<th>Attribute</th>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
{% for member in members -%}
{% unless member.privacy %}
<tr>
<td>{{member.name}}</td>
<td><code>{{member.default}}</code></td>
{% assign types = member.type %}
{% for type in types -%}
<td><code>{{type}}</code></td>
{% endfor -%}
<td>{{member.description}}</td>
</tr>
{% endunless %}
{% endfor -%}
</tbody>
</table>



{% assign attributes = declaration.attributes %}
<h2>Attributes</h2>
<table class="ds-table">
<thead>
<tr>
<th>Element</th>
<th>Attribute</th>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
{% for attribute in attributes -%}
<tr>
<td>{{attribute.name}}</td>
<td><code>{{attribute.fieldName}}</code></td>
<td><code>{{attribute.default}}</code></td>
<td>{{attribute.description}}</td>
</tr>
{% endfor -%}
</tbody>
</table>



{% endfor -%}



{% endif %}

{% endfor -%}
{% endfor -%}