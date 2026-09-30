import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Importing the component registers `sl-login-form` globally (guarded) as a side effect; its
// internal `sl-form`/`sl-select`/etc. children are registered in its own scoped registry.
import { type LoginForm, type LoginFormModel } from './login-form.js';

type Props = Pick<LoginForm, 'disabled' | 'model'>;
type Story = StoryObj<Props>;

// In a real app this would come from an API call made by the page that owns this component.
const model: LoginFormModel = {
  locations: [
    { id: 'belgium', name: 'Belgium' },
    { id: 'netherlands', name: 'Netherlands' },
    { id: 'sweden', name: 'Sweden' },
    { id: 'finland', name: 'Finland' }
  ],
  selectedLocationId: 'belgium'
};

export default {
  title: 'Examples/Login form',
  args: {
    disabled: false,
    model
  },
  render: ({ disabled, model }) => html`
    <sl-login-form ?disabled=${disabled} .model=${model}></sl-login-form>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};
