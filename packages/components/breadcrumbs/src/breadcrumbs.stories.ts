import type { Breadcrumbs } from './breadcrumbs.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';

type Props = Pick<Breadcrumbs, 'noHome'> & { breadcrumbs: TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Breadcrumbs',
  args: {
    noHome: false
  },
  render: ({ breadcrumbs, noHome }) => html`<sl-breadcrumbs .noHome=${noHome}>${breadcrumbs}</sl-breadcrumbs>`
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    breadcrumbs: html`
      <a href="javascript:void">Lorem</a>
      <a href="javascript:void">Ipsum</a>
      <span>Dolar</span>
    `
  }
};
