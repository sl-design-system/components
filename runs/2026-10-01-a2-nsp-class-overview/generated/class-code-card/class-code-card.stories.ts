import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-a2-class-code-card` actually registers - a type-only import
// would be erased at transform time and the element would never be defined.
import './class-code-card.js';
import { type ClassCodeCard } from './class-code-card.js';

type Props = Pick<ClassCodeCard, 'code'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A2 NSP Class Overview/Class code card',
  args: { code: 'D9981' },
  argTypes: {
    code: { control: 'text' }
  },
  render: ({ code }) => html`<sl-a2-class-code-card code=${code}></sl-a2-class-code-card>`
} satisfies Meta<Props>;

export const Basic: Story = {};
