import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { html } from 'lit';
import '../register.js';

export default {
  title: 'Accordion'
};

export const API: StoryObj = {
  args: {
    single: false,
    bodyContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem. Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna, viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum nibh lacus.
    Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis, eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In pellentesque velit at sagittis mattis. Nam ut tellus elit. Proin luctus lectus velit, ut ultricies libero blandit blandit. Aenean molestie est ipsum, in dictum turpis dictum nec. Curabitur eu convallis quam. Proin efficitur velit nec quam ornare, id volutpat ex ornare. Vestibulum porttitor lobortis lacus, eu efficitur libero congue nec. Maecenas volutpat massa non nulla venenatis, aliquet gravida lectus aliquam. Pellentesque aliquam blandit condimentum. Phasellus non justo odio. Phasellus a dui posuere, dapibus risus tempus, laoreet augue. Sed tincidunt, lorem a placerat aliquet, nisi erat lobortis orci, in aliquet mi ante nec nisi. Pellentesque porttitor elit sem, nec scelerisque arcu suscipit eu.`
  },
  render: ({ single }) => {
    return html`
      <sl-accordion ?single=${single}>
        <sl-accordion-item summary="Discovering Dinosaurs: A Prehistoric Adventure" open>
          Embark on a thrilling journey back in time to the age of dinosaurs! Unearth fossils, learn about different
          species, and imagine what life was like when these colossal creatures roamed the Earth. From the mighty
          Tyrannosaurus rex to the gentle Brachiosaurus, this adventure will ignite your curiosity about our planet’s
          ancient past.
        </sl-accordion-item>
        <sl-accordion-item summary="Geography Safari: Mapping Our World">
          Grab your compass and explore the globe! Discover continents, oceans, mountains, and rainforests. Study maps,
          learn about diverse cultures, and understand the impact of geography on our lives. From the Great Wall of
          China to the Amazon River, every place has a story. Let’s embark on a safari of knowledge!
        </sl-accordion-item>
        <sl-accordion-item summary="Journey Through Ancient Civilizations">
          Pack your virtual bags and travel through time to ancient Egypt, Greece, Rome, and beyond. Explore majestic
          pyramids, decode hieroglyphics, meet philosophers, and witness epic battles. Learn about the ingenious
          inventions, rich cultures, and captivating myths that shaped human history. Your passport to the past awaits!
        </sl-accordion-item>
        <sl-accordion-item summary="Math Magic - solving Puzzles with numbers">
          Get ready to unlock the secrets of numbers! Dive into mathematical puzzles, brainteasers, and mind-bending
          riddles. Whether you’re deciphering patterns, calculating probabilities, or exploring geometric shapes, math
          becomes an enchanting adventure. Discover how math is not just about equations—it’s a magical language that
          shapes our world.
        </sl-accordion-item>
        <sl-accordion-item summary="Space Odyssey: Exploring Planets and Stars" disabled>
          Buckle up for a cosmic adventure! Blast off into the universe and explore distant planets, swirling galaxies,
          and sparkling constellations. Learn about astronauts, black holes, and the mysteries of dark matter. Whether
          you dream of being an astronaut or simply love stargazing, the cosmos awaits your curiosity.
        </sl-accordion-item>
      </sl-accordion>
    `;
  }
};

// TODO: add sticky example

export const Sticky: StoryObj = {
  args: {
    single: false
  },
  render: ({ single }) => {
    return html`
      <style>
        ::part(summary) {
          position: sticky;
          top: 0;
        }
      </style>
      <sl-accordion ?single=${single}>
        <sl-accordion-item summary="Journey Through Ancient Civilizations">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia
          rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec
          libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem.
          Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna,
          viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc
          quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut
          molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum
          nibh lacus. Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis,
          eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In
          pellentesque velit at sagittis mattis.
        </sl-accordion-item>
        <sl-accordion-item summary="Creative Writing Adventures - Crafting Stories and Poems">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia
          rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec
          libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem.
          Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna,
          viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc
          quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut
          molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum
          nibh lacus. Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis,
          eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In
          pellentesque velit at sagittis mattis. Nam ut tellus elit. Proin luctus lectus velit, ut ultricies libero
          blandit blandit. Aenean molestie est ipsum, in dictum turpis dictum nec. Curabitur eu convallis quam. Proin
          efficitur velit nec quam ornare, id volutpat ex ornare. Vestibulum porttitor lobortis lacus, eu efficitur
          libero congue nec. Maecenas volutpat massa non nulla venenatis, aliquet gravida lectus aliquam. Pellentesque
          aliquam blandit condimentum. Phasellus non justo odio. Phasellus a dui posuere, dapibus risus tempus, laoreet
          augue. Sed tincidunt, lorem a placerat aliquet, nisi erat lobortis orci, in aliquet mi ante nec nisi.
          Pellentesque porttitor elit sem, nec scelerisque arcu suscipit eu.
        </sl-accordion-item>
        <sl-accordion-item summary="Art Quest: Painting, Drawing, and Sculpting"
          >test content of the third element</sl-accordion-item
        >
        <sl-accordion-item summary="History Detectives: Solving Historical Riddles" disabled
          >test content of the 4 element</sl-accordion-item
        >
        <sl-accordion-item summary="Music Marvels: Playing Instruments and Composing Tunes">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia
          rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec
          libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem.
          Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna,
          viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc
          quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut
          molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum
          nibh lacus. Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis,
          eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In
          pellentesque velit at sagittis mattis. Nam ut tellus elit. Proin luctus lectus velit, ut ultricies libero
          blandit blandit. Aenean molestie est ipsum, in dictum turpis dictum nec. Curabitur eu convallis quam. Proin
          efficitur velit nec quam ornare, id volutpat ex ornare. Vestibulum porttitor lobortis lacus, eu efficitur
          libero congue nec. Maecenas volutpat massa non nulla venenatis, aliquet gravida lectus aliquam. Pellentesque
          aliquam blandit condimentum. Phasellus non justo odio. Phasellus a dui posuere, dapibus risus tempus, laoreet
          augue. Sed tincidunt, lorem a placerat aliquet, nisi erat lobortis orci, in aliquet mi ante nec nisi.
          Pellentesque porttitor elit sem, nec scelerisque arcu suscipit eu.
        </sl-accordion-item>
        <sl-accordion-item summary="Geography Safari: Mapping Our World">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac augue neque. Nunc sed ex ut neque lacinia
          rutrum nec vitae mi. Donec dictum urna elit, et feugiat nunc fringilla nec. Maecenas nisi lorem, facilisis nec
          libero ut, hendrerit ultricies orci. Vivamus massa ligula, ultricies quis odio a, scelerisque tincidunt lorem.
          Morbi quis pulvinar augue. Nunc eros magna, laoreet vitae ornare at, iaculis quis diam. Duis odio urna,
          viverra ut ex mattis, egestas tincidunt enim. Praesent ac ex tincidunt, hendrerit sem et, aliquam metus. Nunc
          quis nisi nulla. Sed nibh ante, posuere eu volutpat vitae, elementum ut leo. Ut aliquet tincidunt tellus, ut
          molestie urna ultrices in. Suspendisse potenti. Nunc non nunc eu nibh venenatis vestibulum. Maecenas rutrum
          nibh lacus. Fusce sodales purus ut arcu hendrerit, non interdum nulla suscipit. Duis vitae felis facilisis,
          eleifend ipsum ut, condimentum est. Nullam metus massa, venenatis vitae suscipit in, feugiat quis turpis. In
          pellentesque velit at sagittis mattis. Nam ut tellus elit. Proin luctus lectus velit, ut ultricies libero
          blandit blandit. Aenean molestie est ipsum, in dictum turpis dictum nec. Curabitur eu convallis quam. Proin
          efficitur velit nec quam ornare, id volutpat ex ornare. Vestibulum porttitor lobortis lacus, eu efficitur
          libero congue nec. Maecenas volutpat massa non nulla venenatis, aliquet gravida lectus aliquam. Pellentesque
          aliquam blandit condimentum. Phasellus non justo odio. Phasellus a dui posuere, dapibus risus tempus, laoreet
          augue. Sed tincidunt, lorem a placerat aliquet, nisi erat lobortis orci, in aliquet mi ante nec nisi.
          Pellentesque porttitor elit sem, nec scelerisque arcu suscipit eu.
        </sl-accordion-item>
      </sl-accordion>
    `;
  }
};
