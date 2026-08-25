import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/popover/register.js';
import '@sl-design-system/tooltip/register.js';
import { html } from 'lit';
import '../register.js';
export default {
  title: 'Navigation/Breadcrumbs',
  parameters: {
    viewport: { disable: true }
  },
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
  render: ({ breadcrumbs, hideHomeLabel, inverted, homeUrl, noHome }) => html`
    <style>
      sl-breadcrumbs[inverted] {
        background: var(--sl-color-palette-grey-900);
      }
      #storybook-root {
        max-width: calc(100vw - 2rem);
      }
    </style>
    <sl-breadcrumbs
      .hideHomeLabel=${hideHomeLabel}
      .homeUrl=${homeUrl}
      ?inverted=${inverted}
      ?no-home=${noHome}
      >${breadcrumbs()}</sl-breadcrumbs
    >
  `
};
export const Basic = {
  args: {
    breadcrumbs: () => html`
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    `
  }
};
export const Collapse = {
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
export const HomeUrl = {
  args: {
    ...Basic.args,
    homeUrl: 'https://example.com'
  }
};
export const Inverted = {
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
export const Mobile = {
  ...Basic,
  parameters: {
    viewport: {
      defaultViewport: 'mobile'
    }
  }
};
export const NoHome = {
  args: {
    ...Basic.args,
    noHome: true
  }
};
export const HideHomeLabel = {
  args: {
    ...Basic.args,
    hideHomeLabel: true
  }
};
export const CustomHome = {
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
export const Overflow = {
  args: {
    breadcrumbs: () => html`
      <a href="javascript:void(0)">
        Commodo nisi ut mollit adipisicing esse fugiat Lorem irure do.
      </a>
      <a href="javascript:void(0)">Adipisicing sint excepteur officia voluptate.</a>
      <a href="javascript:void(0)">
        Nostrud ad fugiat amet officia anim qui sit tempor veniam magna.
      </a>
      <a href="javascript:void(0)">
        Lorem adipisicing do duis sunt laboris magna officia irure fugiat.
      </a>
    `
  }
};
export const CustomStyledLinks = {
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
    <a href="javascript:void(0)">Custom Styled Link</a> has css styles applied to it. This is to
    demonstrate that the links in the breadcrumbs always have the component styling applied even
    when global styles are used.
    <sl-breadcrumbs aria-label="Breadcrumb trail 1">
      <a href="javascript:void(0)">Lorem</a>
      <a href="javascript:void(0)">Ipsum</a>
      <a href="javascript:void(0)">Dolar</a>
    </sl-breadcrumbs>
  `
};
export const All = {
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
      <a href="javascript:void(0)"
        >Adipisicing sint excepteur officia voluptate tempor ea veniam veniam duis.</a
      >
      <a href="javascript:void(0)">
        Nostrud ad fugiat amet officia anim qui sit tempor veniam magna irure adipisicing ea
        adipisicing.
      </a>
      <a href="javascript:void(0)">
        Lorem adipisicing do duis sunt laboris magna officia irure fugiat velit deserunt duis enim
        in.
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
//# sourceMappingURL=breadcrumbs.stories.js.map
