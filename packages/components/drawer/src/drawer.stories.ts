import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Drawer } from './drawer.js';

type Props = Pick<Drawer, 'attachment'> & { styles?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Drawer',
  tags: ['draft'],
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  argTypes: {
    attachment: {
      control: 'inline-radio',
      options: ['right', 'left', 'top', 'bottom']
    },
    styles: {
      table: { disable: true }
    }
  },
  render: ({ attachment, styles }) => {
    const onClick = (event: Event & { target: HTMLElement }) => {
      (event.target.nextElementSibling as Drawer).toggle();
    };

    return html`
      <style>
        ${styles ??
        `
          sl-drawer::part(content) {
            @media (width > 600px) {
              inline-size: 60dvw;
            }
            @media (width > 1024px) {
              inline-size: 300px;
            }
          }
          `}
      </style>
      <sl-button @click=${onClick}>Show Drawer</sl-button>
      <sl-drawer attachment=${ifDefined(attachment)}>
        <h2 slot="title">In this side panel you can find a lot of info</h2>
        <p>
          Apple pie chocolate jelly-o carrot cake gummi bears halvah cake cheesecake. Sesame snaps macaroon shortbread
          cheesecake muffin soufflé. Powder croissant sugar plum candy canes cupcake chupa chups cake marzipan.
          Chocolate bar pie jujubes chocolate powder jelly. Marshmallow biscuit bear claw cookie topping. Tart sugar
          plum toffee gingerbread macaroon danish brownie. Candy canes dragée sesame snaps lollipop ice cream.
        </p>
      </sl-drawer>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone6'
    }
  }
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
      defaultOrientation: 'landscape'
    }
  }
};
