import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Tree } from './tree.js';

type Props = Pick<Tree, 'selects'> & { items?(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'In progress/Tree',
  argTypes: {
    items: {
      table: { disable: true }
    },
    selects: {
      control: {
        type: 'inline-radio',
        options: ['single', 'multiple']
      }
    }
  },
  render: ({ items, selects }) => html`<sl-tree .selects=${selects}>${items?.()}</sl-tree>`
} satisfies Meta<Props>;

export const Basic: Story = {};
