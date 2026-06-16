import {
  faBook,
  faCircleQuestion,
  faCodeBranch,
  faLayerGroup,
  faShieldCheck
} from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { NavGroup } from './nav-group.js';
import { NavItem } from './nav-item.js';

Icon.register(faBook, faCircleQuestion, faCodeBranch, faLayerGroup, faShieldCheck);

type Props = Pick<NavGroup, 'collapsed' | 'collapsible' | 'heading' | 'href'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-nav-group', NavGroup);
  customElements.define('doc-nav-item', NavItem);
} catch {
  /* empty */
}

export default {
  title: 'Site Navigation/Nav Group',
  args: {
    heading: 'Introduction'
  },
  render: ({ collapsed, collapsible, heading, href }) => {
    return html`
      <style>
        doc-nav-group {
          max-inline-size: 280px;
        }
      </style>
      <doc-nav-group .heading=${heading} .href=${href} .collapsible=${collapsible} .collapsed=${collapsed}>
        <doc-nav-item heading="Documentation" href="#" icon="far-book"></doc-nav-item>
        <doc-nav-item heading="FAQ" href="#" icon="far-circle-question"></doc-nav-item>
        <doc-nav-item heading="Privacy &amp; Security" href="#" icon="far-shield-check"></doc-nav-item>
      </doc-nav-group>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const WithLink: Story = {
  args: {
    href: '#'
  }
};

export const Collapsible: Story = {
  args: {
    collapsible: true
  }
};

export const Collapsed: Story = {
  args: {
    collapsible: true,
    collapsed: true
  }
};

export const MultipleGroups: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          max-inline-size: 280px;
        }
      </style>
      <div class="wrapper">
        <doc-nav-group heading="Introduction">
          <doc-nav-item heading="Documentation" href="#" icon="far-book"></doc-nav-item>
          <doc-nav-item heading="FAQ" href="#" icon="far-circle-question"></doc-nav-item>
        </doc-nav-group>
        <doc-nav-group heading="Developers" collapsible>
          <doc-nav-item heading="Contribute" icon="far-code-branch" open>
            <doc-nav-item heading="Code of Conduct" href="#"></doc-nav-item>
            <doc-nav-item heading="Translations" href="#"></doc-nav-item>
          </doc-nav-item>
          <doc-nav-item heading="Mods Registry" icon="far-layer-group">
            <doc-nav-item heading="Mod List" href="#"></doc-nav-item>
          </doc-nav-item>
        </doc-nav-group>
      </div>
    `;
  }
};
