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
        <sl-accordion-item summary="Example summary" open>test content</sl-accordion-item>
        <sl-accordion-item summary="Example summary 2">test content 2</sl-accordion-item>
        <sl-accordion-item summary="Example summary 3">test content of the third element</sl-accordion-item>
        <sl-accordion-item summary="Example summary 4" disabled>test content of the 4 element</sl-accordion-item>
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
        <sl-accordion-item summary="Example summary" open>
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
        <sl-accordion-item summary="Example summary 2">
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
        <sl-accordion-item summary="Example summary 3">test content of the third element</sl-accordion-item>
        <sl-accordion-item summary="Example summary 4" disabled>test content of the 4 element</sl-accordion-item>
        <sl-accordion-item summary="Example summary 5">
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
        <sl-accordion-item summary="Example summary 6">
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
