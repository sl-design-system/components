---
title: Button
description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
eleventyNavigation:
  parent: Components
  key: Button
  order: 3
---

[//]: # (import { Button } from "@sanomalearning/slds-core/button";)

[//]: # (<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.87/dist/components/button/button.js"></script>)
[//]: # (<script type="text/javascript">)

[//]: # (      {% include "@sanomalearning/slds-core/button" %})

[//]: # (</script>)

[//]: # (Left for the future use)
[//]: # (<div class="ds-tabs-wrapper">)

[//]: # (  <a href="#overview" class="ds-tab active">Overview</a>)

[//]: # (  <a href="#specs" class="ds-tab">Specs</a>)

[//]: # (  <a href="#usage" class="ds-tab">Usage</a>)

[//]: # (  <a href="#accessibility" class="ds-tab">Accessibility</a>)

[//]: # (  <a href="#code" class="ds-tab">Code</a>)

[//]: # (</div>)
[//]: # ( TODO: create tabs as a web component)

[//]: # (<dna-tab-bar>)

[//]: # (<dna-tab-button>Lorem</dna-tab-button>)

[//]: # (<dna-tab-button>Ipsum</dna-tab-button>)

[//]: # (<dna-tab-button>Dolor</dna-tab-button>)

[//]: # (</dna-tab-bar>)

[//]: # (<dna-tabs>test</dna-tabs>)

[//]: # ()
[//]: # (<dna-tabs>)

[//]: # (  <dna-tab-bar>)

[//]: # (    <dna-tab-button>Lorem</dna-tab-button>)

[//]: # (    <dna-tab-button>Ipsum</dna-tab-button>)

[//]: # (    <dna-tab-button>Dolor</dna-tab-button>)

[//]: # (  </dna-tab-bar>)

[//]: # (  <dna-tab>)

[//]: # (    Irure duis minim est esse veniam cupidatat. Velit et reprehenderit ullamco fugiat dolore irure exercitation laboris)

[//]: # (    ipsum laboris est mollit ullamco. Esse voluptate ex excepteur dolore pariatur sint fugiat deserunt enim Lorem.)

[//]: # (  </dna-tab>)

[//]: # (  <dna-tab>)

[//]: # (    Cupidatat sit pariatur velit quis ipsum elit Lorem incididunt veniam mollit. Veniam mollit velit incididunt)

[//]: # (    voluptate anim laborum sit dolore. Officia nostrud minim tempor cillum ipsum culpa proident irure id consequat. Qui)

[//]: # (    adipisicing veniam veniam sit fugiat enim est adipisicing.)

[//]: # (  </dna-tab>)

[//]: # (  <dna-tab>)

[//]: # (    Eiusmod dolore dolore reprehenderit velit laboris Lorem ullamco id. Ex sunt culpa nostrud commodo exercitation)

[//]: # (    fugiat laborum elit id laborum excepteur. Est ipsum sunt ex et nulla aliquip dolor cupidatat. Aliqua ullamco cillum)

[//]: # (    est commodo officia incididunt non in laborum officia esse elit ex. Proident aute proident veniam eu tempor)

[//]: # (    reprehenderit minim consectetur sit tempor reprehenderit culpa minim quis. Lorem incididunt minim irure labore anim.)

[//]: # (    Velit irure elit excepteur culpa aute qui aute ullamco est minim culpa eu eu.)

[//]: # (  </dna-tab>)

[//]: # (</dna-tabs>)

<div horizontal class="ds-tabs">
    <button class="ds-tab">Overview</button>
    <button class="ds-tab">Specs</button>
    <button class="ds-tab">Usage</button>
    <button class="ds-tab">Accessibility</button>
    <button class="ds-tab">Code</button>

[//]: # (  <div class="ds-tabs__container">)

[//]: # (    <div class="ds-tabs-wrapper">)
[//]: # (      <button class="ds-tab active">Overview</button>)

[//]: # (      <button class="ds-tab">Specs</button>)

[//]: # (      <button class="ds-tab">Usage</button>)

[//]: # (      <button class="ds-tab">Accessibility</button>)

[//]: # (      <button class="ds-tab">Code</button>)

[//]: # (    </div>)

[//]: # (    <div class="slider">)

[//]: # (      <div class="indicator"></div>)

[//]: # (    </div>)
[//]: # (  </div>)
  <div class="ds-tabs__tab-content-wrapper">

  <div class="ds-tabs__tab-content">

  [//]: # (<div class="ds-tabs__tab-container">)

<section>

[//]: # (  ## Overview)

[//]: # ()
[//]: # (<sl-button fill="default" size="sm">Default</sl-button>)

  <div class="ds-example">

    <sl-button fill="default" size="sm">Default</sl-button>

  </div>

  <div class="ds-code">

  ```html
  <sl-button fill="default" size="sm">Default</sl-button>
  ```

  </div>

  [//]: # (TODO: add button to copy code)

</section>

<section>

## Lorem ipsum dolor sit amet
Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

<div class=ds-do-dont>

  <div class="ds-success">

![Alt text example](/assets/images/rectangle.svg "light")
![Alt text example](/assets/images/rectangle-dark.svg "dark")

  <div class="ds-success__content">

### Do

Place text here

  </div>

  </div>


  <div class="ds-danger">

![Alt text example](/assets/images/rectangle.svg "light")
![Alt text example](/assets/images/rectangle-dark.svg "dark")

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
  
  <div class="ds-table">
  
  | name   | purpose | other element |
  |--------|---------|---------------|
  | first  | row     | element       |
  | second | row     | content       |
  | third  | example | row           |
  


  </div>
  
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

[//]: # (</div>)

[//]: # (<div vertical class="ds-tabs">)

[//]: # (  <div class="ds-tabs__container">)

[//]: # (    <div class="ds-tabs-wrapper">)

[//]: # (      <a href="#overview" class="ds-tab--vertical active">Overview</a>)

[//]: # (      <a href="#variants" class="ds-tab--vertical">Variants</a>)

[//]: # (      <a href="#key-points" class="ds-tab--vertical">Key Points</a>)

[//]: # (    </div>)

[//]: # (    <div class="slider">)

[//]: # (      <div class="indicator"></div>)

[//]: # (    </div>)

[//]: # (  </div>)

[//]: # ()
[//]: # ([//]: # &#40;  <div class="ds-tabs__tab-content-wrapper"></div>&#41;)
[//]: # (</div>)

  </div>

  <div class="ds-tabs__tab-content">

<section>

  ## Specs
  
  Lorem ipsum dolor sit amet
  Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
<section>

  ## Anatomy

Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
<section>

  ## Variants

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
  
  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
<section>

  ## Types

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.
</section>

<section>

  ## Behaviour

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.


</section>
  </div>

  <div class="ds-tabs__tab-content">

<section>

  ## Usage
  
  Lorem ipsum dolor sit amet
  Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
<section>
  
  ## How to use

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>
<section>

  ## Content

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.

</section>

  </div>

  <div class="ds-tabs__tab-content">

<section> 

  ## Accessibility

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.


</section>
<section>

  ## Interaction

  - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
  - Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.
  - Maecenas vitae mattis tellus. Nullam quis imperdiet augue, vestibulum auctor ornare leo.
  - Non suscipit magna interdum eu.

</section>
<section>

  ## Behaviour

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.


</section>
  
  </div>

  <div class="ds-tabs__tab-content">

<section>

  ## Code

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.


  SL DS components:
    <div class="ds-buttons-wrapper">
      <sl-button>Primary</sl-button>
      <sl-button disabled>Disabled</sl-button>
      <sl-button variant="secondary">Secondary</sl-button>
      <sl-button variant="secondary" disabled>Disabled</sl-button>
    </div>

</section>
<section>

  ## Properties

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.


</section>
<section>
  
  ## Tokens

  Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.


</section>  
  </div>

</div>
</div>


[//]: # (<div class="ds-tabs">)

[//]: # (<div class="ds-tabs__container">)

[//]: # (<div class="ds-tabs-wrapper">)

[//]: # (  <a href="#overview" class="ds-tab active">Overview</a>)

[//]: # (  <a href="#specs" class="ds-tab">Specs</a>)

[//]: # (  <a href="#usage" class="ds-tab">Usage</a>)

[//]: # (  <a href="#accessibility" class="ds-tab">Accessibility</a>)

[//]: # (  <a href="#code" class="ds-tab">Code</a>)

[//]: # (</div>)

[//]: # (<div class="slider">)

[//]: # (<div class="indicator"></div>)

[//]: # (</div>)

[//]: # (</div>)

[//]: # (<div class="ds-tabs__tab-content-wrapper">)

[//]: # (<div class="ds-tabs__tab-content ds-tabs__tab-content--active">)

[//]: # (tab 1)

[//]: # (</div>)

[//]: # (<div class="ds-tabs__tab-content">)

[//]: # (tab 2)

[//]: # (</div>)

[//]: # (<div class="ds-tabs__tab-content">)

[//]: # (</div>)

[//]: # (</div>)

[//]: # (</div>)



[//]: # (<div class="ds-tabs-wrapper">)

[//]: # (  <a id="overview" class="ds-tab active">Overview</a>)

[//]: # (  <a id="specs" class="ds-tab">Specs</a>)

[//]: # (  <a id="usage" class="ds-tab">Usage</a>)

[//]: # (  <a id="accessibility" class="ds-tab">Accessibility</a>)

[//]: # (  <a id="code" class="ds-tab">Code</a>)

[//]: # (</div>)

[//]: # (<div id="overview" class="ds-tab-content">)

[//]: # (  <h3>London</h3>)

[//]: # (  <p>London is the capital city of England.</p>)

[//]: # (test)

[//]: # (</div>)


[//]: # (////////////////////////////////////////////////////////////////////////)

[//]: # (## Overview)

[//]: # ()
[//]: # (Button component overview)

[//]: # ()
[//]: # (### Key Points)

[//]: # ()
[//]: # (### Live demo)

[//]: # ()
[//]: # (### Resources)

[//]: # (## Specs)

[//]: # ()
[//]: # (Lorem ipsum dolor sit amet)

[//]: # (Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.)

[//]: # ()
[//]: # (### Anatomy)

[//]: # ()
[//]: # (### Variants)

[//]: # ()
[//]: # (### Types)

[//]: # ()
[//]: # (### Behaviour)

[//]: # (## Usage)

[//]: # ()
[//]: # (Lorem ipsum dolor sit amet)

[//]: # (Consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.)


[//]: # (## Accessibility)

[//]: # ()
[//]: # (WCAG part)

[//]: # (## Code)

[//]: # ()
[//]: # (SL DS components:)

[//]: # (<div class="ds-buttons-wrapper">)

[//]: # (  <sl-button>Primary</sl-button>)

[//]: # (  <sl-button disabled>Disabled</sl-button>)

[//]: # (  <sl-button variant="secondary">Secondary</sl-button>)

[//]: # (  <sl-button variant="secondary" disabled>Disabled</sl-button>)

[//]: # (</div>)


[//]: # (<div vertical class="ds-tabs">)

[//]: # (  <div class="ds-tabs__container">)

[//]: # (    <div class="ds-tabs-wrapper">)

[//]: # (      <button class="ds-tab active">Overview</button>)

[//]: # (      <button class="ds-tab">Specs</button>)

[//]: # (      <button class="ds-tab">Usage</button>)

[//]: # (      <button class="ds-tab">Accessibility</button>)

[//]: # (      <button class="ds-tab">Code</button>)

[//]: # (    </div>)

[//]: # (    <div class="slider">)

[//]: # (      <div class="indicator"></div>)

[//]: # (    </div>)

[//]: # (  </div>)

[//]: # (  <div class="ds-tabs__tab-content-wrapper"></div>)

[//]: # (</div>)