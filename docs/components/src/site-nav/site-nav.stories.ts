import {
  faBook,
  faBookmark,
  faCircleQuestion,
  faCodeBranch,
  faEnvelope,
  faFileLines,
  faHome,
  faInfoCircle,
  faLayerGroup,
  faShieldCheck
} from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { NavGroup } from './nav-group.js';
import { NavItem } from './nav-item.js';
import { SiteNav } from './site-nav.js';

Icon.register(
  faBook,
  faBookmark,
  faCircleQuestion,
  faCodeBranch,
  faEnvelope,
  faFileLines,
  faHome,
  faInfoCircle,
  faLayerGroup,
  faShieldCheck
);

type Props = Record<string, never>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-site-nav', SiteNav);
  customElements.define('doc-nav-group', NavGroup);
  customElements.define('doc-nav-item', NavItem);
} catch {
  /* empty */
}

function onNavClick(event: Event): void {
  const nav = event.currentTarget as HTMLElement,
    target = (event.target as HTMLElement).closest('doc-nav-item');

  if (!target || target.querySelector('doc-nav-item')) {
    return;
  }

  event.preventDefault();
  nav.querySelectorAll('doc-nav-item[active]').forEach(item => item.removeAttribute('active'));
  target.setAttribute('active', '');
}

export default {
  title: 'Site Navigation',
  render: () => {
    return html`
      <style>
        doc-site-nav {
          max-inline-size: 280px;
        }
      </style>
      <doc-site-nav @click=${onNavClick}>
        <doc-nav-group heading="Introduction">
          <doc-nav-item heading="Documentation" href="#" icon="far-book"></doc-nav-item>
          <doc-nav-item heading="FAQ" href="#" icon="far-circle-question"></doc-nav-item>
          <doc-nav-item heading="Privacy &amp; Security" href="#" icon="far-shield-check"></doc-nav-item>
        </doc-nav-group>

        <doc-nav-group heading="Getting Started">
          <doc-nav-item heading="Guides" icon="far-bookmark">
            <doc-nav-item heading="Intro" href="#"></doc-nav-item>
            <doc-nav-item heading="Setup" href="#"></doc-nav-item>
          </doc-nav-item>
          <doc-nav-item heading="User Manual" icon="far-file-lines">
            <doc-nav-item heading="Getting Started" href="#"></doc-nav-item>
          </doc-nav-item>
        </doc-nav-group>

        <doc-nav-group heading="Developers">
          <doc-nav-item heading="Contribute" icon="far-code-branch" open>
            <doc-nav-item heading="Code of Conduct" href="#"></doc-nav-item>
            <doc-nav-item heading="Translations" href="#"></doc-nav-item>
            <doc-nav-item heading="Homepage" href="#"></doc-nav-item>
            <doc-nav-item heading="Desktop" href="#" active></doc-nav-item>
            <doc-nav-item heading="Docs" href="#"></doc-nav-item>
          </doc-nav-item>
          <doc-nav-item heading="Mods Registry" icon="far-layer-group">
            <doc-nav-item heading="Mod List" href="#"></doc-nav-item>
          </doc-nav-item>
        </doc-nav-group>
      </doc-site-nav>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Collapsed: Story = {
  render: () => {
    return html`
      <style>
        doc-site-nav {
          max-inline-size: 280px;
        }
      </style>
      <doc-site-nav @click=${onNavClick}>
        <doc-nav-group heading="Introduction">
          <doc-nav-item heading="Documentation" href="#" icon="far-book"></doc-nav-item>
          <doc-nav-item heading="FAQ" href="#" icon="far-circle-question"></doc-nav-item>
        </doc-nav-group>
        <doc-nav-group heading="Developers">
          <doc-nav-item heading="Contribute" icon="far-code-branch">
            <doc-nav-item heading="Code of Conduct" href="#"></doc-nav-item>
            <doc-nav-item heading="Desktop" href="#"></doc-nav-item>
          </doc-nav-item>
        </doc-nav-group>
      </doc-site-nav>
    `;
  }
};

export const FlatItems: Story = {
  render: () => {
    return html`
      <style>
        doc-site-nav {
          max-inline-size: 280px;
        }
      </style>
      <doc-site-nav @click=${onNavClick}>
        <doc-nav-group heading="Pages">
          <doc-nav-item heading="Home" href="#" icon="far-home" active></doc-nav-item>
          <doc-nav-item heading="About" href="#" icon="far-info-circle"></doc-nav-item>
          <doc-nav-item heading="Contact" href="#" icon="far-envelope"></doc-nav-item>
        </doc-nav-group>
      </doc-site-nav>
    `;
  }
};

export const ActiveItem: Story = {
  render: () => {
    return html`
      <style>
        doc-site-nav {
          max-inline-size: 280px;
        }
      </style>
      <doc-site-nav @click=${onNavClick}>
        <doc-nav-group heading="Introduction">
          <doc-nav-item heading="Documentation" href="#" icon="far-book"></doc-nav-item>
          <doc-nav-item heading="FAQ" href="#" icon="far-circle-question"></doc-nav-item>
        </doc-nav-group>
        <doc-nav-group heading="Developers">
          <doc-nav-item heading="Contribute" icon="far-code-branch" open>
            <doc-nav-item heading="Code of Conduct" href="#"></doc-nav-item>
            <doc-nav-item heading="Translations" href="#" active></doc-nav-item>
            <doc-nav-item heading="Homepage" href="#"></doc-nav-item>
          </doc-nav-item>
          <doc-nav-item heading="Mods Registry" icon="far-layer-group">
            <doc-nav-item heading="Mod List" href="#"></doc-nav-item>
          </doc-nav-item>
        </doc-nav-group>
      </doc-site-nav>
    `;
  }
};
