import { faMoonStars, faSunBright } from '@fortawesome/pro-solid-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Switch } from '@sl-design-system/switch';
import { LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';

export type ColorScheme = 'light' | 'dark';

Icon.register(faMoonStars, faSunBright);

export class ThemeSwitch extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-switch': Switch
    };
  }

  /** The current color scheme. */
  @property({ reflect: true, attribute: 'color-scheme' }) colorScheme: ColorScheme = 'light';

  connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('color-scheme')) {
      this.colorScheme = this.#getPreferredColorScheme();
    }

    this.#applyColorScheme();
  }

  render(): TemplateResult {
    return html`
      <sl-switch
        @sl-change=${this.#onChange}
        ?checked=${this.colorScheme === 'dark'}
        aria-label="Switch between light and dark mode"
        icon-on="fas-moon-stars"
        icon-off="fas-sun-bright"
      ></sl-switch>
    `;
  }

  #onChange(): void {
    this.colorScheme = this.colorScheme === 'light' ? 'dark' : 'light';
    this.#applyColorScheme();
  }

  #applyColorScheme(): void {
    document.documentElement.setAttribute('data-color-scheme', this.colorScheme);

    const themeLink = document.getElementById('theme-css') as HTMLLinkElement | null;
    if (themeLink) {
      themeLink.href = `/theme/${this.colorScheme}.css`;
    }
  }

  #getPreferredColorScheme(): ColorScheme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
