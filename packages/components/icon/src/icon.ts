import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';
import { type IconDefinition, type IconLibrary } from './models.js';

declare global {
  interface Window {
    SLDS: {
      icons: IconLibrary;
    };
  }
}

export type IconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

window.SLDS ||= { icons: {} };

const isIconDefinition = (icon: IconDefinition | IconLibrary): icon is IconDefinition => {
  return 'icon' in icon;
};

/**
 * An icon that uses either FontAwesome custom svg's straight from Figma.
 *
 * ```html
 *   <sl-icon name="unicorn"></sl-icon>
 * ```
 *
 * @cssprop --sl-icon-container-size - The size of the icon container, defaults to md
 * @cssprop --sl-icon-fill-accent - Accent color, only used for multicolor icons
 * @cssprop --sl-icon-fill-default - Default fill color
 * @cssprop --sl-icon-size - The size of the svg element, defaults to md
 */
export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  private iconNotDef =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="icon-not-def"><path d="M64 390.3L153.5 256 64 121.7V390.3zM102.5 448H281.5L192 313.7 102.5 448zm128-192L320 390.3V121.7L230.5 256zM281.5 64H102.5L192 198.3 281.5 64zM0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48z"/></svg>';
  // do we want to show something here? it would probably only cause flickering
  private iconLoading = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-loading"></svg>';

  /**
   * Add icon(s) to the icon registry
   *
   * @param {IconDefinition | IconDefinition[] } icons One or more IconDefinition that have been imported from FontAwesome
   */
  static register(...icons: IconDefinition[]): void;

  /**
   * Store all icons from the IconLibrary of the theme (icons.json) in the icon registry for easy access.
   * Is run in the setup method of each theme.
   *
   * @param {IconLibrary} icons The IconLibrary of the theme
   */
  static register(icons: IconLibrary): void;

  static register(icon: IconDefinition | IconLibrary, ...icons: IconDefinition[]): void {
    // TODO: find a better (and more universal) way to only log these kind of warnings in dev mode
    const isDevMode = location.hostname === 'localhost';

    if (isIconDefinition(icon)) {
      [icon, ...icons].forEach(i => {
        if (window.SLDS.icons[`${i.prefix}-${i.iconName}`] && isDevMode) {
          console.warn(`Icon ${i.prefix}-${i.iconName} is already in the registry`);
          return;
        }

        const {
            icon: [width, height, , , path]
          } = i,
          paths = Array.isArray(path) ? path : [path];

        const svg = `
          <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            ${paths
              .map(
                (p: string, idx) =>
                  `<path d="${p}" fill="var(--sl-icon-fill-${Icon.getColorToken(idx, i.prefix)})"></path>`
              )
              .join('')}
          </svg>
        `;

        window.SLDS.icons[`${i.prefix}-${i.iconName}`] = { svg, type: 'RegisteredIcon' };
      });
    } else {
      window.SLDS.icons = { ...window.SLDS.icons, ...icon };
    }
  }

  private static getColorToken(pathCounter: number, style: string): string {
    return pathCounter === 0 && style === 'fad' ? 'accent' : 'default';
  }

  /**
   * The label of the icon; Describes the icon for assistive devices. If not present, the icon is considered
   * to be purely presentational.
   */
  @property() label?: string;

  /** The name of the icon; either the name from Font Awesome or the name of the custom icon in Figma. */
  @property() name?: string;

  /**
   * The size of the icon.
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'}
   */
  @property({ reflect: true }) size?: IconSize;

  #getIconHTML(): string {
    if (!this.sldsLibrary) {
      return this.iconLoading;
    }
    if (!this.name) {
      return this.iconNotDef;
    }
    return this.sldsLibrary.icons[this.name] ? this.sldsLibrary.icons[this.name].svg : this.iconNotDef;
  }

  /** @private */
  @state()
  iconHTML?: string = this.iconLoading;

  /** @private */
  @state()
  sldsLibrary?: { icons: IconLibrary };

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    await this.#waitForWindowProperty(this.name);
    this.sldsLibrary = window.SLDS;
    this.iconHTML = this.#getIconHTML();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('name')) {
      this.iconHTML = this.#getIconHTML();
    }

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

  /**
   * sometimes the icon tries to render before any icons are registered,
   * that's why we need to check if the icons have been registered, and if not
   * we need to wait a bit and then check again, so we can (re)render the icon when the library is set.
   */

  async #waitForWindowProperty(name: string | undefined): Promise<void> {
    let tries = 0;

    await new Promise<void>(resolve => {
      const checkProperty = (): void => {
        if (window.SLDS?.icons && Object.keys(window.SLDS.icons).length > 0) {
          if (name && window.SLDS?.icons[name]) {
            resolve();
          } else if (tries > 10) {
            resolve();
          } else {
            // wait for a bit and see if the wanted icon has been added in the mean time
            setTimeout(checkProperty, 100); // check again in 100ms
            tries++;
          }
        } else {
          // wait for init of component library, this should be quick
          setTimeout(checkProperty, 100); // check again in 100ms
        }
      };

      checkProperty();
    });
  }
}
