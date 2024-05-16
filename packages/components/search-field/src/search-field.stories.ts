import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type SearchField } from './search-field.js';

type Props = Pick<SearchField, 'inputSize' | 'placeholder' | 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Search field',
  tags: ['draft'],
  args: {
    placeholder: '',
    value: ''
  },
  render: ({ inputSize, placeholder, value }) => {
    return html`
      <sl-search-field .inputSize=${inputSize} .placeholder=${placeholder} .value=${value}></sl-search-field>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    placeholder: 'Search'
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: 'Lorem'
  }
};
