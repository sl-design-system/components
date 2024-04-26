---
title: Accordion usage
layout: "categories/components/components.njk"
tags: usage
eleventyNavigation:
  parent: Accordion
  key: AccordionUsage
---
<section>
<div class="ds-example">

<sl-accordion style="inline-size: 50rem;">
  <sl-accordion-item summary="Discovering Dinosaurs: A Prehistoric Adventure">
    Embark on a thrilling journey back in time to the age of dinosaurs! Unearth fossils, learn about different
    species, and imagine what life was like when these colossal creatures roamed the Earth. From the mighty
    Tyrannosaurus rex to the gentle Brachiosaurus, this adventure will ignite your curiosity about our planet’s
    ancient past. Dig deep into the layers of history as you explore ancient landscapes, where once the ground
    trembled under the footsteps of massive sauropods. Feel the rush of adrenaline as you encounter the
    razor-sharp teeth of a Velociraptor, preserved in stone for millions of years.
  </sl-accordion-item>
  <sl-accordion-item summary="Geography Safari: Mapping Our World">
    Grab your compass and explore the globe! Discover continents, oceans, mountains, and rainforests. Study maps,
    learn about diverse cultures, and understand the impact of geography on our lives. From the Great Wall of
    China to the Amazon River, every place has a story. Let’s embark on a safari of knowledge! Navigate the vast
    expanse of Earth’s seven continents, each with its unique landscapes, people, and history. Dive into the azure
    depths of the Pacific Ocean, where mysterious creatures and hidden treasures await discovery.
  </sl-accordion-item>
  <sl-accordion-item summary="Journey Through Ancient Civilizations">
    Pack your virtual bags and travel through time to ancient Egypt, Greece, Rome, and beyond. Explore majestic
    pyramids, decode hieroglyphics, meet philosophers, and witness epic battles. Learn about the ingenious
    inventions, rich cultures, and captivating myths that shaped human history. Your passport to the past awaits!
    Step into the shadow of the Great Sphinx, its enigmatic gaze guarding secrets buried in the sands of the Nile.
    Sail the cerulean Aegean Sea, where the winds carry echoes of Odysseus’s legendary odyssey. Stand in the
    grandeur of the Colosseum, where gladiators clashed and emperors reveled in blood-soaked spectacles. Marvel at
    the Hanging Gardens of Babylon, a verdant oasis rising amidst the arid Mesopotamian plains.
  </sl-accordion-item>
  <sl-accordion-item summary="Math Magic - solving Puzzles with numbers">
    Get ready to unlock the secrets of numbers! Dive into mathematical puzzles, brainteasers, and mind-bending
    riddles. Whether you’re deciphering patterns, calculating probabilities, or exploring geometric shapes, math
    becomes an enchanting adventure. Discover how math is not just about equations—it’s a magical language that
    shapes our world. Decipher Patterns: Unravel intricate sequences and hidden symmetries. From Fibonacci spirals
    to geometric progressions, every pattern holds a clue waiting to be revealed. Calculate Probabilities: Peek
    behind the curtain of chance. Explore dice rolls, card games, and probability puzzles.
  </sl-accordion-item>
</sl-accordion>

</div>

<div class="ds-code">

  ```html
<sl-accordion>
    <sl-accordion-item summary="Discovering Dinosaurs: A Prehistoric Adventure">
      Embark on a thrilling journey back in time to the age of dinosaurs...
    </sl-accordion-item>
    <sl-accordion-item summary="Geography Safari: Mapping Our World">
      ...
    </sl-accordion-item>
    <sl-accordion-item summary="Journey Through Ancient Civilizations">
      ...
    </sl-accordion-item>
    <sl-accordion-item summary="Math Magic - solving Puzzles with numbers">
      ...
    </sl-accordion-item>
</sl-accordion>
  ```

</div>
</section>

<section>

## When to use

### Chunking information and reducing clutter
Reduce cognitive load for users by simplifying the interface. When you have a large amount of content, consider using accordions to hide non-essential information initially. Place detailed content within the accordion panel. Users can press on the accordion title to reveal the hidden information.

</section>

<section>

## When not to use

### When most items need to be opened
If users need to open the majority of accordion items, it’s better to reveal all the content instead of hiding some.
Accordion components are designed to manage content visibility efficiently. If most items need to be expanded, consider alternative designs that display content upfront.

</section>

<section>

## Anatomy

<div class="ds-table-wrapper">

|Item|Name| Description | Optional|
|-|-|-|-|
|1|Header	|Contains the section title and is control for revealing the panel.|No|
|2|Icon	|Indicates if the panel is open or closed.|No|
|3|Panel	|The section of content associated with an accordion header.|No|

{.ds-table}

</div>

</section>

<section>

## Options

With these options, you can tweak the appearance of the accordion in Figma. They are available in the Design Panel so you can compose the accordion to exactly fit the user experience need for the use case you are working on.

<div class="ds-table-wrapper">

|Item|Options|Description|
|-|-|-|
|Accordion open|`all closed` `01` `02` `03` `04` `05` `06` `07` `08` `09` `10` `all open`|Determines which panel is open.|
|Edit mode|`boolean`|Displays slot components for inserting the content of all panels. |
|Show up (up to 01 including 10)|`boolean`|Determines if the item is visible. |
|State (for every visible panel)|`default` `hover` `active` `disabled`|Determines the state of the item.|
|Title (for every visible panel)|`value`|Displays the title of the item.|

{.ds-table}
</div>

</section>
