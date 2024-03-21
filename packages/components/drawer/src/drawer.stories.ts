import '@sl-design-system/button/register.js';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Drawer } from './drawer.js';

export default {
  title: 'Components/Drawer',
  args: {
    attachment: 'right',
    buttonSize: 'sm'
  },
  argTypes: {
    attachment: {
      control: 'radio',
      options: ['right', 'left', 'top', 'bottom']
    },
    buttonSize: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    }
  }
};

const onClick = (event: Event & { target: HTMLElement }): void => {
  (event.target.nextElementSibling as Drawer).showModal();
};

export const API: StoryObj = {
  render: ({ attachment, buttonSize }) => html`
    <sl-button @click=${onClick}>Show Drawer</sl-button>
    <sl-drawer .attachment=${attachment} .closeButtonSize=${buttonSize}>
      <h2 slot="title">In this sidepanel you can find a lot of info</h2>
      <p>
        Apple pie chocolate jelly-o carrot cake gummi bears halvah cake cheesecake. Sesame snaps macaroon shortbread
        cheesecake muffin soufflé. Powder croissant sugar plum candy canes cupcake chupa chups cake marzipan. Chocolate
        bar pie jujubes chocolate powder jelly. Marshmallow biscuit bear claw cookie topping. Tart sugar plum toffee
        gingerbread macaroon danish brownie. Candy canes dragée sesame snaps lollipop ice cream.
      </p>
    </sl-drawer>
  `
};

export const DisableClose: StoryObj = {
  render: () => html`
    <sl-button @click=${onClick}>Show Drawer</sl-button>
    <sl-drawer disable-close>
      <span slot="title" id="title">Drawer title</span>
      <p>
        Jelly beans macaroon bonbon chocolate cake jelly beans chocolate lollipop cake. Wafer bonbon powder toffee pie.
        Shortbread sweet dessert tiramisu danish jelly-o wafer. Brownie lemon drops cake lollipop tart candy cookie
        gummies chocolate. Cupcake gummies sesame snaps topping gummi bears. Croissant danish marshmallow macaroon
        fruitcake.
      </p>
    </sl-drawer>
  `
};

export const CompleteHeader: StoryObj = {
  render: ({ attachment, buttonSize }) => html`
    <sl-button @click=${onClick}>Show Drawer</sl-button>
    <sl-drawer .attachment=${attachment} .closeButtonSize=${buttonSize}>
      <h1 slot="title">Test title</h1>
      <sl-button slot="actions">download</sl-button>
      <p>
        Macaroon caramels tootsie roll cookie liquorice cake gingerbread cookie. Toffee fruitcake macaroon cheesecake
        muffin gingerbread apple pie. Donut powder lollipop macaroon jelly-o. Powder powder tiramisu brownie jelly
        macaroon jelly ice cream. Cake macaroon pudding cookie cookie powder macaroon. Sesame snaps cheesecake jujubes
        tootsie roll macaroon oat cake jujubes cotton candy. Chocolate chocolate cake tart fruitcake sugar plum. Lemon
        drops dessert pastry jujubes bonbon fruitcake muffin. Candy canes wafer brownie chocolate cake macaroon
        cheesecake.
      </p>
    </sl-drawer>
  `
};
