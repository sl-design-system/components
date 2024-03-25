---
title: Accordion code
layout: "components/components.njk"
tags: code
APIdescription: Component has a range of properties to define the experience in different use cases.
eleventyNavigation:
  parent: Accordion
  key: AccordionCode
---
<section>
<div class="ds-example">

<sl-accordion single style="inline-size: 50rem;">
  <sl-accordion-item summary="Discovering Dinosaurs: A Prehistoric Adventure">
    Embark on a thrilling journey back in time to the age of dinosaurs! Unearth fossils, learn about different
    species, and imagine what life was like when these colossal creatures roamed the Earth. From the mighty
    Tyrannosaurus rex to the gentle Brachiosaurus, this adventure will ignite your curiosity about our planet’s
    ancient past. Dig deep into the layers of history as you explore ancient landscapes, where once the ground
    trembled under the footsteps of massive sauropods. Feel the rush of adrenaline as you encounter the
    razor-sharp teeth of a Velociraptor, preserved in stone for millions of years. Discover the secrets of the
    skies with the Pteranodon, a winged reptile that soared above prehistoric oceans. Piece together the puzzle of
    evolution, observing how these remarkable creatures adapted to their environments over eons. Listen to the
    echoes of the past as you stand amidst towering ferns and cycads, imagining the rustle of dinosaur tails
    passing by. Witness the battle-scarred Triceratops, its frilled head adorned with formidable horns, a
    testament to survival in a harsh world. Feel the ground shake as the mighty Stegosaurus lumbers past, its
    plated back a fortress against predators. Explore, learn, and immerse yourself in the wonders of the Mesozoic
    era — Discovering Dinosaurs: A Prehistoric Adventure awaits! 🌎🦕🌿
  </sl-accordion-item>
  <sl-accordion-item summary="Geography Safari: Mapping Our World">
    Grab your compass and explore the globe! Discover continents, oceans, mountains, and rainforests. Study maps,
    learn about diverse cultures, and understand the impact of geography on our lives. From the Great Wall of
    China to the Amazon River, every place has a story. Let’s embark on a safari of knowledge! Navigate the vast
    expanse of Earth’s seven continents, each with its unique landscapes, people, and history. Dive into the azure
    depths of the Pacific Ocean, where mysterious creatures and hidden treasures await discovery. Scale the rugged
    peaks of the Himalayas, feeling the thin air and marveling at the world’s highest summits. Venture into the
    lush green heart of the Amazon rainforest, where biodiversity thrives in a symphony of life. Trace the ancient
    trade routes along the Silk Road, connecting civilizations and shaping cultural exchange. Stand on the edge of
    the Grand Canyon, a testament to the power of erosion and the passage of time. Explore the vibrant markets of
    Marrakech, where spices, textiles, and stories intertwine. Witness the dance of the Northern Lights in the
    Arctic Circle, a celestial spectacle that defies explanation. Marvel at the engineering marvel of the Panama
    Canal, bridging oceans and reshaping global commerce. As you journey through landscapes both familiar and
    foreign, remember that every place on our planet holds a piece of humanity’s shared narrative. Pack your
    curiosity, unfold your map, and let the Geography Safari begin! 🌎🌿🌍
  </sl-accordion-item>
  <sl-accordion-item summary="Journey Through Ancient Civilizations" disabled>
    Pack your virtual bags and travel through time to ancient Egypt, Greece, Rome, and beyond. Explore majestic
    pyramids, decode hieroglyphics, meet philosophers, and witness epic battles. Learn about the ingenious
    inventions, rich cultures, and captivating myths that shaped human history. Your passport to the past awaits!
    Step into the shadow of the Great Sphinx, its enigmatic gaze guarding secrets buried in the sands of the Nile.
    Sail the cerulean Aegean Sea, where the winds carry echoes of Odysseus’s legendary odyssey. Stand in the
    grandeur of the Colosseum, where gladiators clashed and emperors reveled in blood-soaked spectacles. Marvel at
    the Hanging Gardens of Babylon, a verdant oasis rising amidst the arid Mesopotamian plains. Listen to the
    whispers of the Oracle of Delphi, her cryptic prophecies shaping the fate of kingdoms. Trace the Silk Road,
    where silk, spices, and ideas flowed between East and West, connecting distant lands. Study the mathematical
    brilliance of Pythagoras, unraveling geometric truths that transcend time. Witness the Library of Alexandria,
    a beacon of knowledge that burned bright before fading into legend. Explore the terracotta army of Qin Shi
    Huang, silent sentinels guarding the emperor’s tomb. As you journey through the annals of antiquity, remember
    that every stone, every artifact, carries whispers of humanity’s enduring quest for meaning. Unearth the past,
    unravel mysteries, and embark on your epic adventure— Journey Through Ancient Civilizations awaits! 🌍🏛️🔍
  </sl-accordion-item>
  <sl-accordion-item summary="Math Magic - solving Puzzles with numbers">
    Get ready to unlock the secrets of numbers! Dive into mathematical puzzles, brainteasers, and mind-bending
    riddles. Whether you’re deciphering patterns, calculating probabilities, or exploring geometric shapes, math
    becomes an enchanting adventure. Discover how math is not just about equations—it’s a magical language that
    shapes our world. Decipher Patterns: Unravel intricate sequences and hidden symmetries. From Fibonacci spirals
    to geometric progressions, every pattern holds a clue waiting to be revealed. Calculate Probabilities: Peek
    behind the curtain of chance. Explore dice rolls, card games, and probability puzzles. The magic lies in
    understanding randomness and predicting outcomes. Explore Geometric Shapes: Wander through the corridors of
    geometry. Triangles, circles, and polygons become portals to a world where angles dance, and symmetry weaves
    its spell. Beyond Equations: Math transcends mere equations. It’s a magical language that shapes our world.
    From fractals to prime numbers, each concept whispers secrets waiting to be heard. Unravel the Cryptic
    Sequences: Within the folds of numbers lie hidden patterns waiting to be deciphered. Whether it’s the
    Fibonacci sequence gracefully spiraling or the rhythmic beat of a geometric progression, each sequence
    whispers its secrets. Chance and Probability: Imagine rolling dice in a cosmic game. Probability dances in the
    shadows, revealing the unexpected. As cards shuffle and coins flip, we explore the delicate balance between
    randomness and predictability. Geometry’s Spell: Step into the kaleidoscope of shapes. Triangles, circles, and
    polygons become our guides.
  </sl-accordion-item>
</sl-accordion>

</div>

<div class="ds-code">

  ```html
<sl-accordion single>
    <sl-accordion-item summary="Discovering Dinosaurs: A Prehistoric Adventure">
      Embark on a thrilling journey back in time to the age of dinosaurs...
    </sl-accordion-item>
    <sl-accordion-item summary="Geography Safari: Mapping Our World">
      ...
    </sl-accordion-item>
    <sl-accordion-item summary="Journey Through Ancient Civilizations" disabled>
      ...
    </sl-accordion-item>
    <sl-accordion-item summary="Math Magic - solving Puzzles with numbers">
      ...
    </sl-accordion-item>
</sl-accordion>
  ```

</div>
</section>  
<ds-install-info link-in-navigation package="accordion"></ds-install-info>
{% include "../component-table.njk" %}
