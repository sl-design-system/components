import { faCircleCheck, faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './checklist.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'slds-checklist': Checklist;
  }
}

interface ChecklistItem {
  title: string;
  description: TemplateResult | void;
}

Icon.register(faCircleCheck, faCircleExclamation);

/**
 * A component to check if the SL Design System has been installed correctly.
 */
export class Checklist extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The items in the list. */
  @state() items: ChecklistItem[] = [];

  override firstUpdated(): void {
    // Delay the check to the next frame after first render to
    // give the application time to initialize.
    requestAnimationFrame(() => setTimeout(() => void this.check(), 100));
  }

  override render(): TemplateResult {
    return html`
      <link rel="stylesheet" href="https://use.typekit.net/kes1hoh.css" />
      <h1>SL Design System Checklist</h1>
      <p>
        Welcome to the Sanoma Learning Design System. You will find a checklist below of the steps described in our
        <a href="#" target="_blank">getting started for developers guide</a>.
      </p>

      ${this.items.map(
        item => html`
          <details .open=${!!item.description}>
            <summary @click=${(event: Event) => event.preventDefault()}>
              <sl-icon .name=${item.description ? 'fas-circle-exclamation' : 'fas-circle-check'} size="xl"></sl-icon>
              ${item.title}
            </summary>
            <p>${item.description}</p>
          </details>
        `
      )}

      <p>
        Id reprehenderit cupidatat veniam nisi consequat ad elit. In fugiat commodo aliqua excepteur incididunt. Culpa
        qui ex qui irure quis Lorem veniam minim ex sint. Excepteur aliqua pariatur exercitation nostrud minim cupidatat
        eiusmod.
      </p>
    `;
  }

  /** Perform the checks. */
  async check(): Promise<void> {
    this.items = [
      {
        title: 'CSS Custom Properties present',
        description: this.#checkTheme()
      },
      {
        title: 'Webfonts are available',
        description: await this.#checkFonts()
      },
      {
        title: 'Theme is set up correctly',
        description: this.#checkIcons()
      },
      {
        title: 'Button web component is loaded',
        description: this.#checkButton()
      }
    ];
  }

  #checkButton(): TemplateResult | void {
    if (!customElements.get('sl-button')) {
      return html`
        The <code>sl-button</code> component is not loaded. Make sure you have installed the button package and added
        the <code>import</code> statement to your application as described in the
        <a href="https://sanomalearning.design/categories/getting-started/developers/#start-using-components"
          >start using components</a
        >
        section.
      `;
    }
  }

  async #checkFonts(): Promise<TemplateResult | void> {
    const styles = getComputedStyle(this),
      required = ['--sl-text-typeset-font-family-body', '--sl-text-typeset-font-family-heading'].map(name =>
        styles.getPropertyValue(name)
      ),
      available = Array.from((await document.fonts.ready).keys()).map(ff => ff.family);

    if (!required.every(family => available.includes(family))) {
      return html`Not all required fonts are available. Your theme uses the font families
      ${required.map((family, index) => html`<code>${family}</code>${index < required.length - 1 ? ' and ' : ''}`)}. The
      fonts used in the theme are not a part of the theme package. Please make sure the fonts are loaded.`;
    }
  }

  #checkIcons(): TemplateResult | void {
    const iconCount = Object.keys(window.SLDS?.icons ?? {}).length;

    if (iconCount <= 2) {
      return html`
        The theme icons are not loaded. Please make sure you are calling the <code>setup()</code> method from the theme
        package as described in the
        <a href="https://sanomalearning.design/categories/getting-started/developers/#setup-a-theme">setup a theme</a>
        section.
      `;
    }
  }

  #checkTheme(): TemplateResult | void {
    const base = !!getComputedStyle(this).getPropertyValue('--sl-color-palette-white-base'),
      lightOrDark = !!getComputedStyle(this).getPropertyValue('--sl-color-surface-solid-primary-foreground');

    if (base && !lightOrDark) {
      return html`The base theme is set up correctly, but the tokens for the light or dark mode are missing. You likely
      need to include the stylesheet for the light or dark mode in your application.`;
    } else if (!base && !lightOrDark) {
      return html`We could not detect any theme tokens. Please make sure you have installed the theme package and added
        the stylesheets to your application as described in the
        <a href="https://sanomalearning.design/categories/getting-started/developers/#setup-a-theme">setup a theme</a>
        section.`;
    }
  }
}
