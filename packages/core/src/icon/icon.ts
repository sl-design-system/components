import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { CustomIconDefinition, IconDefinition, IconLibrary, IconStyle } from './models.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';

declare global {
  interface Window {
    SLDS: {
      icons: IconLibrary;
    };
  }
}

window.SLDS ||= { icons: {} };

export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static availableStyles: IconStyle[] = [];

  private iconNotDef = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="icon-not-def"><path d="M64 390.3L153.5 256 64 121.7V390.3zM102.5 448H281.5L192 313.7 102.5 448zm128-192L320 390.3V121.7L230.5 256zM281.5 64H102.5L192 198.3 281.5 64zM0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48z"/></svg>`;

  /**
   * Add icon(s) to the icon registry
   *
   * @param {IconDefinition | IconDefinition[] } faIcons One or more IconDefinition that have been imported from FontAwesome
   */
  static registerIcon(...faIcons: IconDefinition[]): void {
    let isDevMode = process.argv[1].endsWith('webpack-dev-server') || process.argv[1].endsWith('webpack-dev-server.js');
    faIcons.forEach(icon => {
      if (window.SLDS.icons[`${icon.prefix}-${icon.iconName}`] && isDevMode) {
        console.warn(`Icon ${icon.prefix}-${icon.iconName} is already in the registry`);
        return;
      }

      const {
          icon: [width, height, , , path]
        } = icon,
        paths = Array.isArray(path) ? path : [path];
      const svg = `<svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">${paths
        .map(p => `<path d="${p}"></path>`)
        .join('')}</svg>`;
      window.SLDS.icons[`${icon.prefix}-${icon.iconName}`] = { svg };
    });
  }

  /**
   * store all icons from the IconLibrary of the theme in the icon registry for easy access
   */
  static registerIcons(icons: IconLibrary): void {
    window.SLDS.icons = icons;
  }

  /**
   * Describes the icon for assistive devices. If not present, the icon is considered
   * to be purely presentational.
   */
  @property() label?: string;

  /** The name of the icon to show. */
  @property() name?: string;

  get icons(): IconLibrary {
    return window.SLDS.icons;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // if (changes.has('label')) {
    if (this.label) {
      this.setAttribute('role', 'img');
      this.setAttribute('aria-label', this.label);
      this.removeAttribute('aria-hidden');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('aria-label');
      this.setAttribute('aria-hidden', 'true');
    }
    // }
  }

  override render(): TemplateResult {
    if (this.name) {
      return html`${unsafeHTML(this.#resolve(this.name))}`;
    } else {
      return html`${unsafeHTML(this.iconNotDef)}`;
    }
  }

  #resolve(name: string): string {
    return this.icons[name] ? (this.icons[name] as CustomIconDefinition).svg : this.iconNotDef;
  }
}
