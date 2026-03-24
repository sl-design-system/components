import { faBook, faBookmark, faCodeBranch, faFileLines, faHome } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { NavGroup } from './nav-group.js';
import { NavItem } from './nav-item.js';

Icon.register(faBook, faBookmark, faCodeBranch, faFileLines, faHome);

type Props = Pick<NavItem, 'active' | 'heading' | 'href' | 'icon' | 'open'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-nav-group', NavGroup);
  customElements.define('doc-nav-item', NavItem);
} catch {
  /* empty */
}

export default {
  title: 'Site Navigation/Nav Item',
  args: {
    heading: 'Documentation',
    href: '#',
    icon: 'far-book'
  },
  argTypes: {
    icon: {
      control: 'text'
    }
  },
  render: ({ active, heading, href, icon }) => {
    return html`
      <style>
        doc-nav-group {
          max-inline-size: 280px;
        }
      </style>
      <doc-nav-group>
        <doc-nav-item .heading=${heading} .href=${href} .icon=${icon} .active=${active}></doc-nav-item>
      </doc-nav-group>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Active: Story = {
  args: {
    active: true
  }
};

export const WithoutIcon: Story = {
  args: {
    icon: undefined
  }
};

export const Expandable: Story = {
  args: {
    heading: 'Guides',
    href: undefined,
    icon: 'far-bookmark'
  },
  render: ({ active, heading, icon, open }) => {
    return html`
      <style>
        doc-nav-group {
          max-inline-size: 280px;
        }
      </style>
      <doc-nav-group>
        <doc-nav-item .heading=${heading} .icon=${icon} .active=${active} .open=${open}>
          <doc-nav-item heading="Intro" href="javascript:void(0)"></doc-nav-item>
          <doc-nav-item heading="Setup" href="javascript:void(0)"></doc-nav-item>
          <doc-nav-item heading="Configuration" href="javascript:void(0)"></doc-nav-item>
        </doc-nav-item>
      </doc-nav-group>
    `;
  }
};

export const ExpandableOpen: Story = {
  args: {
    heading: 'Guides',
    href: undefined,
    icon: 'far-bookmark',
    open: true
  },
  render: Expandable.render
};

export const Nested: Story = {
  render: () => {
    return html`
      <style>
        doc-nav-group {
          max-inline-size: 280px;
        }
      </style>
      <doc-nav-group>
        <doc-nav-item heading="Contribute" icon="far-code-branch" open>
          <doc-nav-item heading="Code of Conduct"></doc-nav-item>
          <doc-nav-item heading="Translations"></doc-nav-item>
          <doc-nav-item heading="Homepage" active></doc-nav-item>
          <doc-nav-item heading="Desktop"></doc-nav-item>
        </doc-nav-item>
        <doc-nav-item heading="User Manual" icon="far-file-lines">
          <doc-nav-item heading="Getting Started"></doc-nav-item>
        </doc-nav-item>
      </doc-nav-group>
    `;
  }
};
