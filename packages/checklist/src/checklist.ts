import { faCircleCheck, faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Skeleton } from '@sl-design-system/skeleton';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './checklist.scss.js';
import theMessageFontFace from './the-message-font-face.js';

declare global {
  interface HTMLElementTagNameMap {
    'slds-checklist': Checklist;
  }
}

interface ChecklistItem {
  title: string;
  description: TemplateResult | void;
}

const SANOMA_LEARNING_TYPEKIT_URL = 'https://use.typekit.net/kes1hoh.css';

Icon.register(faCircleCheck, faCircleExclamation);

/**
 * A component to check if the SL Design System has been installed correctly.
 */
@customElement('slds-checklist')
export class Checklist extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-skeleton': Skeleton
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The items in the list. */
  @state() items: ChecklistItem[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    void this.#setupFonts();

    // Delay the check to give the application time to initialize.
    setTimeout(() => void this.check(), 2000);
  }

  override render(): TemplateResult {
    return html`
      <h1>SL Design System Checklist</h1>
      <p>
        Welcome to the Sanoma Learning Design System. You will find a checklist below of the steps described in our
        <a href="https://sanomalearning.design/categories/getting-started/developers/" target="_blank"
          >getting started for developers guide</a
        >
        🚀.
      </p>

      ${this.items?.length ? this.renderItems() : this.renderSkeletons()}

      <p>
        📚 You can find the documentation for the SL Design System at
        <a href="https://sanomalearning.design" target="_blank">sanomalearning.design</a>. If you have any questions or
        need help, you can reach out to us on
        <a href="https://sanoma.slack.com/archives/C03SA9HUUA3" target="_blank">Slack</a> or
        <a href="https://github.com/sl-design-system/components/issues" target="_blank">GitHub</a>.
      </p>
    `;
  }

  renderItems(): TemplateResult[] {
    return this.items.map(
      item => html`
        <details .open=${!!item.description}>
          <summary @click=${(event: Event) => event.preventDefault()}>
            <sl-icon .name=${item.description ? 'fas-circle-exclamation' : 'fas-circle-check'} size="xl"></sl-icon>
            <span>${item.title}</span>
          </summary>
          <p>${item.description}</p>
        </details>
      `
    );
  }

  renderSkeletons(): TemplateResult {
    return html`
      <ul>
        ${Array.from({ length: 4 }).map(
          () => html`
            <li>
              <sl-skeleton class="icon"></sl-skeleton>
              <sl-skeleton class="title"></sl-skeleton>
            </li>
          `
        )}
      </ul>
    `;
  }

  /** Perform the checks. */
  async check(): Promise<void> {
    this.items = [
      {
        title: 'Load CSS Custom Properties',
        description: this.#checkTheme()
      },
      {
        title: 'Load web fonts',
        description: await this.#checkFonts()
      },
      {
        title: 'Set up theme',
        description: this.#checkIcons()
      },
      {
        title: 'Load button web component',
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
    if (this.#checkTheme()) {
      return html`We cannot check the fonts until the CSS Custom Properties are loaded. Please fix this first.`;
    }

    const styles = getComputedStyle(this),
      required = ['--sl-text-typeset-font-family-body', '--sl-text-typeset-font-family-heading'].map(name =>
        styles.getPropertyValue(name)
      ),
      available = Array.from((await document.fonts.ready).keys()).map(ff => ff.family);

    if (!required.every(family => available.includes(family))) {
      return html`Not all required fonts are available. Your theme uses the font families
      ${required.map((family, index) => html`<code>${family}</code>${index < required.length - 1 ? ' and ' : ''}`)}. The
      fonts used in the theme are not a part of the theme package. Please make sure the fonts are loaded and the
      font-family names match the exact spelling used in the Design System tokens.`;
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
    const base = !!getComputedStyle(this.parentElement!).getPropertyValue('--sl-color-palette-white-base'),
      lightOrDark = !!getComputedStyle(this.parentElement!).getPropertyValue(
        '--sl-color-surface-solid-primary-foreground'
      );

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

  async #setupFonts(): Promise<void> {
    const link = document.querySelector(`link[href="${SANOMA_LEARNING_TYPEKIT_URL}"]`);

    if (!link) {
      const link = document.createElement('link');

      link.href = SANOMA_LEARNING_TYPEKIT_URL;
      link.rel = 'stylesheet';

      // Loading web fonts inside of the shadow DOM doesn't work, so we need to add the link to the document head.
      document.head.appendChild(link);
    }

    const fonts = await document.fonts.ready;
    if (![...fonts.keys()].find(ff => ff.family === 'the-message')) {
      const style = document.createElement('style');
      style.innerText = theMessageFontFace;

      document.head.appendChild(style);
    }
  }
}
