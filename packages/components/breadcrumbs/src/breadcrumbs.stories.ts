import '@sl-design-system/button/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Breadcrumbs } from './breadcrumbs.js';

type Props = Pick<Breadcrumbs, 'hideHomeLabel' | 'inverted' | 'homeUrl' | 'noHome'> & { breadcrumbs(): TemplateResult };
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Breadcrumbs',
  tags: ['stable'],
  args: {
    hideHomeLabel: false,
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
  render: ({ breadcrumbs, hideHomeLabel, inverted, homeUrl, noHome }) => html`
    <style>
      sl-breadcrumbs[inverted] {
        background: var(--sl-color-palette-grey-900);
      }
      #storybook-root {
        max-width: calc(100vw - 2rem);
      }
    </style>
    <sl-breadcrumbs .hideHomeLabel=${hideHomeLabel} .homeUrl=${homeUrl} ?inverted=${inverted} ?no-home=${noHome}
      >${breadcrumbs()}</sl-breadcrumbs
    >
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

export const HideHomeLabel: Story = {
  args: {
    ...Basic.args,
    hideHomeLabel: true
  }
};

export const CustomHome: Story = {
  args: {
    ...Basic.args,
    breadcrumbs: () => html`
      <a href="javascript:void(0)" slot="home"><sl-icon name="home-blank"></sl-icon> Custom Home</a>
      <a href="javascript:void(0)">Page 1</a>
      <a href="javascript:void(0)">Page 2</a>
      <a href="javascript:void(0)">Page 3</a>
    `
  }
};

export const Overflow: Story = {
  args: {
    breadcrumbs: () => html`
      <a href="javascript:void(0)">1 Adipisicing sint excepteur officia voluptate.</a>
      <a href="javascript:void(0)">2 Nostrud ad fugiat amet officia anim qui sit tempor veniam magna.</a>
      <a href="javascript:void(0)">3 Lorem adipisicing do duis sunt laboris magna officia irure fugiat.</a>
    `
  }
};

export const CustomStyledLinks: Story = {
  render: () => html`
    <style>
      a[href] {
        color: var(--sl-color-foreground-accent-red-bold);
      }

      a[href]:hover {
        color: var(--sl-color-foreground-accent-orange-bold);
      }

      a[href]:active {
        color: var(--sl-color-foreground-accent-purple-bold);
      }
    </style>
    <a href="javascript:void(0)">Custom Styled Link 1</a>
    <sl-breadcrumbs aria-label="Breadcrumb trail 1" no-home>
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    </sl-breadcrumbs>
  `
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
      <a href="javascript:void(0)">Lorem 1</a>
      <a href="javascript:void(0)">Ipsum 2</a>
      <a href="javascript:void(0)">Dolar 3</a>
      <a href="javascript:void(0)">Lorem 4</a>
      <a href="javascript:void(0)">Ipsum 5</a>
      <a href="javascript:void(0)">Dolar 6</a>
      <a href="javascript:void(0)">Lorem 7</a>
      <a href="javascript:void(0)">Ipsum 8</a>
      <a href="javascript:void(0)">Dolar 9</a>
    </sl-breadcrumbs>
    <sl-breadcrumbs aria-label="Breadcrumb trail 5" inverted>
      <a href="javascript:void(0)">Lorem 1</a>
      <a href="javascript:void(0)">Ipsum 2</a>
      <a href="javascript:void(0)">Dolar 3</a>
      <a href="javascript:void(0)">Lorem 4</a>
      <a href="javascript:void(0)">Ipsum 5</a>
      <a href="javascript:void(0)">Dolar 6</a>
      <a href="javascript:void(0)">Lorem 7</a>
      <a href="javascript:void(0)">Ipsum 8</a>
      <a href="javascript:void(0)">Dolar 9</a>
    </sl-breadcrumbs>
  `
};
