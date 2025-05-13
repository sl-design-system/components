import '@sl-design-system/button/register.js';
import '@sl-design-system/popover/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Breadcrumbs } from './breadcrumbs.js';

type Props = Pick<Breadcrumbs, 'inverted' | 'homeUrl' | 'noHome'> & { breadcrumbs(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Breadcrumbs',
  tags: ['stable'],
  args: {
    inverted: false,
    homeUrl: '/',
    noHome: false
  },
  argTypes: {
    breadcrumbs: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  render: ({ breadcrumbs, inverted, homeUrl, noHome }) => html`
    <style>
      sl-breadcrumbs[inverted] {
        background: var(--sl-color-palette-grey-900);
      }
      #storybook-root {
        max-width: calc(100vw - 2rem);
      }
    </style>
    <sl-breadcrumbs .homeUrl=${homeUrl} ?inverted=${inverted} ?no-home=${noHome}>${breadcrumbs()}</sl-breadcrumbs>
  `
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    breadcrumbs: () => html`
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    `
  }
};

export const Collapse: Story = {
  args: {
    breadcrumbs: () => html`
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
      <a href="javascript:void(0)">Sit</a>
      <a href="javascript:void(0)">Amet</a>
      <a href="javascript:void(0)">Foo</a>
      <a href="javascript:void(0)">Bar</a>
    `
  }
};

export const HomeUrl: Story = {
  args: {
    ...Basic.args,
    homeUrl: 'https://example.com'
  }
};

export const Inverted: Story = {
  parameters: {
    backgrounds: {
      default: 'Inverted'
    }
  },
  args: {
    ...Basic.args,
    inverted: true
  }
};

export const Mobile: Story = {
  ...Basic,
  parameters: {
    viewport: {
      defaultViewport: 'iphone13'
    }
  }
};

export const NoHome: Story = {
  args: {
    ...Basic.args,
    noHome: true
  }
};

export const Overflow: Story = {
  args: {
    breadcrumbs: () => html`
      <a href="javascript:void(0)">Adipisicing sint excepteur officia voluptate tempor ea veniam veniam duis.</a>
      <a href="javascript:void(0)"
        >Nostrud ad fugiat amet officia anim qui sit tempor veniam magna irure adipisicing ea adipisicing.</a
      >
      <a href="javascript:void(0)"
        >Lorem adipisicing do duis sunt laboris magna officia irure fugiat velit deserunt duis enim in.</a
      >
    `
  }
};

export const All: Story = {
  render: () => html`
    <style>
      sl-breadcrumbs[inverted] {
        background: var(--sl-color-palette-grey-900);
      }
      #storybook-root {
        max-width: calc(100vw - 2rem);
      }
    </style>
    <sl-breadcrumbs aria-label="Breadcrumb trail 1" no-home>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    </sl-breadcrumbs>
    <sl-breadcrumbs aria-label="Breadcrumb trail 2">
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    </sl-breadcrumbs>
    <sl-breadcrumbs aria-label="Breadcrumb trail 3">
      <a href="javascript:void(0)">Adipisicing sint excepteur officia voluptate tempor ea veniam veniam duis.</a>
      <a href="javascript:void(0)">
        Nostrud ad fugiat amet officia anim qui sit tempor veniam magna irure adipisicing ea adipisicing.
      </a>
      <a href="javascript:void(0)">
        Lorem adipisicing do duis sunt laboris magna officia irure fugiat velit deserunt duis enim in.
      </a>
    </sl-breadcrumbs>
    <sl-breadcrumbs aria-label="Breadcrumb trail 4">
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    </sl-breadcrumbs>
    <sl-breadcrumbs aria-label="Breadcrumb trail 5" inverted>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    </sl-breadcrumbs>
  `
};
