import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { Search } from '../search/search.js';
import { SiteNav } from '../site-nav/site-nav.js';
import { ThemeSwitch } from '../theme-switch/theme-switch.js';
import styles from './sidebar.css' with { type: 'css' };

Icon.register(faGithub);

export class Sidebar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'doc-search': Search,
      'doc-site-nav': SiteNav,
      'doc-theme-switch': ThemeSwitch,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  render(): TemplateResult {
    return html`
      <header>
        <a href="/" aria-label="SL Design System">
          <img class="logo-light" src="/assets/logo-black.svg" alt="SL Design System" width="179" height="32" />
          <img class="logo-dark" src="/assets/logo.svg" alt="SL Design System" width="179" height="32" />
        </a>
      </header>

      <doc-search></doc-search>

      <doc-site-nav>
        <slot></slot>
      </doc-site-nav>

      <footer>
        <a href="https://github.com/sl-design-system/components" target="_blank" rel="noopener noreferrer">
          <sl-icon name="fab-github"></sl-icon>
        </a>
        <doc-theme-switch></doc-theme-switch>
      </footer>
    `;
  }
}
