import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IconDefinition, IconLibrary, IconStyle } from './models.js';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';

declare global {
  interface Window {
    SLDS: {
      icons: IconLibrary;
    };
  }
}

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

window.SLDS ||= { icons: {} };

export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static availableStyles: IconStyle[] = [];

  private iconNotDef = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="icon-not-def"><path d="M64 390.3L153.5 256 64 121.7V390.3zM102.5 448H281.5L192 313.7 102.5 448zm128-192L320 390.3V121.7L230.5 256zM281.5 64H102.5L192 198.3 281.5 64zM0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48z"/></svg>`;
  // do we want to show something here? it would probably only cause flickering
  private iconLoading = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-loading"></svg>`;

  /**
   * Add icon(s) to the icon registry
   *
   * @param {IconDefinition | IconDefinition[] } faIcons One or more IconDefinition that have been imported from FontAwesome
   */
  static registerIcon(...faIcons: IconDefinition[]): void {
    // TODO: find a better (and more universal) way to only log these kind of warnings in dev mode
    const isDevMode = location.hostname === 'localhost';

    faIcons.forEach(icon => {
      if (window.SLDS.icons[`${icon.prefix}-${icon.iconName}`] && isDevMode) {
        console.warn(`Icon ${icon.prefix}-${icon.iconName} is already in the registry`);
        return;
      }

      const {
          icon: [width, height, , , path]
        } = icon,
        paths = Array.isArray(path) ? path : [path];
      const svg = `<svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${paths
        .map((p: string, i) => `<path d="${p}" fill="var(--fill-${Icon.getColorToken(i, icon.prefix)})"></path>`)
        .join('')}</svg>`;
      window.SLDS.icons[`${icon.prefix}-${icon.iconName}`] = { svg };
    });
  }

  /**
   * store all icons from the IconLibrary of the theme in the icon registry for easy access
   */
  static registerIcons(icons: IconLibrary): void {
    window.SLDS.icons = { ...window.SLDS.icons, ...icons };
  }

  static getColorToken(pathCounter: number, style: string): string {
    return pathCounter === 0 && style === 'fad' ? 'accent' : 'default';
  }

  /**
   * Describes the icon for assistive devices. If not present, the icon is considered
   * to be purely presentational.
   */
  @property() label?: string;

  /** The name of the icon to show. */
  @property() name?: string;

  /** Icon size. */
  @property({ reflect: true }) size: IconSize = 'md';

  getIconHTML(): string {
    if (!this.sldsLibrary) {
      return this.iconLoading;
    }
    if (!this.name) {
      return this.iconNotDef;
    }
    return this.sldsLibrary.icons[this.name] ? this.sldsLibrary.icons[this.name].svg : this.iconNotDef;
  }

  @state()
  iconHTML?: string = this.iconLoading;

  @state()
  sldsLibrary?: { icons: IconLibrary };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }

    await this.waitForWindowProperty().then(() => {
      this.sldsLibrary = window.SLDS;
      this.iconHTML = this.getIconHTML();
    });
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
  }

  override render(): TemplateResult {
    return html`${unsafeHTML(this.iconHTML)}`;
  }

  async waitForWindowProperty(): Promise<void> {
    return new Promise<void>(resolve => {
      const checkProperty = (): void => {
        if (window.SLDS?.icons && Object.keys(window.SLDS.icons).length > 0) {
          resolve();
        } else {
          setTimeout(checkProperty, 100); // check again in 100ms
        }
      };
      checkProperty();
    });
  }
}
