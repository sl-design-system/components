import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Scrollbar } from './scrollbar';

type Props = Pick<Scrollbar, 'vertical'> & { scrolled?: number };
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Scrollbar',
  tags: ['draft'],
  args: {
    vertical: false
  },
  render: ({ scrolled, vertical }) => {
    if (typeof scrolled === 'number') {
      setTimeout(() => {
        const scroller = document.querySelector('#scroller') as HTMLElement;

        scroller.scrollTo({ [vertical ? 'top' : 'left']: scrolled });
      });
    }

    return html`
      <style>
        #scroller {
          block-size: 100px;
          overflow: auto;
          scrollbar-width: none;
        }
        .scrolling {
          background: linear-gradient(to ${vertical ? 'bottom' : 'right'}, red, blue);
          block-size: 100px;
          inline-size: 400dvw;
        }
      </style>
      <div id="scroller">
        <div class="scrolling"></div>
      </div>
      <sl-scrollbar ?vertical=${vertical} scroller="scroller"></sl-scrollbar>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const ScrollTo: Story = {
  args: {
    scrolled: 400
  }
};

export const Vertical: Story = {
  args: {
    vertical: true
  }
};
