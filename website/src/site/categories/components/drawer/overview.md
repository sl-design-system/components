---
title: Drawer
tags: overview
eleventyNavigation:
  parent: Drawer
  key: DrawerOverview
---
<section>

<div class="ds-example">
<sl-button id="show-button" fill="outline" variant="primary">Show Drawer</sl-button>
<sl-drawer id="drawer-example" attachment="right" closeButtonSize="md"><h2 slot="title">In this sidepanel you can find a lot of info</h2>
Apple pie chocolate jelly-o carrot cake gummi bears halvah cake cheesecake. Sesame snaps macaroon shortbread
cheesecake muffin soufflé. Powder croissant sugar plum candy canes cupcake chupa chups cake marzipan. Chocolate
bar pie jujubes chocolate powder jelly. Marshmallow biscuit bear claw cookie topping. Tart sugar plum toffee
gingerbread macaroon danish brownie. Candy canes dragée sesame snaps lollipop ice cream.
</sl-drawer>

</div>

<div class="ds-code">

```html
<sl-button id="show-button" fill="outline" variant="primary">Show Drawer</sl-button>

<sl-drawer id="drawer-example" attachment="right" closeButtonSize="sm">
        <h2 slot="title">In this sidepanel you can find a lot of info</h2>
        Apple pie chocolate jelly-o carrot cake gummi bears halvah cake cheesecake. Sesame snaps macaroon shortbread
        cheesecake muffin soufflé. Powder croissant sugar plum candy canes cupcake chupa chups cake marzipan. Chocolate
        bar pie jujubes chocolate powder jelly. Marshmallow biscuit bear claw cookie topping. Tart sugar plum toffee
        gingerbread macaroon danish brownie. Candy canes dragée sesame snaps lollipop ice cream.
</sl-drawer>

<script>
  const showBtn = document.querySelector("#show-button");
  const drawerExample = document.querySelector("#drawer-example");


  showBtn.addEventListener("click", () => {
    if (drawerExample) {
      drawerExample.showModal();
    }
  })
</script>
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

## Key Points
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

<script>

const showBtn = document.querySelector("#show-button");
const drawerExample = document.querySelector("#drawer-example");


showBtn.addEventListener("click", () => {
    if (drawerExample) {
      drawerExample.showModal();
    }
  })

</script>