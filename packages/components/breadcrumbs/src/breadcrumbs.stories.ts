import '@sl-design-system/button/register.js';
import '@sl-design-system/popover/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type Breadcrumbs } from './breadcrumbs.js';

type Props = Pick<Breadcrumbs, 'hideHomeLabel' | 'inverted' | 'homeUrl' | 'noHome'> & {
  breadcrumbs(): TemplateResult;
  explanation(): TemplateResult | typeof nothing;
};
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Breadcrumbs',
  tags: ['stable'],
  args: {
    hideHomeLabel: false,
    inverted: false,
    homeUrl: '/',
    noHome: false,
    explanation: () => nothing
  },
  argTypes: {
    explanation: {
      description:
        'Adds explanatory content above the breadcrumbs example to describe the purpose or behavior of this story variant.',
      table: {
        disable: true
      }
    },
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
  render: ({ explanation, breadcrumbs, hideHomeLabel, inverted, homeUrl, noHome }) => html`
    <style>
      sl-breadcrumbs[inverted] {
        background: var(--sl-color-palette-grey-900);
      }
      #storybook-root {
        max-width: calc(100vw - 2rem);
      }
    </style>
    ${explanation()}
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

export const BasicBreadcrumbItem: Story = {
  args: {
    explanation: () => html`
      <p>
        This story uses <code>sl-breadcrumb-item</code> components instead of anchor tags. This can come in handy when
        you can't use an anchor tag but need to bind click events to a different tag.
      </p>
      <p>
        <code>sl-breadcrumb-item</code> itself will not be visible but will be referred to by the breadcrumbs component,
        which delegates the click on the link inside the breadcrumbs component to this component.
      </p>
    `,
    breadcrumbs: () => html`
      <sl-breadcrumb-item @click=${() => console.log('Lorem button clicked')}>Lorem</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Ipsum button clicked')}>Ipsum</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Dolar button clicked')}>Dolar</sl-breadcrumb-item>
    `
  }
};

export const OverflowBreadcrumbItem: Story = {
  args: {
    explanation: () => html`
      <p>
        This story uses <code>sl-breadcrumb-item</code> components instead of anchor tags. This can come in handy when
        you can't use an anchor tag but need to bind click events to a different tag.
      </p>
      <p>
        <code>sl-breadcrumb-item</code> itself will not be visible but will be referred to by the breadcrumbs component,
        which delegates the click on the link inside the breadcrumbs component to this component.
      </p>
    `,
    breadcrumbs: () => html`
      <sl-breadcrumb-item @click=${() => console.log('Lorem 1 button clicked')}>Lorem 1</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Ipsum 1 button clicked')}>Ipsum 1</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Dolar 1 button clicked')}>Dolar 1</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Lorem 2 button clicked')}>Lorem 2</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Ipsum 2 button clicked')}>Ipsum 2</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Dolar 2 button clicked')}>Dolar 2</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Lorem 3 button clicked')}>Lorem 3</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Ipsum 3 button clicked')}>Ipsum 3</sl-breadcrumb-item>
      <sl-breadcrumb-item @click=${() => console.log('Dolar 3 button clicked')}>Dolar 3</sl-breadcrumb-item>
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
